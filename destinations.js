const express = require("express");
const router = express.Router();
const db = require("./db");

// GET semua destinasi
router.get("/", (req, res) => {
  const sql = "SELECT id, name, image FROM destinations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    // tambahkan full URL gambar
    const data = results.map(item => ({
      id: item.id,
      name: item.name,
      image: `http://localhost:3001/uploads/destinasi/${item.image}`
    }));

    res.json(data);
  });
});

module.exports = router;
