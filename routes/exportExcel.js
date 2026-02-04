const express = require("express");
const ExcelJS = require("exceljs");
const db = require("../db");
const router = express.Router();

router.get("/export/excel", async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Data");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Username", key: "username", width: 30 },
    { header: "Role", key: "role", width: 20 },
  ];

  db.query("SELECT * FROM users", async (err, rows) => {
    if (err) return res.send("Gagal export");

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=laporan.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;