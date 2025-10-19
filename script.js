let allSongs = [];

async function fetchSongs() {
  try {
    // Replace YOUR_SHEET_ID with your actual Google Sheet ID
    const sheetUrl = "https://opensheet.elk.sh/1naJW40iojGxR9KYiQtB0Sn1FZnEVL8w8QxO5o-WEUjU/songs";
    const response = await fetch(sheetUrl);
    const songs = await response.json();
    allSongs = songs;
    renderSongs(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    document.getElementById("songsContainer").innerHTML =
      "<p>Unable to load songs at the moment. Please try again later.</p>";
  }
}

function renderSongs(songs) {
  const container = document.getElementById("songsContainer");
  container.innerHTML = "";

  if (songs.length === 0) {
    container.innerHTML = "<p>No songs found.</p>";
    return;
  }

  songs.forEach(song => {
    const songCard = document.createElement("div");
    songCard.className = "song-card";
    songCard.innerHTML = `
      <h3>${song.title}</h3>
      <a href="${song.youtubeLink}" target="_blank">🎧 Watch on YouTube</a>
      <p>${song.lyrics}</p>
    `;
    container.appendChild(songCard);
  });
}

function filterSongs() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allSongs.filter(song =>
    song.title.toLowerCase().includes(query)
  );
  renderSongs(filtered);
}

/* -------- Dark Mode Toggle -------- */
const toggleButton = document.getElementById("themeToggle");

// Load saved theme preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleButton.textContent = "☀️";
}

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggleButton.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

fetchSongs();