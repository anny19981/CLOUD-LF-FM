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
for(let i=0;i<=20;i++){
  songs.push({id:i,title:`Song ${i}`,artist:`Artist ${i%5}`,file:`song${i}.mp3`,cover:`cover${i%5}.jpg`});
}
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

let index = 0;
let shuffle = false;
let repeat = false;
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

// --- Song laden ---
function loadSong(i){
  currentIndex=i;
  const s=songs[i];
  audio.src=s.file;
  titleEl.textContent=s.title;
  artistEl.textContent=s.artist;
  cover.style.backgroundImage=`url(${s.cover})`;
  audio.play();
  document.getElementById("play").textContent="⏸";
}

// --- PLAY / PAUSE ---
function playPause() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

// --- NEXT / PREV SONG ---
function nextSong() {
  index = shuffle ? Math.floor(Math.random() * songs.length) : (index + 1) % songs.length;
  loadSong(index);
  audio.play();
}

function prevSong() {
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  audio.play();
}

// --- UPDATE PROGRESS ---
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
});

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

audio.addEventListener("ended", () => repeat ? audio.play() : nextSong());

// --- SHUFFLE / REPEAT ---
shuffleBtn.onclick = () => { shuffle = !shuffle; shuffleBtn.classList.toggle("active", shuffle); };
repeatBtn.onclick = () => { repeat = !repeat; repeatBtn.classList.toggle("active", repeat); };
playBtn.onclick = playPause;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;

// --- FORMAT TIME ---
function format(t) { return !t ? "0:00" : Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0"); }

// --- Songs rendern ---
function renderSongs(list){
  songListEl.innerHTML="";
  list.forEach(song=>{
    const row=document.createElement("div");
    row.className="song";
    const title=document.createElement("span");
    title.textContent=`${song.title} – ${song.artist}`;
    title.onclick=()=>loadSong(song.id);
    row.appendChild(title);
    songListEl.appendChild(row);
  });
}

// --- TOGGLE FAVORITE ---
function toggleFavorite(id, el) {
  if (favorites.includes(id)) favorites = favorites.filter(x => x !== id);
  else favorites.push(id);
  localStorage.setItem("fav", JSON.stringify(favorites));
  el.textContent = favorites.includes(id) ? "❤️" : "🤍";
}

// --- RENDER ARTISTS ---
function renderArtists() {
  artistsEl.innerHTML = "";
  const artistNames = [...new Set(songs.map(s => s.artist))];
  artistNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "artist";
    div.textContent = name;
    div.onclick = () => { renderSongs(songs.filter(s => s.artist === name)); showView("view-songs"); };
    artistsEl.appendChild(div);
  });
}

// --- SIDEBAR / VIEWS ---
function showView(id) {
  document.querySelectorAll("#view-artists, #view-songs, #view-playlist").forEach(v => v.classList.remove("view-active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("view-active");
}

// --- Sidebar Klicks ---
sidebarLinks.forEach(link=>{
  link.addEventListener("click",e=>{
    e.preventDefault();
    sidebarLinks.forEach(l=>l.classList.remove("active"));
    link.classList.add("active");
    const view=link.dataset.view;
    document.querySelectorAll("#view-artists,#view-songs,#view-playlist")
      .forEach(v=>{
        v.classList.remove("view-active");
        if(view==="songs" && v.id==="view-songs") v.classList.add("view-active");
        if(view==="artists" && v.id==="view-artists") v.classList.add("view-active");
        if(view==="playlist" && v.id==="view-playlist") v.classList.add("view-active");
      });
    if(view==="songs") renderSongs(songs);
  });
});

// --- Audio Controls ---
const playBtn=document.getElementById("play");
playBtn.onclick=()=>{ audio.paused?audio.play():audio.pause(); playBtn.textContent=audio.paused?"▶️":"⏸"; };

document.getElementById("next").onclick=()=>{ currentIndex=(currentIndex+1)%songs.length; loadSong(currentIndex); };
document.getElementById("prev").onclick=()=>{ currentIndex=(currentIndex-1+songs.length)%songs.length; loadSong(currentIndex); };

// --- Initial load ---

// --- LIVE SEARCH ---
searchInput.oninput = e => {
  const q = e.target.value.toLowerCase();
  renderSongs(songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)));
};

// --- INIT ---
renderSongs(songs);
loadSong(0);
renderArtists();
