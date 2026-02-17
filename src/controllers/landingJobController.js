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
// UPDATE JOB
exports.updateLandingJob = async (req, res) => {
  try {
    const job = await LandingJob.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Job updated",
      job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE JOB
exports.deleteLandingJob = async (req, res) => {
  try {
    await LandingJob.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
