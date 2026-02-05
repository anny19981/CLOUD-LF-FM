// ====== SONG DATEN ======
const songs = [
  { id: 0, title: "Boys4Life", artist: "Rolexander", file: "boys-4-life-(remastered).mp3", cover: "cover1.jpg" },
  { id: 1, title: "buben-boot", artist: "Rolexander", file: "buben-boot-(remastered-x2).mp3", cover: "cover2.jpg" },
  { id: 2, title: "lan-party", artist: "Rolexander", file: "lan-party--(remastered).mp3", cover: "cover3.jpg" },
  { id: 3, title: "lars-der-boss", artist: "Rolexander", file: "lars-der-boss.mp3", cover: "cover3.jpg" },
  { id: 4, title: "the boys", artist: "Rolexander", file: "the-boys.mp3", cover: "cover3.jpg" },
  { id: 5, title: "Level für Level", artist: "Rolexander", file: "level-fu╠êr-level.mp3", cover: "cover3.jpg" },
  { id: 6, title: "Luis der Technik-Man", artist: "Rolexander", file: "luis-der-technik-man.mp3", cover: "cover3.jpg" },
  { id: 7, title: "Mango Marcel", artist: "Rolexander", file: "mango-marcel.mp3", cover: "cover3.jpg" },
  { id: 8, title: "Mein Schacko", artist: "Rolexander", file: "mein-schackoo.mp3", cover: "cover3.jpg" },
  { id: 9, title: "Paulo", artist: "Rolexander", file: "paulo.mp3", cover: "cover3.jpg" },
  { id: 10, title: "Oh Philip", artist: "Rolexander", file: "oh-philip.mp3", cover: "cover3.jpg" },
  { id: 11, title: "Meine Jungs", artist: "Rolexander", file: "meine-jungs.mp3", cover: "cover3.jpg" }
];

// ====== ELEMENTE ======
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
const playlistEl = document.getElementById("playlist-view");

const sidebarLinks = document.querySelectorAll(".sidebar a");

let index = 0;
let shuffle = false;
let repeat = false;
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

// ====== AUDIO CONTEXT & EQUALIZER ======
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);

const bassFilter = audioCtx.createBiquadFilter();
bassFilter.type = "lowshelf"; bassFilter.frequency.value = 200;
const midFilter = audioCtx.createBiquadFilter();
midFilter.type = "peaking"; midFilter.frequency.value = 1000; midFilter.Q.value = 1;
const trebleFilter = audioCtx.createBiquadFilter();
trebleFilter.type = "highshelf"; trebleFilter.frequency.value = 3000;

// Verkabelung
source.connect(bassFilter).connect(midFilter).connect(trebleFilter).connect(audioCtx.destination);

// Visualizer
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
trebleFilter.connect(analyser);
analyser.connect(audioCtx.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// ====== FUNKTIONEN ======
function loadSong(i) {
    index = i;
    const s = songs[i];
    audio.src = s.file;
    titleEl.textContent = s.title;
    artistEl.textContent = s.artist;
    cover.style.backgroundImage = `url(${s.cover})`;
}

function playPause() {
    if (audioCtx.state === "suspended") audioCtx.resume();

    if (audio.paused) {
        audio.play(); playBtn.textContent = "⏸";
    } else {
        audio.pause(); playBtn.textContent = "▶️";
    }
}

function nextSong() {
    index = shuffle ? Math.floor(Math.random() * songs.length) : (index + 1) % songs.length;
    loadSong(index); audio.play(); playBtn.textContent = "⏸";
}

function prevSong() {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index); audio.play(); playBtn.textContent = "⏸";
}

function formatTime(t) {
    if (!t) return "0:00";
    return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2,"0");
}

function toggleFavorite(id) {
    if(favorites.includes(id)) favorites = favorites.filter(x => x!==id);
    else favorites.push(id);
    localStorage.setItem("fav", JSON.stringify(favorites));
    renderSongs(songs);
    renderPlaylist();
}

// ====== RENDER FUNKTIONEN ======
function renderArtists() {
    artistsEl.innerHTML = "";
    const unique = [...new Set(songs.map(s => s.artist))];
    unique.forEach(name => {
        const div = document.createElement("div");
        div.className = "artist"; div.textContent = name;
        div.onclick = () => renderSongs(songs.filter(s => s.artist === name));
        artistsEl.appendChild(div);
    });
}

function renderSongs(list) {
    songListEl.innerHTML = "";
    list.forEach(s => {
        const row = document.createElement("div"); row.className = "song";
        const title = document.createElement("span"); title.textContent = `${s.title} – ${s.artist}`;
        title.onclick = () => { loadSong(s.id); audio.play(); playBtn.textContent="⏸"; };
        const heart = document.createElement("span"); heart.textContent = favorites.includes(s.id) ? "❤️" : "🤍";
        heart.onclick = () => toggleFavorite(s.id);
        row.append(title, heart); songListEl.appendChild(row);
    });
}

function renderPlaylist() {
    playlistEl.innerHTML = "";
    favorites.forEach(id => {
        const s = songs[id];
        const row = document.createElement("div"); row.className = "track";
        const title = document.createElement("span"); title.textContent = `${s.title} – ${s.artist}`;
        title.onclick = () => { loadSong(s.id); audio.play(); playBtn.textContent="⏸"; };
        row.appendChild(title); playlistEl.appendChild(row);
    });
}

function showView(id) {
    document.querySelectorAll("#view-artists, #view-songs, #view-playlist").forEach(v => v.classList.remove("view-active"));
    const el = document.getElementById(id); if(el) el.classList.add("view-active");
}

// ====== EVENT LISTENERS ======
audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => repeat ? audio.play() : nextSong());

progress.oninput = () => { audio.currentTime = (progress.value/100)*audio.duration; };
playBtn.onclick = playPause;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;
shuffleBtn.onclick = () => { shuffle = !shuffle; shuffleBtn.classList.toggle("active", shuffle); };
repeatBtn.onclick = () => { repeat = !repeat; repeatBtn.classList.toggle("active", repeat); };

searchInput.oninput = e => {
    const q = e.target.value.toLowerCase();
    renderSongs(songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)));
};

// Sidebar Navigation
sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        const view = link.dataset.view;
        if(view==="songs") { renderSongs(songs); showView("view-songs"); }
        else if(view==="artists") { renderArtists(); showView("view-artists"); }
        else if(view==="playlist") { renderPlaylist(); showView("view-playlist"); }
        else showView("view-artists");
    });
});

// Equalizer
document.getElementById("bass").oninput = e => bassFilter.gain.value = e.target.value;
document.getElementById("mid").oninput = e => midFilter.gain.value = e.target.value;
document.getElementById("treble").oninput = e => trebleFilter.gain.value = e.target.value;

// ====== VISUALIZER ======
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener("resize", resizeCanvas); resizeCanvas();

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const barWidth = (canvas.width/bufferLength)*1.8;
    let x = 0;
    for(let i=0;i<bufferLength;i++){
        const barHeight = dataArray[i]*0.9;
        ctx.fillStyle = "rgba(29,185,84,0.35)";
        ctx.fillRect(x, canvas.height-barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}
drawVisualizer();

// ====== INITIAL LOAD ======
loadSong(0);
renderArtists();
renderSongs(songs);
renderPlaylist();
showView("view-artists");
