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
 // Update Landing Job
exports.updateLandingJob = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedJob = await LandingJob.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};


// Delete Landing Job
exports.deleteLandingJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await LandingJob.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
