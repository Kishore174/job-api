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
