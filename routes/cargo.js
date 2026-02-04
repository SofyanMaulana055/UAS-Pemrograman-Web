const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/cargo", (req, res) => {
  db.query("SELECT * FROM cargo", (err, result) => {
    res.json(result);
  });
});

router.post("/cargo", (req, res) => {
  const { name, destination, weight } = req.body;
  db.query(
    "INSERT INTO cargo (name, destination, weight) VALUES (?, ?, ?)",
    [name, destination, weight],
    () => res.json({ success: true })
  );
});

module.exports = router;
