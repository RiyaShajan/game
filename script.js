let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let streak = Number(localStorage.getItem("streak")) || 0;
let mainDoneToday = Number(localStorage.getItem("mainDoneToday")) || 0;

const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");
const levelTitle = document.getElementById("levelTitle");
const streakCount = document.getElementById("streakCount");
const popup = document.getElementById("popup");
const sideQuestText = document.getElementById("sideQuestText");

const sideQuests = [
  "Read 5–10 pages",
  "Go for a walk",
  "Listen to music",
  "Clean your desk",
  "Stretch for 5 minutes"
];

const sideRewards = [
  "🎁 Reward: 20 mins reels",
  "🎁 Reward: Music time",
  "🎁 Reward: Chill break"
];

const mainRewards = [
  "🏆 Reward: 1 Anime Episode",
  "🏆 Reward: Watch a Movie",
  "🏆 Reward: 1 Hour Gaming"
];

const careRewards = [
  "🌿 Reward: Relax",
  "🌿 Reward: Calm music",
  "🌿 Reward: Early rest"
];

function levelRequirement(lv) {
  return lv * 500;
}

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

function showPopup(text) {
  popup.textContent = text;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2500);
}

function checkLevelUp() {
  if (xp >= levelRequirement(level)) {
    level++;
    showPopup("✨ LEVEL UP!");
  }
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function completeMain() {
  xp += 200;
  mainDoneToday++;
  showPopup(randomItem(mainRewards));
  checkLevelUp();
  updateUI();
}

function completeSide() {
  xp += 50;
  showPopup(randomItem(sideRewards));
  checkLevelUp();
  updateUI();
  generateSideQuest();
}

function completeCare() {
  xp += 20;
  showPopup(randomItem(careRewards));
  checkLevelUp();
  updateUI();
}

function generateSideQuest() {
  sideQuestText.textContent = randomItem(sideQuests);
}

function resetDaily() {
  if (mainDoneToday >= 2) streak++;
  else streak = 0;

  mainDoneToday = 0;
  generateSideQuest();
  updateUI();
}

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

// Midnight reset
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    resetDaily();
  }
}, 60000);

// Initial load
generateSideQuest();
updateUI();
