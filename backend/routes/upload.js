const express = require("express");
const multer = require("multer");
const Papa = require("papaparse");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), (req, res) => {
  try {
    const csv = fs.readFileSync(req.file.path, "utf8");

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      totalRows: parsed.data.length,
      rows: parsed.data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "CSV Parsing Failed",
    });
  }
});

module.exports = router;