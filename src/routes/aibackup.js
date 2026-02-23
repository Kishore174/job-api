const express = require("express");
const router = express.Router();

// ALTERNATIVE: Using HuggingFace Inference API (100% free, no credit card)
// Get free API token: https://huggingface.co/settings/tokens

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.1"; // Free model on HuggingFace

async function generateWithHuggingFace(prompt) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${MODEL_ID}`,
    {
      headers: { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Extract text from response
  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text.replace(prompt, "").trim();
  }
  
  return result.generated_text || "";
}

// POST /ai/cover-letter
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

Write a professional cover letter body (3 paragraphs, 250-300 words). No greeting, no sign-off. Be specific and confident:`;

  try {
    const coverLetter = await generateWithHuggingFace(prompt);
    res.json({ coverLetter });
  } catch (err) {
    console.error("HuggingFace error:", err);
    res.status(500).json({ 
      error: "Failed to generate cover letter. Please try again or write manually." 
    });
  }
});

module.exports = router;

// USAGE:
// 1. Get free token: https://huggingface.co/settings/tokens
// 2. Add to .env: HUGGINGFACE_API_TOKEN=hf_xxxxxx
// 3. npm install (no additional packages needed, uses native fetch)
// 4. That's it!