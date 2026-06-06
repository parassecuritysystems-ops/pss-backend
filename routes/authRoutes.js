const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Admin = require("../models/Admin");
const Otp = require("../models/Otp");

const generateOTP = require("../utils/otpGenerator");
const generateToken = require("../utils/jwtGenerator");

require("dotenv").config();


// ================= REGISTER ADMIN =================

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = generateToken(savedAdmin);

    res.json({
      success: true,
      message: "Admin registered successfully",
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ================= LOGIN =================

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    if (!admin.password) {
      return res.status(400).json({
        success: false,
        message: "Corrupted user data"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = generateToken(admin);

    return res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ================= FORGOT PASSWORD =================

router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    const otp = generateOTP();

    await Otp.create({
      email,
      otp: String(otp)
    });

    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Password Reset",
      html: `<h1>${otp}</h1>`
    });
    */

    return res.json({
      success: true,
      message: "OTP generated successfully",
      otp
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ================= VERIFY OTP =================

router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email,
      otp
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    return res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ================= RESET PASSWORD =================

router.post("/reset-password", async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({
      email,
      otp
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await Admin.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword
        }
      }
    );

    await Otp.deleteMany({
      email,
      otp
    });

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ================= CREATE ADMIN =================

router.post("/create-admin", async (req, res) => {
  try {

    console.log("===== CREATE ADMIN =====");
    console.log("BODY:", req.body);

    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    console.log("EXISTING:", existingAdmin);

    if (existingAdmin) {
      return res.json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("SAVED:", savedAdmin);

    return res.json({
      success: true,
      message: "Account created successfully"
    });

  } catch (error) {

    console.error("CREATE ADMIN ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;