const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "airlanexcargo_secret_key_2024";

// =====================
// REGISTER ENDPOINT
// =====================
router.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Username dan password tidak boleh kosong" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Password minimal 6 karakter" 
    });
  }

  // Cek apakah username sudah terdaftar
  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, result) => {
    if (err) {
      console.error("❌ Check username error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

    if (result.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Username sudah terdaftar" 
      });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("❌ Hash error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Error hashing password" 
        });
      }

      // Simpan user baru ke database
      const userRole = role || "customer";
      const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
      
      console.log("📝 Inserting user:", { username, userRole });
      
      db.query(insertSql, [username, hash, userRole], (err, result) => {
        if (err) {
          console.error("❌ Insert error:", err);
          console.error("Error code:", err.code);
          console.error("Error message:", err.message);
          
          // Return error detail untuk debugging
          return res.status(500).json({ 
            success: false, 
            message: `Error menyimpan user: ${err.message}` 
          });
        }

        console.log("✅ User registered successfully:", { userId: result.insertId, username });

        res.status(201).json({
          success: true,
          message: "Registrasi berhasil. Silakan login.",
          userId: result.insertId
        });
      });
    });
  });
});

// =====================
// LOGIN ENDPOINT
// =====================
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Username dan password tidak boleh kosong" 
    });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("❌ Login query error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

    if (result.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "Username atau password salah" 
      });
    }

    const user = result[0];

    // Verifikasi password dengan bcrypt
    bcrypt.compare(password, user.password, (err, isPasswordValid) => {
      if (err) {
        console.error("❌ Password compare error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Server error" 
        });
      }

      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: "Username atau password salah" 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "7d" }
      );

      console.log("✅ Login successful:", { userId: user.id, username: user.username });

      res.json({
        success: true,
        message: "Login berhasil",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    });
  });
});

// =====================
// GET USER PROFILE
// =====================
router.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Token tidak ada" 
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: "Token tidak valid" 
      });
    }

    const sql = "SELECT id, username, role FROM users WHERE id = ?";
    db.query(sql, [decoded.id], (err, result) => {
      if (err) {
        console.error("❌ Profile query error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Server error" 
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "User tidak ditemukan" 
        });
      }

      res.json({
        success: true,
        user: result[0]
      });
    });
  });
});

module.exports = router;
