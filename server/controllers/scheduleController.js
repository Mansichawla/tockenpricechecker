const historyQueue = require("../queues/historyQueue");
const { QueueEvents, Job } = require("bullmq");
const connection = require("../config/redis");

exports.schedulePriceFetch = async (req, res) => {
  const { token, network } = req.body;

  if (!token || !network) {
    return res.status(400).json({ error: "Missing token or network" });
  }

  // Add job to BullMQ queue
  const job = await historyQueue.add("fetch-history", {token,network});

   res.json({
    message: "Fetch history scheduled successfully",
    jobId: job.id, // send jobId to frontend
  });
};

//  route controller to check job progress
exports.getJobProgress = async (req, res) => {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).json({ error: "Missing jobId" });
  }

  try {
    const job = await historyQueue.getJob(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const progress = await job.progress; // either 0-100 or some custom value

    res.json({ progress });
  } catch (err) {
    console.error("Error fetching job progress:", err);
    res.status(500).json({ error: "Error fetching job progress" });
  }
};


