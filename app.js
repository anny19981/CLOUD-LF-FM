// --- SONGS ---
const songs = [
  { id: 0, title: "Boys4Life", artist: "Rolexander", file: "boys-4-life-(remastered).mp3", cover: "cover1.jpg" },
  { id: 1, title: "buben-boot", artist: "Rolexander", file: "buben-boot-(remastered-x2).mp3", cover: "cover2.jpg" },
  { id: 2, title: "lan-party", artist: "Rolexander", file: "lan-party--(remastered).mp3", cover: "cover3.jpg" }
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

// Weitere Songs automatisch hinzufügen, bis id=20
for (let i = 3; i <= 20; i++) {
  songs.push({
    id: i,
    title: `Song ${i}`,
    artist: `Artist ${i%5}`,
    file: `song${i}.mp3`,
    cover: `cover${i%5}.jpg`
  });
}

// --- ELEMENTE ---
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const songListEl = document.getElementById("songList");
const sidebarLinks = document.querySelectorAll(".sidebar a");
const searchInput = document.getElementById("search");

// --- STATE ---
let index = 0;
let shuffle = false;
let repeat = false;

// --- SONG LADEN ---
function loadSong(i){
  index = i;
  const s = songs[i];
  audio.src = s.file;
  titleEl.textContent = s.title;
  artistEl.textContent = s.artist;
  cover.style.backgroundImage = `url(${s.cover})`;
  audio.play();
  document.getElementById("play").textContent = "⏸";
}

// --- PLAY / PAUSE ---
document.getElementById("play").onclick = () => {
  if(audio.paused){ audio.play(); document.getElementById("play").textContent="⏸"; }
  else { audio.pause(); document.getElementById("play").textContent="▶️"; }
};

// --- NEXT / PREV ---
document.getElementById("next").onclick = () => nextSong();
document.getElementById("prev").onclick = () => prevSong();

function nextSong(){
  index = shuffle ? Math.floor(Math.random() * songs.length) : (index+1)%songs.length;
  loadSong(index);
}
function prevSong(){
  index = (index-1+songs.length)%songs.length;
  loadSong(index);
}

// --- PROGRESS ---
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime/audio.duration)*100 || 0;
  currentEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
});
progress.oninput = () => { audio.currentTime = (progress.value/100)*audio.duration; };
audio.addEventListener("ended", () => repeat ? audio.play() : nextSong());

function format(t){ return !t?"0:00":Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0"); }

// --- SIDEBAR / VIEWS ---
function showView(id){
  document.querySelectorAll("#view-artists,#view-songs,#view-playlist").forEach(v=>v.classList.remove("view-active"));
  const el=document.getElementById(id);
  if(el) el.classList.add("view-active");
}

sidebarLinks.forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    sidebarLinks.forEach(l=>l.classList.remove("active"));
    link.classList.add("active");
    const view = link.dataset.view;
    if(view==="songs") { renderSongs(songs); showView("view-songs"); }
    if(view==="artists") showView("view-artists");
    if(view==="playlist") showView("view-playlist");
    if(view==="home") showView("view-artists"); // Home = Artists
  });
});

// --- RENDER SONGS ---
function renderSongs(list){
  songListEl.innerHTML = "";
  list.forEach(s => {
    const row = document.createElement("div");
    row.className = "song";
    row.textContent = `${s.title} – ${s.artist}`;
    row.onclick = () => loadSong(s.id);
    songListEl.appendChild(row);
  });
}

// --- SEARCH ---
searchInput.oninput = e => {
  const q = e.target.value.toLowerCase();
  renderSongs(songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)));
}

// --- INITIAL ---
renderSongs(songs);
loadSong(0);
showView("view-songs");
