
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const { context, getOctokit } = require("@actions/github");

const AI_MODEL = "openai/gpt-5.4"; // or "groq/llama3‑70b", "anthropic/claude‑3‑sonnet", "gemini/gemini‑1.5‑flash"
const AI_BASE_URL =
  AI_MODEL.startsWith("openai") ? "https://api.openai.com" :
//   AI_MODEL.startsWith("groq") ? "https://api.groq.com/openai" :
//   AI_MODEL.startsWith("anthropic") ? "https://api.anthropic.com" :
//   AI_MODEL.startsWith("gemini") ? "https://generativelanguage.googleapis.com" :
  null;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const PR_REVIEW_RULES = `
- Check for security issues: SQL injection, XSS, hardcoded secrets, unsafe eval().
- Prefer async/await over nested callbacks.
- Ensure new endpoints have tests and OpenAPI docs if applicable.
- Avoid console.log in production‑bound code.
- Validate error handling and logging.
- Prefer small, focused commits.
`;

async function getPrData() {
  const { repo, pull_request } = context.payload;
  const { owner, name } = repo.owner.login;  //,repo.name

  const octokit = getOctokit(process.env.GITHUB_TOKEN);

  const { data: pr } = await octokit.rest.pulls.get({
    owner: owner,
    repo: name,
    pull_number: pull_request.number,
  });

  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo: name,
    pull_number: pull_request.number,
  });

  return { pr, files, owner, repo: name, prNumber: pull_request.number };
}

async function callAI(diffText) {
  const prompt = `
You are an AI PR reviewer.

PR review rules:
${PR_REVIEW_RULES}

diff:
${diffText}

Respond in JSON with:
- "summary": short high‑level comment
- "comments": an array of:
  - "path": file path
  - "line": target line number
  - "body": suggestion comment
`;

  let body, headers;

  if (AI_MODEL.startsWith("openai") || AI_MODEL.startsWith("groq")) {
    body = JSON.stringify({
      model: AI_MODEL.split("/")[1],
      messages: [{ role: "user", content: prompt }],
    });

    headers = {
      "Authorization": `Bearer ${AI_API_KEY}`,
      "Content-Type": "application/json",
    };
  } else if (AI_MODEL.startsWith("anthropic")) {
    body = JSON.stringify({
      model: AI_MODEL.split("/")[1],
      messages: [{ role: "user", content: prompt }],
    });

    headers = {
      "x-api-key": AI_API_KEY,
      "anthropic-version": "2023‑06‑01",
      "Content-Type": "application/json",
    };
  } else if (AI_MODEL.startsWith("gemini")) {
    const modelName = AI_MODEL.split("/")[1];
    body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    });

    headers = { "Content-Type": "application/json" };

    AI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${AI_API_KEY}`;
  }

  const url = AI_MODEL.startsWith("gemini")
    ? AI_BASE_URL
    : `${AI_BASE_URL}/v1/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  const rawResult = await res.json();

  // parse text → JSON
  const text =
    AI_MODEL.startsWith("gemini")
      ? rawResult?.candidates?.[0]?.content?.parts?.[0]?.text
      : rawResult?.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("AI output not valid JSON:", text);
    return { summary: "AI review failed; see logs.", comments: [] };
  }
}

async function postComments(octokit, owner, repo, prNumber, aiResult) {
  // 1. Post summary comment
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: aiResult.summary,
  });

  // 2. Post inline comments (optional)
  for (const c of aiResult.comments) {
    try {
      await octokit.rest.pulls.createReviewComment({
        owner,
        repo,
        pull_number: prNumber,
        body: c.body,
        path: c.path,
        line: c.line,
      });
    } catch (err) {
      console.error(`Failed to post comment on ${c.path}:${c.line}:`, err);
    }
  }
}

async function main() {
  const { owner, repo, prNumber, files } = await getPrData();

  // build diff text
  const diffText = files
    .map(f => `--- ${f.filename}
${f.patch || ""}`)
    .join("");

  const aiResult = await callAI(diffText);

  const octokit = getOctokit(process.env.GITHUB_TOKEN);

  await postComments(octokit, owner, repo, prNumber, aiResult);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});