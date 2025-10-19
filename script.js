let allSongs = [];

document.addEventListener("DOMContentLoaded", () => {
  const fetchUrl = "https://script.google.com/macros/s/AKfycbzk6EEWzCfqfq5lya3d3YPh-5Pfs8GQOuxGYYLVnr6L0uYjg4PZylguia4URTaQVT8N/exec";

  const container = document.getElementById("songsContainer");
  const searchInput = document.getElementById("searchInput");
  const themeToggle = document.getElementById("themeToggle");

  const sunIconUrl = "https://omgsymbol.com/download/sun/06/vector/logo.svg";
  const moonIconUrl = "https://omgsymbol.com/download/moon/04/vector/logo.svg";

  // --- Dark mode setup ---
  function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function applyInitialTheme() {
    const saved = safeGetItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.style.backgroundImage = `url(${moonIconUrl})`;
    } else {
      document.body.classList.remove("dark-mode");
      themeToggle.style.backgroundImage = `url(${sunIconUrl})`;
    }
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    if (isDark) {
      themeToggle.style.backgroundImage = `url(${moonIconUrl})`;
    } else {
      themeToggle.style.backgroundImage = `url(${sunIconUrl})`;
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
  
  applyInitialTheme();
  
  // Collapsible header on scroll
  const header = document.querySelector("header");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Hide header when scrolling down
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    // Show "back to top" button
    if (currentScrollY > 400) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }

    lastScrollY = currentScrollY;
  });

  // Scroll to top smoothly
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  function renderSongs(songs) {
    container.innerHTML = "";
    if (!Array.isArray(songs) || songs.length === 0) {
      container.innerHTML = "<p>No songs found.</p>";
      return;
    }

    songs.forEach(song => {
      const title = song.title || song.Title || "Untitled";
      const lyrics = song.lyrics || song.Lyrics || "";

      const card = document.createElement("div");
      card.className = "song-card";
      card.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(lyrics)}</p>
      `;

      // Click to toggle lyrics
      card.addEventListener("click", () => {
        card.classList.toggle("expanded");
      });

      container.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str && str !== "") return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\n", "<br>");
  }
  function escapeAttr(str) {
    if (!str && str !== "") return "";
    return String(str).replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }

  async function fetchSongs() {
    container.innerHTML = "<p class='loading'>Loading songs...</p>";
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        container.innerHTML = `<p>Unable to fetch songs. HTTP ${res.status} — ${res.statusText}</p>`;
        console.error("Fetch error:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      allSongs = Array.isArray(data) ? data : Object.values(data);
      renderSongs(allSongs);
    } catch (err) {
      console.error("Fetch exception:", err);
      container.innerHTML = "<p>Unable to load songs. Network or CORS error occurred.</p>";
    }
  }

  function filterSongs() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (!q) return renderSongs(allSongs);

    const filtered = allSongs.filter(song => {
      const title = (song.title || song.Title || "").toLowerCase();
      const lyrics = (song.lyrics || song.Lyrics || "").toLowerCase();
      return title.includes(q) || lyrics.includes(q);
    });
    renderSongs(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", filterSongs);
  window.filterSongs = filterSongs;

  fetchSongs();
});