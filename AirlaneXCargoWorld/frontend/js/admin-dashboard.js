// =====================
// CEK TOKEN & ROLE
// =====================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "admin") {
  window.location.href = "login.html";
}

const API_URL = "http://localhost:3001/api";

// =====================
// SETUP HEADER
// =====================
document.getElementById("username-display").textContent = user.username;

// =====================
// CHARTS INITIALIZATION
// =====================
function initCharts() {
  // Shipment Chart
  const ctxShipment = document.getElementById("shipmentChart");
  new Chart(ctxShipment, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Pengiriman",
        data: [65, 78, 90, 81, 95, 110],
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Status Distribution Chart
  const ctxStatus = document.getElementById("statusDistributionChart");
  new Chart(ctxStatus, {
    type: "doughnut",
    data: {
      labels: ["Terkirim", "Dalam Proses", "Pending", "Dibatalkan"],
      datasets: [{
        data: [180, 50, 20, 5],
        backgroundColor: [
          "rgba(4, 204, 153, 0.8)",
          "rgba(102, 126, 234, 0.8)",
          "rgba(255, 168, 76, 0.8)",
          "rgba(245, 87, 108, 0.8)"
        ]
      }]
    },
    options: {
      responsive: true
    }
  });

  // Top Destinations Chart
  const ctxTopDest = document.getElementById("topDestinationsChart");
  new Chart(ctxTopDest, {
    type: "bar",
    data: {
      labels: ["Tokyo", "Paris", "Dubai", "Singapore", "Bangkok"],
      datasets: [{
        label: "Jumlah Pengiriman",
        data: [45, 38, 50, 35, 28],
        backgroundColor: [
          "rgba(102, 126, 234, 0.8)",
          "rgba(240, 147, 251, 0.8)",
          "rgba(245, 87, 108, 0.8)",
          "rgba(4, 204, 153, 0.8)",
          "rgba(255, 168, 76, 0.8)"
        ]
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y'
    }
  });

  // User Trend Chart
  const ctxUserTrend = document.getElementById("userTrendChart");
  new Chart(ctxUserTrend, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      datasets: [{
        label: "Pengguna Baru",
        data: [12, 19, 25, 32, 40],
        borderColor: "#04cc99",
        backgroundColor: "rgba(4, 204, 153, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true
    }
  });
}

// =====================
// LOAD ADMIN DATA
// =====================
async function loadAdminData() {
  try {
    // Set stats (mock data untuk sekarang)
    document.getElementById("stat-users").textContent = "1,254";
    document.getElementById("stat-pengiriman-total").textContent = "3,847";
    document.getElementById("stat-destinasi-total").textContent = "12";
    document.getElementById("stat-revenue").textContent = "Rp 2.5M";

    // Load users
    loadUsers();

    // Load shipments
    loadAllShipments();

    // Load destinations
    loadDestinations();

    // Init charts
    initCharts();
  } catch (error) {
    console.error("Error loading admin data:", error);
  }
}

function loadUsers() {
  const usersBody = document.querySelector("#users-table tbody");
  
  const mockUsers = [
    { id: 1, username: "sopyan", role: "customer", status: "Aktif", tanggal: "23 Jan 2026" },
    { id: 2, username: "admin", role: "admin", status: "Aktif", tanggal: "20 Jan 2026" },
    { id: 3, username: "budi", role: "customer", status: "Aktif", tanggal: "19 Jan 2026" }
  ];

  usersBody.innerHTML = mockUsers.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}">${u.role}</span></td>
      <td><span class="badge badge-success">${u.status}</span></td>
      <td>${u.tanggal}</td>
      <td>
        <button class="btn-action" onclick="editUser(${u.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action btn-delete" onclick="deleteUser(${u.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function loadAllShipments() {
  const shipmentsBody = document.querySelector("#shipments-table tbody");
  
  const mockShipments = [
    { id: 1, paket: "Elektronik", dari: "Jakarta", ke: "Tokyo", status: "Terkirim", user: "sopyan", tanggal: "23 Jan 2026" },
    { id: 2, paket: "Fashion", dari: "Surabaya", ke: "Paris", status: "Dalam Proses", user: "budi", tanggal: "22 Jan 2026" },
    { id: 3, paket: "Furnitur", dari: "Bandung", ke: "Dubai", status: "Pending", user: "sopyan", tanggal: "21 Jan 2026" }
  ];

  shipmentsBody.innerHTML = mockShipments.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.paket}</td>
      <td>${s.dari}</td>
      <td>${s.ke}</td>
      <td><span class="badge ${s.status === 'Terkirim' ? 'badge-success' : s.status === 'Dalam Proses' ? 'badge-primary' : 'badge-warning'}">${s.status}</span></td>
      <td>${s.user}</td>
      <td>${s.tanggal}</td>
      <td>
        <button class="btn-action" onclick="editShipment(${s.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action btn-delete" onclick="deleteShipment(${s.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function loadDestinations() {
  const destBody = document.querySelector("#destinations-table tbody");
  
  const mockDestinations = [
    { id: 1, nama: "Tokyo", negara: "Jepang", biaya: "Rp 500.000", status: "Aktif" },
    { id: 2, nama: "Paris", negara: "Prancis", biaya: "Rp 600.000", status: "Aktif" },
    { id: 3, nama: "Dubai", negara: "UAE", biaya: "Rp 550.000", status: "Aktif" }
  ];

  destBody.innerHTML = mockDestinations.map(d => `
    <tr>
      <td>${d.id}</td>
      <td>${d.nama}</td>
      <td>${d.negara}</td>
      <td>${d.biaya}</td>
      <td><span class="badge badge-success">${d.status}</span></td>
      <td>
        <button class="btn-action" onclick="editDestination(${d.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action btn-delete" onclick="deleteDestination(${d.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

// =====================
// MODAL FUNCTIONS
// =====================
function openAddUserModal() {
  alert("Form tambah pengguna akan ditampilkan di sini");
}

function openAddShipmentModal() {
  alert("Form tambah pengiriman akan ditampilkan di sini");
}

function openAddDestinationModal() {
  alert("Form tambah destinasi akan ditampilkan di sini");
}

// =====================
// EDIT & DELETE FUNCTIONS
// =====================
function editUser(userId) {
  alert(`Edit pengguna ${userId}`);
}

function deleteUser(userId) {
  if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
    alert(`Pengguna ${userId} dihapus`);
  }
}

function editShipment(shipmentId) {
  alert(`Edit pengiriman ${shipmentId}`);
}

function deleteShipment(shipmentId) {
  if (confirm("Apakah Anda yakin ingin menghapus pengiriman ini?")) {
    alert(`Pengiriman ${shipmentId} dihapus`);
  }
}

function editDestination(destId) {
  alert(`Edit destinasi ${destId}`);
}

function deleteDestination(destId) {
  if (confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) {
    alert(`Destinasi ${destId} dihapus`);
  }
}

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
// EXPORT LAPORAN
function exportPDF() {
  window.open("http://localhost:3000/api/export/pdf", "_blank");
}

function exportExcel() {
  window.open("http://localhost:3000/api/export/excel", "_blank");
}

// =====================
// TAB SWITCHING FUNCTION
// =====================
function switchTab(event, tabName) {
  event.preventDefault();
  
  // Update active sidebar item
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  // Hide all management sections
  const allSections = document.querySelectorAll('.admin-stats, .admin-charts, .admin-management, #admin-laporan, #admin-pengaturan');
  allSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  const sections = {
    'dashboard': ['admin-welcome', 'admin-stats', 'admin-charts', 'admin-management'],
    'pengguna': ['admin-management'],
    'pengiriman': ['admin-management'],
    'destinasi': ['admin-management'],
    'laporan': ['admin-laporan'],
    'pengaturan': ['admin-pengaturan']
  };
  
  if (sections[tabName]) {
    sections[tabName].forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.style.display = 'block';
        if (tabName === 'dashboard') {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
}

// =====================
// LAPORAN FUNCTIONS
// =====================
function viewDetailReport(reportType) {
  const reportNames = {
    'shipment': 'Pertumbuhan Pengiriman',
    'destination': 'Distribusi Destinasi',
    'user': 'Statistik Pengguna',
    'revenue': 'Revenue Report'
  };
  alert(`Membuka detail laporan: ${reportNames[reportType] || 'Laporan'}`);
}

// =====================
// PENGATURAN FUNCTIONS
// =====================
function backupDatabase() {
  if (confirm('Apakah Anda yakin ingin membuat backup database?')) {
    alert('Backup database dimulai... File akan didownload secara otomatis');
  }
}

function restoreDatabase() {
  alert('Form restore database akan ditampilkan');
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", function() {
  loadAdminData();
  // Show only dashboard and management sections on load
  document.getElementById('admin-laporan').style.display = 'none';
  document.getElementById('admin-pengaturan').style.display = 'none';
});