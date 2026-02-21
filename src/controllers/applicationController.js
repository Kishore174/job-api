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
    const resumeFile = req.file;

    if (!jobId || !experience || !coverLetter) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!resumeFile) {
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const alreadyApplied = await Application.findOne({ studentId, jobId });
    if (alreadyApplied) return res.status(400).json({ success: false, message: "You already applied for this job" });

    const student = await User.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    // Save application — store just the filename
    await Application.create({
      studentId,
      jobId,
      experience,
      coverLetter,
      selectedHr,
      resume: resumeFile.originalname,
    });

    const hrEmails = await HrEmail.find({ jobId });

    if (hrEmails.length > 0) {
      await Promise.all(
        hrEmails.map((hr) =>
          transporter.sendMail({
            from: `"Job Portal" <${process.env.EMAIL_USER}>`,
            to: hr.email,
            replyTo: student.email,  // HR replies → goes directly to student
            cc: student.email,
            subject: `Application for ${job.title} — ${student.username}`,

            // ✅ PDF attached directly to email — no links, no Cloudinary
            attachments: [
              {
                filename: resumeFile.originalname,
                content: resumeFile.buffer,
                contentType: resumeFile.mimetype,
              },
            ],

            html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#1d4ed8,#2563EB);padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Job Application</h1>
      <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Submitted via Job Portal</p>
    </div>

    <div style="padding:32px;">

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">Position</p>
        <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a;">${job.title}</p>
        ${job.location ? `<p style="margin:5px 0 0;font-size:13px;color:#64748b;">📍 ${job.location}</p>` : ""}
      </div>

      <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">Candidate</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:38%;font-size:12px;color:#94a3b8;">Full Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;font-weight:600;color:#1e293b;">${student.username}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#94a3b8;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
            <a href="mailto:${student.email}" style="font-size:14px;color:#2563EB;text-decoration:none;">${student.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#94a3b8;">Experience</td>
          <td style="padding:10px 0;font-size:14px;font-weight:600;color:#1e293b;">${experience}</td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">Cover Letter</p>
      <div style="background:#f8fafc;border-left:3px solid #2563EB;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:14px;color:#334155;line-height:1.75;">${coverLetter}</p>
      </div>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#1d4ed8;font-weight:600;">📎 ${resumeFile.originalname}</p>
        <p style="margin:6px 0 0;font-size:12px;color:#64748b;">Resume is attached to this email.</p>
      </div>

    </div>

    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        Auto-generated by <strong style="color:#64748b;">Job Portal</strong> &nbsp;·&nbsp; Reply to contact the candidate directly.
      </p>
    </div>

  </div>
</body>
</html>
            `,
          })
        )
      );
    }

    return res.status(201).json({ success: true, message: "Application submitted successfully" });

  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while applying" });
  }
};


exports.getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await Application.find({ studentId }).select("jobId").lean();
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};


exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "username email")
      .populate("jobId", "title location")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};