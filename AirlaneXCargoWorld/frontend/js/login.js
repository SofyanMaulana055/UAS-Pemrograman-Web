const API_URL = "http://localhost:3001/api/auth";

async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const loginBtn = document.getElementById("loginBtn");
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");

  // Reset messages
  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  // Validasi
  if (!username || !password) {
    showError("Username dan password harus diisi", errorDiv);
    return;
  }

  // Disable button saat loading
  loginBtn.disabled = true;
  loginBtn.textContent = "Loading...";

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      // Simpan token ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showSuccess("Login berhasil! Redirecting...", successDiv);

      // Redirect ke dashboard setelah 1.5 detik
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      showError(data.message || "Login gagal", errorDiv);
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Terjadi kesalahan koneksi ke server", errorDiv);
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
}

function showError(message, element) {
  element.textContent = message;
  element.style.display = "block";
}

function showSuccess(message, element) {
  element.textContent = message;
  element.style.display = "block";
}

// Check if already logged in
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Jika sudah login, redirect ke dashboard
    window.location.href = "dashboard.html";
  }
});
