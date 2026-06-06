const express = require("express");
const router = express.Router();

const sheets = require("../config/googleSheets");

const SHEET_ID = "1dqvP_2hiBpdGb7uXA_XQHg80NQOGnJ1aidSGF6ZeOwY";

router.post("/", async (req, res) => {
  try {
    const { name, phone, interest, message } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          name,
          phone,
          interest,
          message,
          new Date().toLocaleString()
        ]]
      }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;