const songs = [
  {
    title: "Boys4Life",
    artist: "Rolexander",
    file: "boys-4-life-(remastered).mp3",
    cover: "cover1.jpg"
  },
  {
    title: "Song Zwei",
    artist: "Artist B",
    file: "song2.mp3",
    cover: "cover2.jpg"
  },
  {
    title: "Song Drei",
    artist: "Artist C",
    file: "song3.mp3",
    cover: "cover3.jpg"
  }
];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

// 🎚 AUDIO CONTEXT & EQUALIZER
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const source = audioCtx.createMediaElementSource(audio);

// Filter
const bassFilter = audioCtx.createBiquadFilter();
bassFilter.type = "lowshelf";
bassFilter.frequency.value = 200;

const midFilter = audioCtx.createBiquadFilter();
midFilter.type = "peaking";
midFilter.frequency.value = 1000;
midFilter.Q.value = 1;

const trebleFilter = audioCtx.createBiquadFilter();
trebleFilter.type = "highshelf";
trebleFilter.frequency.value = 3000;

// Verkabelung
source
  .connect(bassFilter)
  .connect(midFilter)
  .connect(trebleFilter)
  .connect(audioCtx.destination);

// 📊 ANALYSER NODE (Visualizer)
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

trebleFilter.connect(analyser);
analyser.connect(audioCtx.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let index = 0;
let shuffle = false;
let repeat = false;
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

function loadSong(i) {
    index = i;
    const s = songs[i];
    audio.src = s.file;
    titleEl.textContent = s.title;
    artistEl.textContent = s.artist;
    cover.style.backgroundImage = `url(${s.cover})`;
}

function playPause() {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";
    }
}

function nextSong() {
    index = shuffle
        ? Math.floor(Math.random() * songs.length)
        : (index + 1) % songs.length;

    loadSong(index);
    audio.play();
}

function prevSong() {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
    audio.play();
}

audio.addEventListener("ended", () => {
    repeat ? audio.play() : nextSong();
});

audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentEl.textContent = format(audio.currentTime);
    durationEl.textContent = format(audio.duration);
});

progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

shuffleBtn.onclick = () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
};

repeatBtn.onclick = () => {
    repeat = !repeat;
    repeatBtn.classList.toggle("active", repeat);
};

playBtn.onclick = playPause;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;

function format(t) {
    if (!t) return "0:00";
    return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
}

// Playlist + Favoriten
songs.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "track";

    const name = document.createElement("span");
    name.textContent = s.title;
    name.onclick = () => {
        loadSong(i);
        audio.play();
        playBtn.textContent = "⏸";
    };

    const heart = document.createElement("span");
    heart.textContent = favorites.includes(i) ? "❤️" : "🤍";
    heart.onclick = () => {
        if (favorites.includes(i)) {
            favorites = favorites.filter(x => x !== i);
            heart.textContent = "🤍";
        } else {
            favorites.push(i);
            heart.textContent = "❤️";
        }
        localStorage.setItem("fav", JSON.stringify(favorites));
    };

    row.append(name, heart);
    playlistEl.appendChild(row);
  document.getElementById("bass").oninput = e => {
    bassFilter.gain.value = e.target.value;
};

document.getElementById("mid").oninput = e => {
    midFilter.gain.value = e.target.value;
};

document.getElementById("treble").oninput = e => {
    trebleFilter.gain.value = e.target.value;
};

 //  Visualizer-Logik
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

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
        ctx.fillRect(
            x,
            canvas.height - barHeight,
            barWidth,
            barHeight
        );

        x += barWidth + 1;
    }
}
// Wellenform statt Spectrum
//analyser.getByteTimeDomainData(dataArray);

//ctx.beginPath();
///ctx.lineWidth = 2;

//const slice = canvas.width / bufferLength;
//let x = 0;

//for (let i = 0; i < bufferLength; i++) {
//    const v = dataArray[i] / 128.0;
 //   const y = (v * canvas.height) / 2;

 //   i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
 //   x += slice;
//}

//ctx.lineTo(canvas.width, canvas.height / 2);
//ctx.stroke();

drawVisualizer();

  
});

loadSong(0);
