const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Connect DB on every request (Vercel serverless is stateless)
const connectDB = require("./src/lib/mongodb");

// Connect at startup for local dev
connectDB().catch(err => console.error("DB Error:", err));

// Re-ensure connection on every request (required for Vercel)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
const authRoute = require("./src/routes/authRoute");
const jobRoutes = require("./src/routes/JobRoute");
const hrRoutes = require("./src/routes/hrRoute");
const applicationRoutes = require("./src/routes/applicationRoute");
const landingJobRoutes = require("./src/routes/landingJobRoute");
const studentRoutes = require("./src/routes/studentRoute");

app.use("/api/student", studentRoutes);
app.use("/api/landing-jobs", landingJobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoutes);

// ✅ Local development — only listen when not on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ Vercel needs the app exported
module.exports = app;