const songList = document.getElementById("songList");

// Replace this with your raw GitHub URL
const songsUrl = "https://raw.githubusercontent.com/keshab101/lyrical-sansar-new/refs/heads/main/songs.json";

async function loadSongs() {
  try {
    const res = await fetch(songsUrl);
    const songs = await res.json();

    songs.forEach((song) => {
      const card = document.createElement("div");
      card.classList.add("song-card");
      card.innerHTML = `
        <div class="song-title">${song.title}</div>
        <div class="song-lyrics">${song.lyrics}</div>
        <div class="song-link"><a href="${song.youtubeLink}" target="_blank">Watch on YouTube</a></div>
      `;

      card.addEventListener("click", () => {
        card.classList.toggle("active");
      });

      songList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading songs:", error);
  }
}

loadSongs();