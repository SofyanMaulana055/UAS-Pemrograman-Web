const express = require("express");
const PDFDocument = require("pdfkit");
const db = require("../db");
const router = express.Router();

router.get("/export/pdf", (req, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=laporan-data.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("LAPORAN DATA AIRLANE X CARGO", {
    align: "center",
  });

  doc.moveDown();

  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      doc.text("Gagal mengambil data");
      doc.end();
      return;
    }

    results.forEach((row, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${row.username} - ${row.role}`);
    });

    doc.end();
  });
});

module.exports = router;