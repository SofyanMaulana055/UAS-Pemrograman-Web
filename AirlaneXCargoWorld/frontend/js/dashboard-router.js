// =====================
// CEK TOKEN & ROLE
// =====================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("Silakan login terlebih dahulu");
  window.location.href = "login.html";
}

// Redirect berdasarkan role
if (user.role === "admin") {
  window.location.href = "admin-dashboard.html";
} else if (user.role === "customer") {
  window.location.href = "customer-dashboard.html";
} else {
  alert("Role tidak dikenali");
  window.location.href = "login.html";
}