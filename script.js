import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const songList = document.getElementById("songList");

async function loadSongs() {
  const querySnapshot = await getDocs(collection(db, "songs"));
  querySnapshot.forEach((doc) => {
    const song = doc.data();
    const card = document.createElement("div");
    card.classList.add("song-card");
    card.innerHTML = `
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist || ""}</div>
      <div class="song-lyrics">${song.lyrics}</div>
    `;
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
    songList.appendChild(card);
  });
}

loadSongs().catch((error) => {
  console.error("Error loading songs:", error);
});
