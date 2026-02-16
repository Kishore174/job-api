const Job = require('../module/job');


// 🔹 Create Job (Admin Only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, experienceRequired } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      experienceRequired,
      createdBy: req.user.id
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
};


// 🔹 Get All Jobs (Student View)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};


// 🔹 Delete Job (Admin Only)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};
