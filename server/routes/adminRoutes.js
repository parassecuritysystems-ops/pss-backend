const express = require("express");
const router = express.Router();

const { google } = require("googleapis");

const authMiddleware = require("../middleware/authMiddleware");

// ================= GOOGLE SHEETS =================

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({
  version: "v4",
  auth
});

// ================= SHEET IDS =================

const CONTACT_SHEET_ID = "1Fi-L7ialt_xftaWfFtqY0aiMTToNWyYwvcCbsb4GUnA";
const QUOTE_SHEET_ID = "1S7Aj0Xuw2kpan1BRwwzsF9ORtMRp4ecIxl7AiT0v7_c";
const CHATBOT_SHEET_ID = "1dqvP_2hiBpdGb7uXA_XQHg80NQOGnJ1aidSGF6ZeOwY";

// ================= CONTACTS =================

router.get("/contacts", authMiddleware, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1Fi-L7ialt_xftaWfFtqY0aiMTToNWyYwvcCbsb4GUnA",
      range: "Sheet1!A:F"
    });

    const rows = response.data.values || [];

    const data = rows.slice(1).map(r => ({
      timestamp: r[0],
      name: r[1],
      email: r[2],
      phone: r[3],
      service: r[4],
      message: r[5]
    }));

    res.json({ success: true, data });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= QUOTES =================

router.get("/quotes", authMiddleware, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1S7Aj0Xuw2kpan1BRwwzsF9ORtMRp4ecIxl7AiT0v7_c",
      range: "Sheet1!A:J"  
    });

    const rows = response.data.values || [];

    const data = rows.slice(1).map(r => ({
      timestamp: r[0] || "",
      firstName: r[1] || "",
      lastName: r[2] || "",
      email: r[3] || "",
      phone: r[4] || "",
      homeBusiness: r[5] || "",
      industry: r[6] || "",
      size: r[7] || "",
      ownerTenant: r[8] || "",
      systemInterest: r[9] || ""
    }));

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ================= CHATBOT =================

router.get("/chatbot", authMiddleware, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1dqvP_2hiBpdGb7uXA_XQHg80NQOGnJ1aidSGF6ZeOwY",
      range: "Sheet1!A:E"
    });

    const rows = response.data.values || [];

    const data = rows.slice(1).map(r => ({
      name: r[0],
      phone: r[1],
      interest: r[2],
      message: r[3],
      date: r[4]
    }));

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router.post("/super-check", (req, res) => {

  const { password } = req.body;

  if (password === process.env.SUPER_PASSWORD) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Invalid password" });
});

router.get("/admins", authMiddleware, async (req, res) => {
  try {

    const { adminsDB } = require("../config/db");

    adminsDB.find({}, (err, docs) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      res.json({
        success: true,
        admins: docs
      });
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
module.exports = router;