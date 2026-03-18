const functions = require("firebase-functions");
// import * as functions from "firebase-functions/v1";
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const { getFirestore } = require("firebase-admin/firestore");
const { onCall } = require("firebase-functions/v2/https");
const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors')({ origin: true });
const { Octokit } = require('@octokit/core');
const fetch = require("node-fetch");



const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/webhook', async (req, res) => {
    const { action, label, pull_request, repository } = req.body;

    // 1. Check if the action was "labeled" and the label is "Needs review"
    if (action === 'labeled' && label.name === 'Needs-review') {
        const prNumber = pull_request.number;
        const repoFullname = repository.full_name;

        // 2. Fetch the PR Diff from GitHub
        const diffResponse = await axios.get(pull_request.diff_url);
        const codeDiff = diffResponse.data;

        // 3. Send Diff to your AI Logic
        const aiReview = await getAiReview(codeDiff);

        // 4. Post the comment back to the PR
        await axios.post(
            `https://api.github.com/repos/${repoFullname}/issues/${prNumber}/comments`,
            { body: `### 🤖 Web-App Code Review\n\n${aiReview}` },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
    }
    res.status(200).send('OK');
});

async function getAiReview(diff) {
    // Logic to call OpenAI/Gemini/Claude goes here
    return "The code looks good, but consider adding error handling on line 42.";
}

app.listen(3000, () => console.log('Review server running on port 3000'));



// admin.initializeApp();
// const db = admin.firestore();

// const app = express()
// app.use(bodyParser.json())

// // add document
// exports.addDocument = onCall(async (request) => {
//   try {
//     // Check if user is authenticated
//     if (!request.auth) {
//       throw new Error("Unauthorized: User must be authenticated");
//     }

//     // Get the authenticated user's UID
//     const uid = request.auth.uid;

//     // Extract collection name and document data from request.data
//     const { collectionName, data } = request.data;

//     // Validate collectionName
//     if (!collectionName || typeof collectionName !== "string" || collectionName.trim() === "") {
//       throw new Error("Invalid or missing collectionName in request body");
//     }

//     // Proceed with adding the document to the specified collection
//     const doc = await getFirestore().collection(collectionName).add({
//       ...data,
//       createdBy: uid,
//     });

//     return { result: `Document with id:${doc.id} successfully added to collection ${collectionName}.` };
//   } catch (error) {
//     // Handle specific errors
//     if (error.message === "Unauthorized: User must be authenticated") {
//       throw new Error("Unauthorized");
//     }
//     throw new Error(`Error: ${error.message}`);
//   }
// });

// // get document
// exports.getDocuments = functions.https.onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     try {
//       // Log request details for debugging
//       console.log('Request received:', {
//         method: req.method,
//         query: req.query,
//         body: req.body,
//         headers: req.headers,
//         origin: req.headers.origin,
//       });

//       // Restrict to GET requests
//       if (req.method !== 'GET') {
//         res.status(405).send('Method Not Allowed: Only GET requests are supported');
//         return;
//       }

//       // Extract and validate Authorization header
//       const authHeader = req.get('Authorization');
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         res.status(401).send('Unauthorized: Missing or invalid Authorization header');
//         return;
//       }

//       const idToken = authHeader.split('Bearer ')[1];
//       let decodedToken;
//       try {
//         decodedToken = await admin.auth().verifyIdToken(idToken);
//       } catch (error) {
//         console.error('Token verification error:', {
//           message: error.message,
//           stack: error.stack,
//         });
//         res.status(401).send('Unauthorized: Invalid or expired token');
//         return;
//       }

//       const uid = decodedToken.uid;

//       // Extract collectionName and optional documentId from query parameters
//       const { collectionName, documentId } = req.query;

//       // Validate collectionName
//       if (!collectionName || typeof collectionName !== 'string' || collectionName.trim() === '') {
//         res.status(400).send('Bad Request: Invalid or missing collectionName in query parameters');
//         return;
//       }

//       // Reference to the Firestore collection
//       const collectionRef = admin.firestore().collection(collectionName);

//       // If documentId is provided, fetch a single document
//       if (documentId) {
//         if (typeof documentId !== 'string' || documentId.trim() === '') {
//           res.status(400).send('Bad Request: Invalid documentId in query parameters');
//           return;
//         }

//         const docRef = collectionRef.doc(documentId);
//         const docSnap = await docRef.get();

//         if (!docSnap.exists) {
//           res.status(404).send(`Document with id:${documentId} does not exist in collection ${collectionName}`);
//           return;
//         }

//         res.status(200).json({
//           result: `Successfully retrieved document with id:${documentId} from collection ${collectionName}.`,
//           document: { id: docSnap.id, ...docSnap.data() },
//         });
//         return;
//       }

//       // If no documentId, fetch all documents in the collection
//       const snapshot = await collectionRef.get();
//       const documents = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       res.status(200).json({
//         result: `Successfully retrieved ${documents.length} documents from collection ${collectionName}.`,
//         documents,
//       });
//     } catch (error) {
//       // Log detailed error for debugging
//       console.error('Error in getDocuments:', {
//         message: error.message,
//         stack: error.stack,
//         query: req.query,
//         headers: req.headers,
//       });
//       res.status(500).send(`Error: ${error.message}`);
//     }
//   });
// });

// //delete document
// exports.deleteDocument = functions.https.onRequest(async (req, res) => {
//     // Check if the request method is DELETE
//     if (req.method !== 'DELETE') {
//         res.status(405).json({
//             error: {
//                 message: 'Method Not Allowed. Use DELETE method.',
//                 status: 'INVALID_REQUEST'
//             }
//         });
//         return;
//     }

//     // Check for Authorization header
//     const authHeader = req.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         res.status(401).json({
//             error: {
//                 message: 'You must be authenticated to delete a document.',
//                 status: 'UNAUTHENTICATED'
//             }
//         });
//         return;
//     }

//     // Extract and verify ID token
//     const idToken = authHeader.split('Bearer ')[1];
//     let decodedToken;
//     try {
//         decodedToken = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//         console.error('Token verification error:', {
//             message: error.message,
//             stack: error.stack
//         });
//         res.status(401).json({
//             error: {
//                 message: 'Unauthorized: Invalid or expired token',
//                 status: 'UNAUTHENTICATED'
//             }
//         });
//         return;
//     }

//     // Extract document path from query parameter or body
//     const documentPath = req.query.documentPath || req.body.documentPath;
//     if (!documentPath || typeof documentPath !== 'string') {
//         res.status(400).json({
//             error: {
//                 message: 'Document path must be a non-empty string.',
//                 status: 'INVALID_ARGUMENT'
//             }
//         });
//         return;
//     }

//     try {
//         // Reference to the Firestore document
//         const db = admin.firestore();
//         const docRef = db.doc(documentPath);

//         // Check if document exists
//         const docSnapshot = await docRef.get();
//         if (!docSnapshot.exists) {
//             res.status(404).json({
//                 error: {
//                     message: 'Document does not exist.',
//                     status: 'NOT_FOUND'
//                 }
//             });
//             return;
//         }

//         // Delete the document
//         await docRef.delete();

//         res.status(200).json({
//             status: 'success',
//             message: `Document at ${documentPath} deleted successfully.`
//         });
//     } catch (error) {
//         console.error('Error deleting document:', error);
//         res.status(500).json({
//             error: {
//                 message: 'An error occurred while deleting the document.',
//                 status: 'INTERNAL'
//             }
//         });
//     }
// });

// // update document

// exports.updateDocument = functions.https.onRequest(async (req, res) => {
//     if (req.method !== 'POST') {
//         res.status(405).json({
//             error: {
//                 message: 'Method Not Allowed. Use POST method.',
//                 status: 'INVALID_REQUEST'
//             }
//         });
//         return;
//     }
//     const authHeader = req.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         res.status(401).json({
//             error: {
//                 message: 'You must be authenticated to update a document.',
//                 status: 'UNAUTHENTICATED'
//             }
//         });
//         return;
//     }
//     const idToken = authHeader.split('Bearer ')[1];
//     let decodedToken;
//     try {
//         decodedToken = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//         console.error('Token verification error:', {
//             message: error.message,
//             stack: error.stack
//         });
//         res.status(401).json({
//             error: {
//                 message: 'Unauthorized: Invalid or expired token',
//                 status: 'UNAUTHENTICATED'
//             }
//         });
//         return;
//     }
//     const { documentPath, updateData } = req.body;
//     if (!documentPath || typeof documentPath !== 'string') {
//         res.status(400).json({
//             error: {
//                 message: 'Document path must be a non-empty string.',
//                 status: 'INVALID_ARGUMENT'
//             }
//         });
//         return;
//     }
//     if (!updateData || typeof updateData !== 'object') {
//         res.status(400).json({
//             error: {
//                 message: 'Update data must be a non-empty object.',
//                 status: 'INVALID_ARGUMENT'
//             }
//         });
//         return;
//     }
//     try {
//         const db = admin.firestore();
//         const docRef = db.doc(documentPath);
//         const docSnapshot = await docRef.get();
//         if (!docSnapshot.exists) {
//             res.status(404).json({
//                 error: {
//                     message: 'Document does not exist.',
//                     status: 'NOT_FOUND'
//                 }
//             });
//             return;
//         }
//         await docRef.update(updateData);
//         res.status(200).json({
//             status: 'success',
//             message: `Document at ${documentPath} updated successfully.`
//         });
//     } catch (error) {
//         console.error('Error updating document:', error);
//         res.status(500).json({
//             error: {
//                 message: 'An error occurred while updating the document.',
//                 status: 'INTERNAL'
//             }
//         });
//     }
// });


// // push to github

// // exports.pushToGithub= functions.https.onRequest(async(req,res)=>{
// //   if(req.method !== 'POST'){
// //     res.status(405).json({
// //       message:'Method not allowed.Use POST Method',
// //       status:'Invalid Request'
// //     })
// //   }
// //   const data = req.body;  // JSON Input
// //   const {repoName, branch ='main', commitMessage= 'Autocommit', files, githubToken} = data;
// //   if (!repoName || !files || !githubToken){
// //     return res.status(400).json({
// //       message:'Missing required fields',
// //       status: 'Not Found '
// //     })
// //   }
// //   const octokit = new Octokit({auth: githubToken});
// //   try{
// //     // check if repo exists
// //     let repo;
// //     try{
// //       repo = await octokit.request('GET /repos/{owner}/{repo}', {owner,repo: repoName});
// //     }catch(error){
// //       if(error.status === 404){
// //         repo = await octokit.request('POST /user/repos',{name: repoName});
// //       }else{
// //         throw new Error(`Failed to check repository: ${error.message}`)
// //       }
// //     }
// //     // get the latest commit SHA on the branch
// //     const {data:Ref} = await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/{branch}',
// //       {
// //         owner,
// //         repo:repoName,
// //         branch,
// //       });
// //       const baseCommitSha = ref.object.sha;

// //       // Get the base tree SHA
// //       const {data: commit } = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}',
// //       {
// //         owner,
// //         repo:repoName,
// //         commit_sha: baseCommitSha,
// //       });
// //       const baseTreeSha = commit.tree.sha;

// //       // create blobs for each file
// //       const blobPromises = Object.entries(files).map(async ([path,content])=>{
// //         const {data:blob} = await octakit.request('POST /repos/{owner}/{repo}/git/blobs',
// //           {
// //             owner,
// //             repo:repoName,
// //             content:Buffer.from(content).toString('base64'),
// //             encoding:'base64',
// //           });
// //          return{path,mode:'100644',type:'blob',sha:blob.sha};
// //       });
// //       const tree = await Promise.all(blobPromises)

// //       // Create a new tree
// //       const {data:newTree} = await octokit.request('POST /repos/{owner}/{repo}/git/trees',
// //         {
// //           owner,
// //           repo:repoName,
// //           base_tree: baseTreeSha,
// //           tree,
// //         });

// //       // Create a new commit
// //       const {data : newCommit}= await octokit.request('POST /repos/{owner}/{repo}/git/commits',{
// //         owner,
// //         repo:repoName,
// //         message: commitMessage,
// //         parents:[baseCommitSha],
// //         trees: newTree.sha,
// //       });

// //       // Update the branch reference 
// //       await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}',{
// //         owner,
// //         repo:repoName,
// //         branch,
// //         sha:newCommit.sha
// //       });

// //       res.status(200).json({
// //         message: 'Code pushed to Github',
// //         status: 'Success',
// //         repoURL:repo.data.html_url
// //       });

// //   }catch(error){
// //     console.log(error);
// //     res.status(500).send(`Error pushing to github:${error.message}`);
// //   }
// // })



// const GITHUB_TOKEN = ''; // store your token in Firebase config
// const OWNER = "";
// const REPO = "";
// const BRANCH = "";

// // Example project files (replace with dynamic input or storage fetch)
// const projectFiles = {
//   "src/app/app.component.ts": "import { Component } from '@angular/core';\nexport class AppComponent {}",
//   "src/app/app.component.html": "<app-root></app-root>",
//   "src/styles.css": "body { margin: 0; }"
// };
// // Base64 encode file content
// function encodeContent(content) {
//   return Buffer.from(content).toString("base64");
// }

// // Get SHA of existing file (for updates)
// // async function getFileSha(path) {
// //   const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
// //   const res = await fetch(url, {
// //     headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
// //   });

// //   if (res.status === 200) {
// //     const data = await res.json();
// //     return data.sha;
// //   }
// //   return null;
// // }
// async function getFileSha(repo, path) {
//   const url = `https://api.github.com/repos/${OWNER}/${repo}/contents/${path}?ref=${BRANCH}`;
//   const res = await fetch(url, {
//     headers: { Authorization: `token ${GITHUB_TOKEN}` },
//   });

//   if (res.status === 200) {
//     const data = await res.json();
//     return data.sha;
//   }
//   return null;
// }

// // Upload or update a single file
// // async function uploadFile(path, content) {
// //   const sha = await getFileSha(path);
// //   const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
// //   const body = {
// //     message: `Add/update ${path}`,
// //     content: encodeContent(content),
// //     branch: BRANCH,
// //   };
// //   if (sha) body.sha = sha;

// //   const res = await fetch(url, {
// //     method: "PUT",
// //     headers: {
// //       Authorization: `Bearer ${GITHUB_TOKEN}`,
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(body),
// //   });

// //   const data = await res.json();
// //   console.log(`Uploaded ${path}:`, data.content?.sha || data);
// //   return data;
// // }
// async function uploadFile(repo, path, content) {
//   const sha = await getFileSha(repo, path);
//   const url = `https://api.github.com/repos/${OWNER}/${repo}/contents/${path}`;
//   const body = {
//     message: `Add/update ${path}`,
//     content: encodeContent(content),
//     branch: BRANCH,
//   };
//   if (sha) body.sha = sha;

//   const res = await fetch(url, {
//     method: "PUT",
//     headers: {
//       Authorization: `token ${GITHUB_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   return res.json();
// }
// exports.createGitHubRepo = functions.https.onRequest(async (req, res) => {
//   try {
//     const body = {
//       name: getName(),
//       description: "My Angular project",
//       private: false, // true if you want a private repo
//     };

//     const response = await fetch("https://api.github.com/user/repos", {
//       method: "POST",
//       headers: {
//         "Authorization": `token ${GITHUB_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("GitHub API Error:", data);
//       return res.status(response.status).send(data);
//     }

//     return res.status(200).send({
//       message: "Repository created successfully!",
//       repo: data.full_name,
//       default_branch: data.default_branch,
//       url: data.html_url,
//     });
//   } catch (err) {
//     console.error("Error creating repo:", err);
//     return res.status(500).send("Error creating repository.");
//   }
// });

// function getName(prefix = "project") {
//   const now = new Date();
  
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");

//   return `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}`;
// }


// // Cloud Function entry
// exports.pushProjectToGitHub = functions.https.onRequest(async (req, res) => {
//   try {
//     const { repoName, projectFiles } = req.body;

//     if (!repoName || !projectFiles) {
//       return res.status(400).send("repoName and projectFiles are required in body");
//     }

//     for (const [path, content] of Object.entries(projectFiles)) {
//       await uploadFile(repoName, path, content);
//     }

//     return res.status(200).send(`All files uploaded to GitHub repo '${repoName}' successfully!`);
//   } catch (err) {
//     console.error("Error uploading project:", err);
//     return res.status(500).send("Error uploading project to GitHub.");
//   }
// });


// // upload new project
// // update files


// // vercel deployment API call

// // index.js
// // Deploy as a Firebase / Google Cloud Function: exports.deployToVercel = ...
// // Node 18+ has global fetch. If not available in your runtime, install node-fetch and uncomment the require line below.
// // const fetch = require('node-fetch');

// const VERCEL_TOKEN = "Mpo5KLxt91pyHZcAIDDHdg7y"; // <-- HARD-CODED for now (replace for production)
// const VERCEL_API = "https://api.vercel.com/v13/deployments";

// /**
//  * POST body expected:
//  * {
//  *   "name": "mercedes-app3",
//  *   "project": "mercedes-app",
//  *   "repoId": 1052573587,
//  *   "sha": "06b19b5c302805ef1208b9738771dabdf1fc48a7",
//  *   "outputDirectory": "dist/mercedes-app/browser",
//  *   "remoteUrl": "https://github.com/Mansichawla/project-20250908-084412.git"
//  * }
//  */
// exports.deployToVercel = functions.https.onRequest(
//   { timeoutSeconds: 1800, memory: "1GiB" }, 
//   async (req, res) => {
//   try {
//     // allow only POST
//     if (req.method !== "POST") {
//       return res.status(405).json({ error: "Method Not Allowed", message: "Use POST" });
//     }

//     const body = req.body || {};
//     const {
//       name,
//       project,
//       repoId,
//       sha,
//       outputDirectory,
//       remoteUrl
//     } = body;

//     // Validate required fields
//     const missing = [];
//     if (!name) missing.push("name");
//     if (!project) missing.push("project");
//     if (!repoId && repoId !== 0) missing.push("repoId");
//     if (!sha) missing.push("sha");
//     if (!outputDirectory) missing.push("outputDirectory");
//     if (!remoteUrl) missing.push("remoteUrl");

//     if (missing.length) {
//       return res.status(400).json({ error: "missing_required_fields", missing });
//     }

//     // Build a minimal payload (other fields hardcoded as requested)
//     const payload = {
//       name,
//       project,
//       target: "production",
//       gitSource: {
//         type: "github",
//         ref: "main",
//         repoId: Number(repoId),
//         sha: String(sha)
//       },
//       projectSettings: {
//         framework: "angular",
//         buildCommand: "ng build --configuration=production",
//         installCommand: "npm install",
//         outputDirectory: String(outputDirectory),
//         nodeVersion: "22.x"
//       },
//       gitMetadata: {
//         remoteUrl: String(remoteUrl),
//         commitAuthorName: "auto-deploy",
//         commitAuthorEmail: "no-reply@vercel-deploy.local",
//         commitMessage: `Auto deploy ${name}`,
//         commitRef: "main",
//         commitSha: String(sha),
//         dirty: false,
//         ci: true,
//         ciType: "cloud-function",
//         ciGitProviderUsername: "auto-deploy",
//         ciGitRepoVisibility: "private"
//       }
//     };

//     // 1) Create deployment
//     const createResp = await fetch(VERCEL_API, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${VERCEL_TOKEN}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     });

//     const createData = await safeJson(createResp);

//     if (!createResp.ok) {
//       // Handle specific Vercel error codes (helpful for debugging)
//       const errCode = createData?.error?.code || createData?.code;
//       if (errCode === "incorrect_git_source_info") {
//         return res.status(400).json({
//           error: "incorrect_git_source_info",
//           message: "Vercel can't find the provided branch/commit in the linked repo.",
//           details: createData
//         });
//       }
//       return res.status(createResp.status || 500).json({
//         error: "vercel_create_failed",
//         details: createData
//       });
//     }

//     // createData contains the deployment object, including id and url
//     const deploymentId = createData?.id;
//     const initialUrl = createData?.url || null;
//     const inspectorUrl = createData?.inspectorUrl || null;

//     if (!deploymentId) {
//       return res.status(500).json({
//         error: "no_deployment_id",
//         details: createData
//       });
//     }

//     // 2) Poll deployment status until ready or failed
//     const final = await pollDeploymentStatus(deploymentId, 8, 30000); // max 40 attempts * 3s = ~120s

//     if (!final) {
//       return res.status(504).json({
//         error: "deployment_timeout",
//         message: "Deployment did not become READY within timeout window.",
//         deployment: createData
//       });
//     }

//     // final is the full deployment object
//     if (final.readyState === "ERROR" || final.status === "ERROR" || final.state === "ERROR") {
//       return res.status(500).json({
//         error: "deployment_failed",
//         details: final
//       });
//     }

//     // deployment url that opens in browser
//     // Vercel returns multiple possible URLs; prefer the friendly branch url then url field
//     const deployedUrl = final?.url || initialUrl || (final?.automaticAliases && final.automaticAliases[0]) || null;

//     if (!deployedUrl) {
//       return res.status(500).json({
//         error: "no_deployed_url",
//         details: final
//       });
//     }

//     // Success response
//     return res.status(200).json({
//       message: "Deployment succeeded",
//       deploymentId,
//       url: `https://${deployedUrl}`, // ensure https prefix
//       inspectorUrl,
//       vercelResponse: final
//     });
//   } catch (err) {
//     console.error("Unexpected error in deployToVercel:", err);
//     return res.status(500).json({ error: "internal_error", message: err?.message || String(err) });
//   }
//   });

// /**
//  * Poll Vercel deployment status until ready or failed.
//  * attempts: number of polls
//  * intervalMs: ms between polls
//  */
// async function pollDeploymentStatus(deploymentId, attempts = 8, intervalMs = 30000) {
//   if (!deploymentId) throw new Error("deploymentId required for polling");
//   const url = `${VERCEL_API}/${deploymentId}`;

//   for (let i = 0; i < attempts; i++) {
//     try {
//       const resp = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${VERCEL_TOKEN}`,
//           "Content-Type": "application/json"
//         }
//       });
//       const data = await safeJson(resp);

//       // If any error from Vercel
//       if (!resp.ok) {
//         // If transient, continue polling; otherwise return the error object
//         // For simplicity, if 404 or 400 return error immediately
//         if (resp.status === 404 || resp.status === 400) {
//           return data;
//         }
//       }

//       // readyState can be QUEUED, BUILDING, ERROR, READY
//       const readyState = data?.readyState || data?.status;

//       // states that indicate completion
//       if (readyState === "READY" || readyState === "ERROR") {
//         return data;
//       }

//       // try again after waiting
//       await wait(intervalMs);
//     } catch (err) {
//       // network error — log and continue attempts
//       console.warn("poll error:", err);
//       await wait(intervalMs);
//     }
//   }
//   // timed out
//   return null;
// }

// function wait(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function safeJson(resp) {
//   try {
//     const text = await resp.text();
//     try {
//       return JSON.parse(text);
//     } catch (e) {
//       // not JSON — return raw text
//       return { text };
//     }
//   } catch (err) {
//     return { error: "failed_to_read_response", message: err.message || String(err) };
//   }
// }




