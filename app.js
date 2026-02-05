// -------------------- SONGS --------------------
const songs = [
  { id: 0, title: "Boys4Life", artist: "Rolexander", file: "boys-4-life-(remastered).mp3", cover: "cover1.jpg" },
  { id: 1, title: "buben-boot", artist: "Rolexander", file: "buben-boot-(remastered-x2).mp3", cover: "cover2.jpg" },
  { id: 2, title: "lan-party", artist: "Rolexander", file: "lan-party--(remastered).mp3", cover: "cover3.jpg" },
  { id: 3, title: "lars-der-boss", artist: "Rolexander", file: "lars-der-boss.mp3", cover: "cover3.jpg" },
  { id: 4, title: "the boys", artist: "Rolexander", file: "the-boys.mp3", cover: "cover3.jpg" },
  { id: 5, title: "Level für Level", artist: "Rolexander", file: "level-fuer-level.mp3", cover: "cover3.jpg" },
  { id: 6, title: "Luis der Technik-Man", artist: "Rolexander", file: "luis-der-technik-man.mp3", cover: "cover3.jpg" },
  { id: 7, title: "Mango Marcel", artist: "Rolexander", file: "mango-marcel.mp3", cover: "cover3.jpg" },
  { id: 8, title: "Mein Schacko", artist: "Rolexander", file: "mein-schackoo.mp3", cover: "cover3.jpg" },
  { id: 9, title: "Paulo", artist: "Rolexander", file: "paulo.mp3", cover: "cover3.jpg" },
  { id: 10, title: "Oh Philip", artist: "Rolexander", file: "oh-philip.mp3", cover: "cover3.jpg" },
  { id: 11, title: "Meine Jungs", artist: "Rolexander", file: "meine-jungs.mp3", cover: "cover3.jpg" }
];

// automatisch Songs 12–20 hinzufügen
for (let i = 12; i <= 20; i++) {
  songs.push({ id: i, title: `Song ${i}`, artist: `Artist ${i % 5}`, file: `song${i}.mp3`, cover: `cover${i % 5}.jpg` });
}

// -------------------- ELEMENTE --------------------
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const searchInput = document.getElementById("search");
const artistsEl = document.getElementById("artists");
const songListEl = document.getElementById("songList");
const playlistEl = document.getElementById("playlist");
const sidebarLinks = document.querySelectorAll(".sidebar a");

let currentIndex = 0;
let shuffle = false;
let repeat = false;

// -------------------- AUDIO --------------------
function loadSong(i) {
  currentIndex = i;
  const s = songs[i];
  audio.src = s.file;
  titleEl.textContent = s.title;
  artistEl.textContent = s.artist;
  cover.style.backgroundImage = `url(${s.cover})`;
  audio.play();
  playBtn.textContent = "⏸";
}

function playPause() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

function nextSong() {
  currentIndex = shuffle ? Math.floor(Math.random() * songs.length) : (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
}
function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
}

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
});

audio.addEventListener("ended", () => repeat ? audio.play() : nextSong());

progress.oninput = () => { audio.currentTime = (progress.value / 100) * audio.duration; };

// -------------------- FORMAT --------------------
function format(t) { return !t ? "0:00" : Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0"); }

// -------------------- SONG RENDER --------------------
function renderSongs(list) {
  songListEl.innerHTML = "";
  list.forEach(song => {
    const div = document.createElement("div");
    div.className = "song";
    div.textContent = `${song.title} – ${song.artist}`;
    div.onclick = () => loadSong(song.id);
    songListEl.appendChild(div);
  });
}

// -------------------- ARTISTS RENDER --------------------
function renderArtists() {
  artistsEl.innerHTML = "";
  const artistNames = [...new Set(songs.map(s => s.artist))];
  artistNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "artist";
    div.textContent = name;
    div.onclick = () => {
      renderSongs(songs.filter(s => s.artist === name));
      showView("view-songs");
    };
    artistsEl.appendChild(div);
  });
}

// -------------------- LIVE SEARCH --------------------
searchInput.oninput = e => {
  const q = e.target.value.toLowerCase();
  renderSongs(songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)));
};

// -------------------- SIDEBAR --------------------
function showView(id) {
  document.querySelectorAll("#view-artists,#view-songs,#view-playlist").forEach(v => v.classList.remove("view-active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("view-active");
}

sidebarLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    sidebarLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    const view = link.dataset.view;

    if (view === "songs") { renderSongs(songs); showView("view-songs"); }
    else if (view === "artists") { renderArtists(); showView("view-artists"); }
    else if (view === "playlist") { showView("view-playlist"); }
    else if (view === "home") { renderArtists(); showView("view-artists"); }
  });
});

// -------------------- BUTTON EVENTS --------------------
playBtn.onclick = playPause;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;
shuffleBtn.onclick = () => { shuffle = !shuffle; shuffleBtn.classList.toggle("active", shuffle); };
repeatBtn.onclick = () => { repeat = !repeat; repeatBtn.classList.toggle("active", repeat); };

// -------------------- VISUALIZER --------------------
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = (canvas.width / bufferLength) * 1.8;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 0.9;
    ctx.fillStyle = `rgba(29,185,84,0.35)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// -------------------- INIT --------------------
renderArtists();
renderSongs(songs);
loadSong(0);
drawVisualizer();
