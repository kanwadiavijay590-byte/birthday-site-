// ---------------- SECTIONS ----------------
const sections = document.querySelectorAll(".section");
let current = 0;

sections.forEach((s, i) => s.classList.toggle("active", i === 0));

// ---------------- AUDIO FILES ----------------

// Welcome page music
const welcomeAudio = new Audio("assets/audio/welcome.mp3");
welcomeAudio.loop = false;
welcomeAudio.volume = 0.35;

// Her World ambient audio
const herWorldAudio = new Audio("assets/audio/her-world.mp3");
herWorldAudio.loop = true;
herWorldAudio.volume = 0.35;

// Wish Letter song
const letterAudio = new Audio("assets/audio/letter-song.mp3");
letterAudio.loop = false;
letterAudio.volume = 0.22;

// Final page Birthday song
const finalAudio = new Audio("assets/audio/final-birthday.mp3");
finalAudio.loop = false;
finalAudio.volume = 0.28;

// ---------------- AUDIO UNLOCK (CRITICAL) ----------------
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  [welcomeAudio, herWorldAudio, letterAudio, finalAudio].forEach(a => {
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
    }).catch(() => {});
  });

  audioUnlocked = true;
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
}

// first user interaction unlocks audio
document.addEventListener("click", unlockAudio);
document.addEventListener("touchstart", unlockAudio);

// ---------------- COUNTDOWN ----------------
const timerEl = document.getElementById("timer");
const targetDate = new Date("2026-02-17T00:00:00").getTime();

const countdown = setInterval(() => {
  const diff = targetDate - Date.now();

  if (diff <= 0) {
    clearInterval(countdown);

    nextSection(); // go to Welcome

    // play welcome audio (now allowed)
    welcomeAudio.play().catch(() => {});

    if (typeof celebrateWelcome === "function") {
      celebrateWelcome();
    }
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  timerEl.textContent = `${d} : ${h} : ${m} : ${s}`;
}, 1000);

// ---------------- NAVIGATION ----------------
function nextSection() {
  if (current < sections.length - 1) {
    sections[current].classList.remove("active");
    current++;
    sections[current].classList.add("active");

    handleAudioForSection();
  }
}

// ---------------- AUDIO CONTROL ----------------
function handleAudioForSection() {
  const activeId = sections[current].id;

  // stop all first
  [welcomeAudio, herWorldAudio, letterAudio, finalAudio].forEach(a => {
    a.pause();
    a.currentTime = 0;
  });

  if (activeId === "world") {
    herWorldAudio.play().catch(() => {});
  }

  if (activeId === "letter") {
    letterAudio.play().catch(() => {});
  }

  if (activeId === "final") {
    finalAudio.play().catch(() => {});
  }
}

// ---------------- CARD FLIP + VIDEO (SOUND) ----------------
function flip(card) {
  const video = card.querySelector("video");
  const allCards = document.querySelectorAll(".card");

  // pause background audio during video
  [welcomeAudio, herWorldAudio, letterAudio, finalAudio].forEach(a => a.pause());

  allCards.forEach(c => {
    if (c !== card) {
      c.classList.remove("flipped");
      const v = c.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    }
  });

  const flipped = card.classList.toggle("flipped");

  if (flipped) {
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
  } else {
    video.pause();
    video.currentTime = 0;
  }
}