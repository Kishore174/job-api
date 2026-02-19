const HrEmail = require('../module/hrEmail');

exports.uploadHrEmails = async (req, res) => {
  try {
    const { jobId, emails } = req.body;

    console.log("BODY:", req.body);

    if (!jobId || !emails || !emails.length) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const emailDocs = emails.map(email => ({
      jobId,
      email
    }));

    await HrEmail.insertMany(emailDocs);

    res.status(201).json({
      success: true,
      message: "HR emails uploaded successfully"
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error); // 👈 show real error
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getHrEmailsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const emails = await HrEmail.find({ jobId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: emails.length,
      emails
    });

  } catch (error) {
    console.error("GET HR ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// 🔹 Get All HR Emails
exports.getAllHrEmails = async (req, res) => {
  try {
    const emails = await HrEmail.find()
      .populate("jobId", "title location") // show job info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: emails.length,
      emails
    });

  } catch (error) {
    console.error("GET ALL HR ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
