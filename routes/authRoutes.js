const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { adminsDB, otpDB } = require("../config/db");

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

    adminsDB.findOne({ email }, async (err, admin) => {

      if (admin) {
        return res.status(400).json({
          success: false,
          message: "Admin already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };

      adminsDB.insert(newAdmin, (err, savedAdmin) => {

        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database error"
          });
        }

        const token = generateToken(savedAdmin);

        res.json({
          success: true,
          message: "Admin registered successfully",
          token
        });

      });

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

  const { email, password } = req.body;

  adminsDB.findOne({ email }, async (err, admin) => {

    if (err || !admin) {
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

    const isMatch = await bcrypt.compare(password, admin.password);

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

  });

});


// ================= FORGOT PASSWORD =================

router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    adminsDB.findOne({ email }, async (err, admin) => {

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found"
        });
      }

      const otp = generateOTP();

      // save OTP in DB
      otpDB.insert({
        email,
        otp: String(otp),
        createdAt: new Date()
      });

      // ================= EMAIL LOGIC (COMMENTED FOR FUTURE) =================
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

      // ================= RETURN OTP FOR POPUP =================
      return res.json({
        success: true,
        message: "OTP generated successfully",
        otp // ⚠️ ONLY FOR DEVELOPMENT
      });

    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

});


// ================= VERIFY OTP =================

router.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  otpDB.findOne({ email, otp }, (err, record) => {

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
  });
});



// ================= RESET PASSWORD =================

router.post("/reset-password", async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    otpDB.findOne({ email, otp }, async (err, record) => {

      if (!record) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      adminsDB.update(
        { email },
        { $set: { password: hashedPassword } },
        {},
        (err) => {

          if (err) {
            return res.status(500).json({
              success: false,
              message: "Password reset failed"
            });
          }

          // remove OTP after success
          otpDB.remove({ email, otp }, { multi: true });

          res.json({
            success: true,
            message: "Password updated successfully"
          });

        }
      );

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

    console.log("Request Body:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    adminsDB.findOne({ email }, async (err, existingAdmin) => {

      if (err) {
        console.error("Find Error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Admin already exists"
        });
      }

      try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = {
          name,
          email,
          password: hashedPassword,
          role: "admin",
          createdAt: new Date()
        };

        adminsDB.insert(newAdmin, (err, savedAdmin) => {

          if (err) {
            console.error("Insert Error:", err);

            return res.status(500).json({
              success: false,
              message: "Failed to create admin"
            });
          }

          console.log("Admin Created:", savedAdmin);

          return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin: {
              id: savedAdmin._id,
              name: savedAdmin.name,
              email: savedAdmin.email,
              role: savedAdmin.role
            }
          });

        });

      } catch (hashError) {

        console.error(hashError);

        return res.status(500).json({
          success: false,
          message: "Password hashing failed"
        });

      }

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;
