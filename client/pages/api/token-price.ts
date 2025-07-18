// pages/api/token-price.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { tokenAddress, network, timestamp } = req.body;

  if (!tokenAddress || !network || !timestamp) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await fetch("http://localhost:5000/api/token-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenAddress, network, timestamp }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json(err);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
