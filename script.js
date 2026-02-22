// =====================
// CORE STATE
// =====================
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let streak = Number(localStorage.getItem("streak")) || 0;
let mainDoneToday = Number(localStorage.getItem("mainDoneToday")) || 0;

// =====================
// DOM ELEMENTS
// =====================
const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");
const levelTitle = document.getElementById("levelTitle");
const streakCount = document.getElementById("streakCount");
const popup = document.getElementById("popup");
const sideQuestText = document.getElementById("sideQuestText");

// =====================
// CONSTANTS
// =====================
const FOUR_HOURS = 4 * 60 * 60 * 1000;

// =====================
// QUEST POOLS
// =====================
const sideQuests = [
  "📖 Read 10 pages",
  "📝 Prepare tomorrow’s to-do list",
  "🧘 Sit quietly, no phone, for 15 minutes",
  "🧹 Clean your desk or workspace",
  "💪 Do 10 push-ups",
  "🤸 Stretch for 5 minutes",
  "🚶 Go for a 10-minute walk",
  "💧 Drink a full bottle of water",
  "✍️ Write 3 things you learned today",
  "🌬️ Step outside / get fresh air for 5 minutes"
];

const sideRewards = [
  "📱 Reels for 15–20 mins",
  "🎧 Music time (playlist)",
  "☕ Tea break",
  "😌 Do nothing guilt-free for 10 mins",
  "🎮 Casual game for 15 mins",
  "📖 Read anything fun (not study)"
];

const mainRewards = [
  "🎬 1 anime episode",
  "🎥 1 movie",
  "🎮 Gaming for 1 hour",
  "📺 2 series episodes",
  "😴 Long nap"
];

const careRewards = [
  "🌿 Relax",
  "🎶 Calm music",
  "😴 Early rest"
];

// =====================
// HELPERS
// =====================
function levelRequirement(lv) {
  return lv * 500;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =====================
// UI UPDATE
// =====================
function updateUI() {
  xpText.textContent = xp;
  levelTitle.textContent = `Level ${level}`;
  streakCount.textContent = streak;

  const currentLevelXP = xp - levelRequirement(level - 1);
  const neededXP = levelRequirement(level) - levelRequirement(level - 1);
  const percent = Math.min((currentLevelXP / neededXP) * 100, 100);
  xpFill.style.width = percent + "%";

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("streak", streak);
  localStorage.setItem("mainDoneToday", mainDoneToday);
}

// =====================
// POPUP
// =====================
function showPopup(text) {
  popup.textContent = text;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2500);
}

// =====================
// LEVEL CHECK
// =====================
function checkLevelUp() {
  while (xp >= levelRequirement(level)) {
    level++;
    showPopup("✨ LEVEL UP!");
  }
}

// =====================
// MAIN QUESTS
// =====================
function completeMain(type) {
  xp += 100;
  mainDoneToday++;

  if (type === "study") {
    showPopup("📘 Study completed! Reward: " + randomItem(mainRewards));
  } else if (type === "coding") {
    showPopup("💻 Coding completed! Reward: " + randomItem(mainRewards));
  }

  checkLevelUp();
  updateUI();
}

// =====================
// SIDE QUESTS (4-HOUR LOCKED)
// =====================
function generateSideQuest() {
  const savedQuest = localStorage.getItem("sideQuestText");
  const savedTime = Number(localStorage.getItem("sideQuestTime"));
  const now = Date.now();

  if (!savedQuest || !savedTime || now - savedTime >= FOUR_HOURS) {
    const newQuest = randomItem(sideQuests);
    sideQuestText.textContent = newQuest;
    localStorage.setItem("sideQuestText", newQuest);
    localStorage.setItem("sideQuestTime", now);
  } else {
    sideQuestText.textContent = savedQuest;
  }
}

function completeSide() {
  xp += 50;
  showPopup("🧩 Side Quest Done! Reward: " + randomItem(sideRewards));

  checkLevelUp();
  updateUI();

  // Force new side quest after completion
  localStorage.removeItem("sideQuestText");
  localStorage.removeItem("sideQuestTime");
  generateSideQuest();
}

// =====================
// SELF CARE
// =====================
function completeCare() {
  xp += 30;
  showPopup("🌸 Self-care completed! Reward: " + randomItem(careRewards));

  checkLevelUp();
  updateUI();
}

// =====================
// DAILY RESET (MIDNIGHT)
// =====================
function resetDaily() {
  if (mainDoneToday >= 2) streak++;
  else streak = 0;

  mainDoneToday = 0;
  generateSideQuest();
  updateUI();
}

// =====================
// FULL RESET
// =====================
function resetSystem() {
  xp = 0;
  level = 1;
  streak = 0;
  mainDoneToday = 0;

  localStorage.clear();
  showPopup("System rebooted.");

  updateUI();
  generateSideQuest();
}

// =====================
// MIDNIGHT WATCHER
// =====================
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    resetDaily();
  }
}, 60000);

// =====================
// INIT
// =====================
generateSideQuest();
updateUI();