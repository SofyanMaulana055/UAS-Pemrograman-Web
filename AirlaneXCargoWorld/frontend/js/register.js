const API_URL = "http://localhost:3001/api/auth";

async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;
  const registerBtn = document.getElementById("registerBtn");
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");

  // Reset messages
  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  // Validasi
  if (!username || !password || !confirmPassword) {
    showError("Semua field harus diisi", errorDiv);
    return;
  }

  if (username.length < 3) {
    showError("Username minimal 3 karakter", errorDiv);
    return;
  }

  if (password.length < 6) {
    showError("Password minimal 6 karakter", errorDiv);
    return;
  }

  if (password !== confirmPassword) {
    showError("Password dan konfirmasi password tidak cocok", errorDiv);
    return;
  }

  // Disable button saat loading
  registerBtn.disabled = true;
  registerBtn.textContent = "Loading...";

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password, role })
    });

    const data = await response.json();

    if (data.success) {
      showSuccess("Registrasi berhasil! Redirecting ke login...", successDiv);

      // Clear form
      document.getElementById("registerForm").reset();

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      showError(data.message || "Registrasi gagal", errorDiv);
      registerBtn.disabled = false;
      registerBtn.textContent = "Daftar";
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Terjadi kesalahan koneksi ke server", errorDiv);
    registerBtn.disabled = false;
    registerBtn.textContent = "Daftar";
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