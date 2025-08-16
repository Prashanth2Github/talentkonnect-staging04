import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Qualification
app.post("/api/qualification/submit", (req, res) => {
  res.json({ success: true, message: "Qualification submitted!" });
});

// Spotlight
app.post("/api/spotlight/enter", (req, res) => {
  res.json({ success: true, message: "You entered the spotlight!" });
});

app.get("/api/spotlight/winner", (req, res) => {
  res.json({ winner: "User123" }); // replace with deterministic hash later
});

// Cron
app.get("/api/cron/spotlight", (req, res) => {
  res.json({ message: "Spotlight cron executed", winner: "User123" });
});

// Credits
app.post("/api/credits/allocate", (req, res) => {
  const { userId, credits } = req.body;
  res.json({ success: true, message: `${credits} credits allocated to ${userId}` });
});

app.listen(8888, () => console.log("Backend running on http://localhost:8888"));
