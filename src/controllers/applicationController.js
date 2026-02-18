const Application = require('../module/application');
const HrEmail = require('../module/hrEmail');
const Job = require('../module/job');
const User = require('../module/user');
const mongoose = require('mongoose');
const transporter = require('../config/email');

exports.applyJob = async (req, res) => {
  try {
    const { jobId, experience, coverLetter, selectedHr } = req.body;
    const studentId = req.user.id;

    // 1️⃣ Validate Required Fields
    if (!jobId || !experience || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 2️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID"
      });
    }

    // 3️⃣ Check Job Exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // 4️⃣ Prevent Duplicate Application
    const alreadyApplied = await Application.findOne({
      studentId,
      jobId
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // 5️⃣ Get Student Info
    const student = await User.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 6️⃣ Save Application
    const newApplication = new Application({
      studentId,
      jobId,
      experience,
      coverLetter
    });

    await newApplication.save();

    // 7️⃣ Fetch HR Emails
    const hrEmails = await HrEmail.find({ jobId });

    if (!hrEmails.length) {
      return res.status(200).json({
        success: true,
        message: "Application saved (No HR emails linked)"
      });
    }

// 8️⃣ Send Emails (Secure Professional Method)
await Promise.all(
  hrEmails.map(hr =>
    transporter.sendMail({
      from: `"${student.username}" <${process.env.EMAIL_USER}>`, // 👈 shows student name
      to: hr.email,
      replyTo: student.email,  // 👈 HR reply goes to student
      cc: student.email,       // 👈 student gets copy
      subject: `Application for ${job.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 15px;">
          <h2 style="color:#2BB5CE;">New Job Application</h2>

          <p><strong>Job Title:</strong> ${job.title}</p>
          <p><strong>Candidate Name:</strong> ${student.username}</p>
          <p><strong>Candidate Email:</strong> ${student.email}</p>
          <p><strong>Experience:</strong> ${experience}</p>

          <h4>Cover Letter:</h4>
          <div style="background:#f4f4f4; padding:12px; border-radius:6px;">
            ${coverLetter}
          </div>

          <hr style="margin-top:20px;" />

          <p style="font-size:12px; color:gray;">
            This email was sent via Job Portal System.
          </p>
        </div>
      `
    })
  )
);


    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      hrCount: hrEmails.length
    });

  } catch (error) {
    console.error("Apply Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while applying"
    });
  }
};
