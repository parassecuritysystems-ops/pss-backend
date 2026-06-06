const express = require("express");
const router = express.Router();

const sheets = require("../config/googleSheets");

const SHEET_ID = "1S7Aj0Xuw2kpan1BRwwzsF9ORtMRp4ecIxl7AiT0v7_c";

router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      homeBusiness,
      industry,
      size,
      ownerTenant,
      systemInterest
    } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          firstName,
          lastName,
          email,
          phone,
          homeBusiness,
          industry,
          size,
          ownerTenant,
          systemInterest
        ]]
      }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;