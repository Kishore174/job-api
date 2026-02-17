const LandingJob = require('../module/landingJob');

// Admin create landing job
exports.createLandingJob = async (req, res) => {
  try {
    const job = new LandingJob(req.body);
    await job.save();

    res.status(201).json({
      success: true,
      message: "Landing job created",
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Public fetch for landing page
exports.getLandingJobs = async (req, res) => {
  try {
    const jobs = await LandingJob.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch landing jobs"
    });
  }
};
