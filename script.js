/* ---------- CONFIG ---------- */

const LEVELS = [
  { level: 1, name: "Newbie", xp: 0 },
  { level: 2, name: "Beginner", xp: 500 },
  { level: 3, name: "Builder", xp: 1000 },
  { level: 4, name: "Elite", xp: 1500 },
  { level: 5, name: "Immortal", xp: 2000 }
];

const MAIN_QUESTS = [
  "📚 Study related work",
  "💻 Coding / PWA project",
  "❤️ Spend time with loved ones"
];

const SIDE_QUESTS = [
  "📖 Read 5–10 pages",
  "🚶 Go for a walk",
  "🎵 Listen to music",
  "🧘 Stretch / breathe",
  "📝 Write thoughts"
];

const RESET_QUOTES = [
  "System rebooted.",
  "Fresh run initiated.",
  "No past. Only now."
];

/* ---------- STORAGE ---------- */

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let completedMain =
  JSON.parse(localStorage.getItem("completedMain")) || [];
let lastDate = localStorage.getItem("lastDate");

/* ---------- MIDNIGHT AUTO RESET ---------- */

const today = new Date().toDateString();
if (lastDate !== today) {
  completedMain = [];
  localStorage.setItem("completedMain", JSON.stringify([]));
  localStorage.setItem("lastDate", today);
}

/* ---------- LEVEL LOGIC ---------- */

function getLevelInfo() {
  let current = LEVELS[0];
  for (let lvl of LEVELS) {
    if (xp >= lvl.xp) current = lvl;
  }
  return current;
}

/* ---------- UI ---------- */

function updateUI() {
  const level = getLevelInfo();
  document.getElementById("levelText").innerText =
    `Level ${level.level} – ${level.name}`;
  document.getElementById("xpText").innerText = xp;
  document.getElementById("streakText").innerText = streak;

  const next =
    LEVELS.find(l => l.level === level.level + 1);

  let percent = 100;
  if (next) {
    percent =
      ((xp - level.xp) /
      (next.xp - level.xp)) * 100;
  }

  document.getElementById("xpFill").style.width =
    Math.min(percent, 100) + "%";

  renderMainQuests();
}

/* ---------- MAIN QUESTS ---------- */

function renderMainQuests() {
  const box = document.getElementById("mainQuests");
  box.innerHTML = "";

  MAIN_QUESTS.forEach((q, i) => {
    const p = document.createElement("p");
    p.innerText = q;

    const btn = document.createElement("button");
    btn.innerText =
      completedMain.includes(i) ? "✔ Completed" : "Complete";
    btn.disabled = completedMain.includes(i);
    btn.onclick = () => completeMainQuest(i);

    box.appendChild(p);
    box.appendChild(btn);
  });
}

function completeMainQuest(i) {
  if (completedMain.includes(i)) return;

  completedMain.push(i);
  xp += 30;

  if (completedMain.length === 2) {
    streak++;
    localStorage.setItem("streak", streak);
  }

  localStorage.setItem("xp", xp);
  localStorage.setItem(
    "completedMain",
    JSON.stringify(completedMain)
  );

  checkLevelUp();
  updateUI();
}

/* ---------- SIDE QUEST ---------- */

let sideQuest =
  localStorage.getItem("sideQuest");
let sideQuestTime =
  Number(localStorage.getItem("sideQuestTime")) || 0;

function generateSideQuest() {
  const now = Date.now();
  if (!sideQuest || now - sideQuestTime > 4 * 60 * 60 * 1000) {
    sideQuest =
      SIDE_QUESTS[Math.floor(Math.random() * SIDE_QUESTS.length)];
    sideQuestTime = now;
    localStorage.setItem("sideQuest", sideQuest);
    localStorage.setItem("sideQuestTime", sideQuestTime);
  }
  document.getElementById("sideQuestText").innerText = sideQuest;
}

function completeSideQuest() {
  xp += 10;
  localStorage.setItem("xp", xp);
  localStorage.removeItem("sideQuest");
  generateSideQuest();
  checkLevelUp();
  updateUI();
}

/* ---------- LOVE TIMER ---------- */

let loveStart = null;
let loveInterval = null;
let loveXPToday = 0;

function startLove() {
  if (loveStart) return;
  loveStart = Date.now();
  loveInterval = setInterval(updateLoveTimer, 1000);
}

function stopLove() {
  if (!loveStart) return;

  clearInterval(loveInterval);
  const minutes =
    Math.floor((Date.now() - loveStart) / 60000);

  const earned = Math.min(minutes * 0.5, 60 - loveXPToday);
  loveXPToday += earned;
  xp += earned;

  loveStart = null;
  document.getElementById("loveTimer").innerText = "00:00";

  localStorage.setItem("xp", xp);
  checkLevelUp();
  updateUI();
}

function updateLoveTimer() {
  const diff = Date.now() - loveStart;
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById("loveTimer").innerText =
    `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

/* ---------- LEVEL UP ---------- */

let lastLevel =
  Number(localStorage.getItem("lastLevel")) || 1;

function checkLevelUp() {
  const current = getLevelInfo();
  if (current.level > lastLevel) {
    showLevelUp(current);
    lastLevel = current.level;
    localStorage.setItem("lastLevel", lastLevel);
  }
}

function showLevelUp(level) {
  const overlay = document.getElementById("levelUpOverlay");
  document.getElementById("levelUpText").innerText =
    `LEVEL UP!\nLevel ${level.level} – ${level.name}`;
  overlay.style.display = "flex";
  setTimeout(() => overlay.style.display = "none", 2500);
}

/* ---------- RESET ---------- */

function resetDay() {
  completedMain = [];
  localStorage.setItem("completedMain", JSON.stringify([]));
  document.getElementById("quote").innerText =
    RESET_QUOTES[Math.floor(Math.random() * RESET_QUOTES.length)];
  updateUI();
}

function fullReset() {
  const t = prompt("Type RESET to wipe everything");
  if (t === "RESET") {
    localStorage.clear();
    location.reload();
  }
}

/* ---------- INIT ---------- */

generateSideQuest();
updateUI();