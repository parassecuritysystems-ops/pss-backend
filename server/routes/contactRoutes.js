const express = require("express");
const router = express.Router();

const sheets = require("../config/googleSheets");

const SHEET_ID = "YOUR_CONTACT_SHEET_ID";


// ================= SAVE CONTACT =================

router.post("/", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      service,
      message
    } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Contacts!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          name,
          email,
          phone,
          service,
          message,
          new Date().toLocaleString()
        ]]
      }
    });

    res.json({
      success: true,
      message: "Saved successfully"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});


// ================= GET CONTACTS =================

router.get("/", async (req, res) => {

  try {

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Contacts!A:F"
    });

    const rows = response.data.values || [];

    const data = rows.slice(1).map(row => ({
      name: row[0] || "",
      email: row[1] || "",
      phone: row[2] || "",
      service: row[3] || "",
      message: row[4] || "",
      createdAt: row[5] || ""
    }));

    res.json(data);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

module.exports = router;