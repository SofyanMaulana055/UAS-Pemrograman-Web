// =====================
// CEK TOKEN (KEAMANAN)
// =====================
const token = localStorage.getItem("token");
if (!token) {
  alert("Silakan login terlebih dahulu");
  window.location.href = "login.html";
}

// =====================
// TAMPILKAN USERNAME
// =====================
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("username-display").textContent = user.username;
}

// =====================
// GRAFIK DESTINASI
// =====================
const ctxDest = document.getElementById("destChart");
new Chart(ctxDest, {
  type: "bar",
  data: {
    labels: ["Tokyo", "Paris", "Dubai", "Singapore", "Bangkok"],
    datasets: [{
      label: "Jumlah Pengiriman",
      data: [12, 8, 15, 10, 7],
      backgroundColor: [
        "rgba(102, 126, 234, 0.8)",
        "rgba(240, 147, 251, 0.8)",
        "rgba(245, 87, 108, 0.8)",
        "rgba(4, 204, 153, 0.8)",
        "rgba(255, 168, 76, 0.8)"
      ],
      borderColor: [
        "rgba(102, 126, 234, 1)",
        "rgba(240, 147, 251, 1)",
        "rgba(245, 87, 108, 1)",
        "rgba(4, 204, 153, 1)",
        "rgba(255, 168, 76, 1)"
      ],
      borderWidth: 2,
      borderRadius: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
});

// =====================
// GRAFIK STATUS PENGIRIMAN
// =====================
const ctxStatus = document.getElementById("statusChart");
new Chart(ctxStatus, {
  type: "doughnut",
  data: {
    labels: ["Terkirim", "Dalam Proses", "Pending", "Dibatalkan"],
    datasets: [{
      data: [18, 5, 2, 0],
      backgroundColor: [
        "rgba(4, 204, 153, 0.8)",
        "rgba(102, 126, 234, 0.8)",
        "rgba(255, 168, 76, 0.8)",
        "rgba(245, 87, 108, 0.8)"
      ],
      borderColor: [
        "rgba(4, 204, 153, 1)",
        "rgba(102, 126, 234, 1)",
        "rgba(255, 168, 76, 1)",
        "rgba(245, 87, 108, 1)"
      ],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// =====================
// LOGOUT FUNCTION
// =====================
function logout() {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "home.html";
  }
}

// =====================
// GRAFIK CARGO
// =====================
const ctx = document.getElementById("cargoChart");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan","Feb","Mar","Apr","Mei","Jun"],
    datasets: [{
      label: "Jumlah Cargo",
      data: [12, 19, 15, 25, 30, 45],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true
  }
});

function loadPage(page) {
  const content = document.getElementById("content");

  if (page === "dashboard") {
    content.innerHTML = `
      <h2>Dashboard</h2>
      <p>Ringkasan sistem pengiriman & keamanan</p>
    `;
  }

  if (page === "users") {
    content.innerHTML = `
      <h2>Kelola Pengguna</h2>
      <p>Manajemen akun pengguna & admin</p>
      <button class="btn">Tambah User</button>
    `;
  }

  if (page === "shipments") {
    content.innerHTML = `
      <h2>Kelola Pengiriman</h2>
      <p>Data pengiriman cargo udara</p>
      <button class="btn">Tambah Pengiriman</button>
    `;
  }

  if (page === "destinations") {
    content.innerHTML = `
      <h2>Kelola Destinasi</h2>
      <p>Manajemen kota & negara tujuan</p>
      <button class="btn">Tambah Destinasi</button>
    `;
  }

  if (page === "reports") {
    content.innerHTML = `
      <h2>Laporan & Analitik</h2>
      <p>Statistik pengiriman dan keamanan</p>
    `;
  }

  if (page === "settings") {
    content.innerHTML = `
      <h2>Pengaturan Sistem</h2>
      <p>ISMS • ISO 27001 • Hak Akses</p>
    `;
  }
}
