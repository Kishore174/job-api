// controllers/studentController.js
const User = require('../module/user');
const bcrypt = require('bcryptjs');
const transporter = require('../config/email');

exports.createStudent = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and Email are required"
      });
    }

    // 🔎 Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or Email already exists"
      });
    }

    // 🔐 Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newStudent = new User({
      username,
      email,
      password: hashedPassword,
      role: "student"
    });

    await newStudent.save();

    // 📧 Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Student Account Credentials",
      html: `
        <h3>Welcome to Job Portal</h3>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${randomPassword}</p>
        <p>Please login and change your password after first login.</p>
      `
    });

    res.status(201).json({
      success: true,
      message: "Student created & credentials sent"
    });

  } catch (error) {

    // 🔥 Handle duplicate error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username or Email already exists"
      });
    }

    console.error("Create Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

 exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// ✅ Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const student = await User.findById(id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    student.username = username || student.username;
    student.email = email || student.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.password = hashedPassword;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🧹 Clean up all applications submitted by this student
    await Application.deleteMany({ studentId: id });

    res.status(200).json({
      success: true,
      message: "Student and their applications deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
