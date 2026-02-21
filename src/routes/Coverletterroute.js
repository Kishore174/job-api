// routes/ai.js  (or wherever you keep your routes)
// npm install @anthropic-ai/sdk
// Add ANTHROPIC_API_KEY=sk-ant-... to your .env

const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /ai/cover-letter
router.post("/cover-letter", async (req, res) => {
  const { jobTitle, location, experienceRequired, description, experience } = req.body;

  if (!jobTitle || !experience) {
    return res.status(400).json({ error: "jobTitle and experience are required" });
  }

  const prompt = `Write a professional, compelling cover letter for a job application. Be concise (3 short paragraphs), confident, and tailored.

Job Title: ${jobTitle}
Location: ${location || "Not specified"}
Experience Required: ${experienceRequired || "Not specified"}
Job Description: ${description || "Not specified"}
Applicant's Experience: ${experience}

Write only the cover letter body (no "Dear Hiring Manager" header, no sign-off). Make it professional, specific, and impactful.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const coverLetter = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.json({ coverLetter });
  } catch (err) {
    console.error("Anthropic error:", err);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

module.exports = router;

// ── Register in your main app.js / server.js ──────────────────
// const aiRoutes = require("./routes/ai");
// app.use("/ai", aiRoutes);