fetch("http://localhost:3000/destinations")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("destinations");

    data.forEach(dest => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${dest.image}">
        <h3>${dest.name} - ${dest.country}</h3>
        <p>${dest.description}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch(() => {
    alert("Server tidak tersedia");
  });
function toggleDark() {
  document.body.classList.toggle("dark");
}

fetch("http://localhost:3001/api/destinations")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("destinationList");

    data.forEach(dest => {
      const card = document.createElement("div");
      card.className = "destination-card";

      card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}">
        <h3>${dest.name}</h3>
        <a href="login.html" class="btn">Login</a>
        <a href="register.html" class="btn-outline">Registrasi</a>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));
