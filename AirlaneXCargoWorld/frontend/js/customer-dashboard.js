// =====================
// CEK TOKEN & ROLE
// =====================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "customer") {
  window.location.href = "login.html";
}

const API_URL = "http://localhost:3001/api";

// =====================
// SETUP HEADER
// =====================
document.getElementById("username-display").textContent = user.username;
document.getElementById("welcome-name").textContent = user.username.charAt(0).toUpperCase() + user.username.slice(1);

// =====================
// DESTINASI DATA
// =====================
const destinasiData = [
  {
    id: 1,
    nama: "Tokyo",
    negara: "Jepang",
    deskripsi: "Ibu kota Jepang dengan teknologi canggih",
    biaya: 500000,
    rating: 4.9,
    populer: 45,
    image: "http://localhost:3001/uploads/destinasi/tokyo.jpg"
  },
  {
    id: 2,
    nama: "Paris",
    negara: "Prancis",
    deskripsi: "Kota cahaya dengan pemandangan yang menakjubkan",
    biaya: 600000,
    rating: 4.8,
    populer: 38,
    image: "http://localhost:3001/uploads/destinasi/paris.jpg"
  },
  {
    id: 3,
    nama: "Dubai",
    negara: "UAE",
    deskripsi: "Kota modern dengan arsitektur futuristik",
    biaya: 550000,
    rating: 4.7,
    populer: 50,
    image: "http://localhost:3001/uploads/destinasi/dubai.jpg"
  }
];

// =====================
// LOAD DATA
// =====================
async function loadCustomerData() {
  try {
    // Load destinasi
    renderDestinations(destinasiData);

    // Load pengiriman customer
    loadShipments();

    // Setup event listeners
    setupEventListeners();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function renderDestinations(destinations) {
  const destList = document.getElementById("destinasi-list");
  
  if (!destinations || destinations.length === 0) {
    destList.innerHTML = '<p style="text-align: center; color: #999;">Belum ada destinasi</p>';
    return;
  }

  destList.innerHTML = destinations.map(dest => `
    <div class="destination-card">
      <img src="${dest.image}" alt="${dest.nama}">
      <div class="destination-info">
        <h3>${dest.nama}</h3>
        <p>${dest.negara}</p>
        <button class="btn-small" onclick="selectDestination('${dest.id}', '${dest.nama}')">
          <i class="fas fa-arrow-right"></i> Kirim ke ${dest.nama}
        </button>
      </div>
    </div>
  `).join("");
}

function loadShipments() {
  // Mock data - dalam implementasi nyata, fetch dari API
  const shipmentsBody = document.querySelector("#shipments-table tbody");
  
  const mockShipments = [
    {
      id: "#001",
      paket: "Elektronik",
      dari: "Jakarta",
      ke: "Tokyo",
      status: "Terkirim",
      tanggal: "23 Jan 2026"
    },
    {
      id: "#002",
      paket: "Fashion",
      dari: "Surabaya",
      ke: "Paris",
      status: "Dalam Proses",
      tanggal: "22 Jan 2026"
    }
  ];

  if (mockShipments.length === 0) {
    shipmentsBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 30px;">
          <i class="fas fa-inbox" style="font-size: 2em; color: #ccc;"></i>
          <p style="color: #999;">Belum ada pengiriman</p>
        </td>
      </tr>
    `;
    return;
  }

  shipmentsBody.innerHTML = mockShipments.map((ship, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${ship.paket}</td>
      <td>${ship.dari}</td>
      <td>${ship.ke}</td>
      <td><span class="badge ${ship.status === 'Terkirim' ? 'badge-success' : 'badge-primary'}">${ship.status}</span></td>
      <td>${ship.tanggal}</td>
      <td>
        <button class="btn-action" onclick="trackShipment('${ship.id}')">
          <i class="fas fa-map-location-dot"></i> Lacak
        </button>
      </td>
    </tr>
  `).join("");

  // Update stats
  document.getElementById("stat-pengiriman").textContent = mockShipments.length;
  document.getElementById("stat-terkirim").textContent = mockShipments.filter(s => s.status === "Terkirim").length;
  document.getElementById("stat-proses").textContent = mockShipments.filter(s => s.status === "Dalam Proses").length;
}

// =====================
// DESTINASI SECTION
// =====================
function renderDestinasiFull(destinations) {
  const destGrid = document.getElementById("destinasi-grid-full");
  
  destGrid.innerHTML = destinations.map(dest => `
    <div class="destinasi-card-full">
      <div class="destinasi-image">
        <img src="${dest.image}" alt="${dest.nama}">
        <div class="destinasi-badge">
          <span class="rating"><i class="fas fa-star"></i> ${dest.rating}</span>
          <span class="jumlah">+${dest.populer} pengiriman</span>
        </div>
      </div>
      <div class="destinasi-body">
        <h3>${dest.nama}</h3>
        <p class="negara">${dest.negara}</p>
        <p class="deskripsi">${dest.deskripsi}</p>
        <div class="destinasi-footer">
          <span class="biaya">Rp ${dest.biaya.toLocaleString('id-ID')}</span>
          <button class="btn-pesan" onclick="selectDestination('${dest.id}', '${dest.nama}')">
            <i class="fas fa-paper-plane"></i> Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Update stats
  document.getElementById("total-destinasi").textContent = destinations.length;
  document.getElementById("pengiriman-minggu").textContent = destinations.reduce((a, b) => a + b.populer, 0);
}

// =====================
// FORM PENGIRIMAN
// =====================
function updateBiaya() {
  const destinasi = document.getElementById("ke-destinasi").value;
  const biayaMap = {
    "tokyo": 500000,
    "paris": 600000,
    "dubai": 550000
  };

  const biaya = biayaMap[destinasi] || 0;
  const asuransi = 10000;
  const total = biaya + asuransi;

  document.getElementById("biaya-pengiriman").textContent = `Rp ${biaya.toLocaleString('id-ID')}`;
  document.getElementById("total-biaya").textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function submitPengiriman(event) {
  event.preventDefault();

  const formData = {
    namaPaket: document.getElementById("nama-paket").value,
    beratPaket: document.getElementById("berat-paket").value,
    kategori: document.getElementById("kategori-paket").value,
    deskripsi: document.getElementById("deskripsi").value,
    dariLokasi: document.getElementById("dari-lokasi").value,
    keDestinasi: document.getElementById("ke-destinasi").value,
    alamatTujuan: document.getElementById("alamat-tujuan").value,
    namaPenerima: document.getElementById("nama-penerima").value,
    nomorPenerima: document.getElementById("nomor-penerima").value,
    emailPenerima: document.getElementById("email-penerima").value,
    metodePembayaran: document.querySelector('input[name="payment"]:checked').value
  };

  console.log("Data Pengiriman:", formData);
  alert("✅ Pengiriman berhasil dibuat!\n\nNo. Tracking: #PEN" + Date.now());
  
  // Reset form
  document.getElementById("pengirimanForm").reset();
  updateBiaya();
  
  // Redirect ke riwayat
  setTimeout(() => {
    window.location.hash = "riwayat";
  }, 1000);
}

// =====================
// RIWAYAT FUNCTIONS
// =====================
function lihatDetail(shipmentId) {
  alert(`Menampilkan detail pengiriman ${shipmentId}`);
}

function ulangiPengiriman(paket, destinasi) {
  document.getElementById("nama-paket").value = paket;
  document.getElementById("ke-destinasi").value = destinasi.toLowerCase();
  updateBiaya();
  window.location.hash = "pengiriman";
  document.querySelector("html").scrollTop = 0;
}

// =====================
// RIWAYAT FILTER
// =====================
function setupEventListeners() {
  // Destinasi search & filter
  document.getElementById("destinasi-search")?.addEventListener("keyup", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = destinasiData.filter(d => d.nama.toLowerCase().includes(query));
    renderDestinasiFull(filtered);
  });

  document.getElementById("destinasi-sort")?.addEventListener("change", (e) => {
    let sorted = [...destinasiData];
    
    if (e.target.value === "nama") {
      sorted.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (e.target.value === "biaya") {
      sorted.sort((a, b) => a.biaya - b.biaya);
    } else if (e.target.value === "populer") {
      sorted.sort((a, b) => b.populer - a.populer);
    }
    
    renderDestinasiFull(sorted);
  });

  // Riwayat filters
  document.getElementById("riwayat-search")?.addEventListener("keyup", filterRiwayat);
  document.getElementById("riwayat-filter-status")?.addEventListener("change", filterRiwayat);
  document.getElementById("riwayat-filter-periode")?.addEventListener("change", filterRiwayat);

  // Render destinasi lengkap di section
  renderDestinasiFull(destinasiData);
}

function filterRiwayat() {
  const search = document.getElementById("riwayat-search").value.toLowerCase();
  const status = document.getElementById("riwayat-filter-status").value;
  const periode = document.getElementById("riwayat-filter-periode").value;

  console.log("Filter:", { search, status, periode });
  // Implement filter logic here
}

// =====================
// ACTION BUTTONS
// =====================
function selectDestination(destId, destName) {
  document.getElementById("ke-destinasi").value = destName.toLowerCase();
  updateBiaya();
  window.location.hash = "pengiriman";
  document.querySelector("html").scrollTop = 0;
}

function trackShipment(shipmentId) {
  alert(`Melacak pengiriman ${shipmentId}`);
  window.location.hash = "riwayat";
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

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", loadCustomerData);