const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log( req.body);
    
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }
    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists." });
    }
    const admin = new Admin({ username, email, password });
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt - received:", { username, password });
    
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    // Allow login with either username or email
    const admin = await Admin.findOne({
      $or: [
        { username },
        { email: username }
      ]
    });
    console.log("Admin found in DB:", admin);

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const isMatch = await admin.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    if (!admin.isActive) {
      return res.status(401).json({ error: "Account is deactivated." });
    }
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

exports.profile = async (req, res) => {
  try {
    res.json({ admin: req.admin });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};
