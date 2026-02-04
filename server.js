const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC UPLOADS (INI YANG PALING PENTING)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Server jalan");
});

// =====================
// AUTH ROUTES
// =====================
app.use("/api/auth", authRoutes);

// =====================
// DESTINATIONS API
// =====================
app.get("/destinations", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Tokyo",
      image: "http://localhost:3001/uploads/destinasi/tokyo.jpg"
    },
    {
      id: 2,
      name: "Paris",
      image: "http://localhost:3001/uploads/destinasi/paris.jpg"
    },
    {
      id: 3,
      name: "Dubai",
      image: "http://localhost:3001/uploads/destinasi/dubai.jpg"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// === SERVE FRONTEND ===
app.use(express.static(path.join(__dirname, "../frontend")));

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

const exportPdf = require("./routes/exportPdf");
app.use("/api", exportPdf);
const exportExcel = require("./routes/exportExcel");
app.use("/api", exportExcel);