import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Qualification
app.post("/api/qualification/submit", (req, res) => {
  const { skill } = req.body;
  if (!skill) {
    return res.status(400).json({ success: false, message: "Skill is required" });
  }
  res.json({ success: true, message: "Qualification submitted!" });
});

// Spotlight
app.post("/api/spotlight/enter", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  res.json({ success: true, message: "You entered the spotlight!" });
});

app.get("/api/spotlight/winner", (req, res) => {
  res.json({ winner: "User123" }); // Placeholder for deterministic logic
});

// Cron
app.get("/api/cron/spotlight", (req, res) => {
  res.json({ message: "Spotlight cron executed", winner: "User123" });
});

// Credits
app.post("/api/credits/allocate", (req, res) => {
  const { userId, credits } = req.body;
  if (!userId || credits <= 0) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }
  res.json({ success: true, message: `${credits} credits allocated to ${userId}` });
});

// Dynamic port for local dev
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

export default app; // for Vercel serverless
