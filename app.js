const songs = [
  { id:0, title:"Boys4Life", artist:"Rolexander", file:"boys-4-life-(remastered).mp3", cover:"cover1.jpg" },
  { id:1, title:"buben-boot", artist:"Rolexander", file:"buben-boot-(remastered-x2).mp3", cover:"cover2.jpg" },
  { id:2, title:"lan-party", artist:"Rolexander", file:"lan-party--(remastered).mp3", cover:"cover3.jpg" },
  { id:3, title:"lars-der-boss", artist:"Rolexander", file:"lars-der-boss.mp3", cover:"cover3.jpg" },
  { id:4, title:"the boys", artist:"Rolexander", file:"the-boys.mp3", cover:"cover3.jpg" },
  { id:5, title:"Level für Level", artist:"Rolexander", file:"level-fuer-level.mp3", cover:"cover3.jpg" },
  { id:6, title:"Luis der Technik-Man", artist:"Rolexander", file:"luis-der-technik-man.mp3", cover:"cover3.jpg" },
  { id:7, title:"Mango Marcel", artist:"Rolexander", file:"mango-marcel.mp3", cover:"cover3.jpg" },
  { id:8, title:"Mein Schacko", artist:"Rolexander", file:"mein-schackoo.mp3", cover:"cover3.jpg" },
  { id:9, title:"Paulo", artist:"Rolexander", file:"paulo.mp3", cover:"cover3.jpg" },
  { id:10, title:"Oh Philip", artist:"Rolexander", file:"oh-philip.mp3", cover:"cover3.jpg" },
  { id:11, title:"Meine Jungs", artist:"Rolexander", file:"meine-jungs.mp3", cover:"cover3.jpg" }
];

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
const playlistEl = document.getElementById("playlistList");

let index = 0;
let shuffle = false;
let repeat = false;
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

// ----------------- AUDIO -----------------
function loadSong(i) {
    index = i;
    const s = songs[i];
    audio.src = s.file;
    titleEl.textContent = s.title;
    artistEl.textContent = s.artist;
    cover.style.backgroundImage = `url(${s.cover})`;
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
    index = shuffle ? Math.floor(Math.random()*songs.length) : (index+1)%songs.length;
    loadSong(index);
    audio.play();
}

function prevSong() {
    index = (index-1+songs.length)%songs.length;
    loadSong(index);
    audio.play();
}

audio.addEventListener("ended", () => { repeat ? audio.play() : nextSong(); });
audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime/audio.duration)*100 || 0;
    currentEl.textContent = format(audio.currentTime);
    durationEl.textContent = format(audio.duration);
});
progress.oninput = () => { audio.currentTime = (progress.value/100)*audio.duration; };

playBtn.onclick = playPause;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;
shuffleBtn.onclick = () => { shuffle = !shuffle; shuffleBtn.classList.toggle("active", shuffle); };
repeatBtn.onclick = () => { repeat = !repeat; repeatBtn.classList.toggle("active", repeat); };

function format(t){ if(!t) return "0:00"; return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0"); }

// ----------------- RENDER -----------------
function renderArtists() {
    artistsEl.innerHTML="";
    const artistNames = [...new Set(songs.map(s=>s.artist))];
    artistNames.forEach(name=>{
        const div=document.createElement("div");
        div.className="artist";
        div.textContent=name;
        div.onclick=()=>{ renderSongs(songs.filter(s=>s.artist===name)); showView("view-songs"); };
        artistsEl.appendChild(div);
    });
}

function renderSongs(list) {
    songListEl.innerHTML="";
    list.forEach(song=>{
        const row=document.createElement("div");
        row.className="song";

        const title=document.createElement("span");
        title.textContent=`${song.title} – ${song.artist}`;
        title.onclick=()=>{ loadSong(song.id); audio.play(); playBtn.textContent="⏸"; };

        const heart=document.createElement("span");
        heart.textContent=favorites.includes(song.id)?"❤️":"🤍";
        heart.onclick=()=>toggleFavorite(song.id, heart);

        row.append(title, heart);
        songListEl.appendChild(row);
    });
}

function renderPlaylist() {
    playlistEl.innerHTML="";
    favorites.forEach(i=>{
        const s=songs[i];
        const row=document.createElement("div");
        row.className="track";

        const name=document.createElement("span");
        name.textContent=s.title;
        name.onclick=()=>{ loadSong(s.id); audio.play(); playBtn.textContent="⏸"; };

        const heart=document.createElement("span");
        heart.textContent="❤️";
        heart.onclick=()=>{
            favorites=favorites.filter(x=>x!==s.id);
            heart.textContent="🤍";
            localStorage.setItem("fav", JSON.stringify(favorites));
            renderPlaylist();
        };

        row.append(name, heart);
        playlistEl.appendChild(row);
    });
}

function toggleFavorite(id, el) {
    if(favorites.includes(id)){ favorites=favorites.filter(x=>x!==id); el.textContent="🤍"; }
    else { favorites.push(id); el.textContent="❤️"; }
    localStorage.setItem("fav", JSON.stringify(favorites));
    renderPlaylist();
}

// ----------------- SEARCH -----------------
searchInput.oninput = e => {
    const q=e.target.value.toLowerCase();
    renderSongs(songs.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q)));
};

// ----------------- SIDEBAR -----------------
const sidebarLinks=document.querySelectorAll(".sidebar a");
const views={
    home:()=>{ renderArtists(); showView("view-artists"); },
    songs:()=>{ renderSongs(songs); showView("view-songs"); },
    playlist:()=>{ renderPlaylist(); showView("view-playlist"); },
    artists:()=>{ renderArtists(); showView("view-artists"); }
};

function showView(id){
    document.querySelectorAll("#view-artists,#view-songs,#view-playlist").forEach(v=>v.classList.remove("view-active"));
    const el=document.getElementById(id); if(el) el.classList.add("view-active");
}

sidebarLinks.forEach(link=>{
    link.addEventListener("click", e=>{
        e.preventDefault();
        sidebarLinks.forEach(l=>l.classList.remove("active"));
        link.classList.add("active");
        const view=link.dataset.view;
        if(views[view]) views[view]();
    });
});

// ----------------- INIT -----------------
loadSong(0);
renderArtists();
renderSongs(songs);
renderPlaylist();
showView("view-artists");
