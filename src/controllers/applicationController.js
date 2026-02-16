const Application = require('../module/application');
const HrEmail = require('../module/hrEmail');
const Job = require('../module/job');
const User = require('../module/user');

const mongoose = require('mongoose');
const transporter = require('../config/email');

exports.applyJob = async (req, res) => {
  try {
    const { jobId, experience, coverLetter } = req.body;
    const studentId = req.user.id;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check already applied
    const alreadyApplied = await Application.findOne({ studentId, jobId });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "Already applied to this job" });
    }

    // Get student details
    const student = await User.findById(studentId);

    // Save application
    const newApplication = new Application({
      studentId,
      jobId,
      experience,
      coverLetter
    });

    await newApplication.save();

    // Fetch HR emails
    const hrEmails = await HrEmail.find({ jobId });

    // Send email to each HR
    for (let hr of hrEmails) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: hr.email,
        subject: `New Application for ${job.title}`,
        html: `
          <h3>New Job Application</h3>
          <p><strong>Job:</strong> ${job.title}</p>
          <p><strong>Candidate Name:</strong> ${student.username}</p>
          <p><strong>Experience:</strong> ${experience}</p>
          <p><strong>Cover Letter:</strong></p>
          <p>${coverLetter}</p>
        `
      });
    }

    res.status(201).json({
      success: true,
      message: "Application submitted & Emails sent",
      hrCount: hrEmails.length
    });

  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
