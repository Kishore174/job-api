// npm install groq-sdk
const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// List of models to try in order (most recent first)
const AVAILABLE_MODELS = [
  "llama-3.2-90b-vision-preview",
  "llama-3.2-11b-vision-preview",
  "llama-3.2-90b-text-preview",
  "llama-3.2-1b-preview",
  "mixtral-8x7b-32768",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma-7b-it",
  "llama2-70b-4096",
];

let selectedModel = null;

// Test and select a working model on startup
async function findWorkingModel() {
  if (selectedModel) return selectedModel;

  for (const model of AVAILABLE_MODELS) {
    try {
      // Quick test with minimal request
      await groq.chat.completions.create({
        messages: [{ role: "user", content: "Hi" }],
        model: model,
        max_tokens: 10,
      });
      selectedModel = model;
      console.log(`✓ Using Groq model: ${model}`);
      return model;
    } catch (err) {
      console.log(`✗ Model ${model} not available`);
      continue;
    }
  }

  throw new Error("No available Groq models found. Check your API key.");
}

router.post("/cover-letter", async (req, res) => {
  const { jobTitle, location, experienceRequired, description, experience, skills } = req.body;

  if (!jobTitle || !experience) {
    return res.status(400).json({ error: "jobTitle and experience are required" });
  }

  const prompt = `You are a professional cover letter writer. Write a compelling cover letter for a job application.

Job Title: ${jobTitle}
Location: ${location || "Not specified"}
Experience Required: ${experienceRequired || "Not specified"}
Job Description: ${description || "Not specified"}
Applicant's Experience: ${experience}
Skills: ${skills || "Not specified"}

Write ONLY the cover letter body (3 short paragraphs, 200-300 words). 
- Do NOT include "Dear Hiring Manager" or any greeting
- Do NOT include "Sincerely" or any signature
- Be specific, confident, and impactful
- Start directly with the applicant's interest in the role

Cover letter:`;

  try {
    // Find working model if not already selected
    const model = await findWorkingModel();

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const coverLetter = message.choices[0]?.message?.content || "";

    if (!coverLetter) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    res.json({ coverLetter });
  } catch (err) {
    console.error("Groq error:", err.message);
    
    res.status(500).json({ 
      error: "Failed to generate cover letter. Please try again or write manually." 
    });
  }
});

module.exports = router;