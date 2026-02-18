const Job = require('../module/job');

// 🔹 Create Job (Admin Only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      experienceRequired,
      isPremium
    } = req.body;

    if (!title || !description || !location || !experienceRequired) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newJob = new Job({
      title,
      description,
      location,
      experienceRequired,
      isPremium: isPremium || false,
      createdBy: req.user.id
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job"
    });
  }
};


// 🔹 Get All Jobs (Admin View)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs"
    });
  }
};


// 🔹 Get Only Premium Jobs (Student View)
exports.getPremiumJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isPremium: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch premium jobs"
    });
  }
};


// 🔹 Delete Job (Admin Only)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job"
    });
  }
};
