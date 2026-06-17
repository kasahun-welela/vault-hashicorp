const express = require("express");
require("dotenv").config();
const app = express();

const vault = require("node-vault")({
  apiVersion: "v1",
  endpoint: process.env.ENDPOINT,
  token: process.env.TOKEN,
});

const VAULT_PATH = process.env.VAULT_PATH;
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Test from Kubernetes and Node.js!");
});

app.get("/secret", async (req, res) => {
  try {
    const result = await vault.read(VAULT_PATH);
    res.json({
      vaultPath: VAULT_PATH,
      secret: result.data.data,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error fetching secret:", err);
    res.status(500).json({ error: "Failed to fetch secret" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
