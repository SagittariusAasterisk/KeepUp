// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const createGroupBtn = document.getElementById("create-group");
const joinGroupBtn = document.getElementById("join-group");
const buzzBtn = document.getElementById("buzz");
const groupCodeInput = document.getElementById("group-code");
const groupInfo = document.getElementById("group-info");
const result = document.getElementById("result");
const setupDiv = document.getElementById("setup");
const gameDiv = document.getElementById("game");

let groupCode = null;

// Create Group
createGroupBtn.addEventListener("click", () => {
  groupCode = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit code
  db.ref("groups/" + groupCode).set({ buzzed: null });
  alert("Group created! Code: " + groupCode);
  startGame(groupCode);
});

// Join Group
joinGroupBtn.addEventListener("click", () => {
  groupCode = groupCodeInput.value;
  if (groupCode) {
    db.ref("groups/" + groupCode).get().then((snapshot) => {
      if (snapshot.exists()) {
        startGame(groupCode);
      } else {
        alert("Group not found!");
      }
    });
  } else {
    alert("Enter a group code!");
  }
});

// Start Game
function startGame(code) {
  setupDiv.style.display = "none";
  gameDiv.style.display = "block";
  groupInfo.innerText = "Group Code: " + code;
  buzzBtn.style.display = "inline-block";

  // Listen for winner
  db.ref("groups/" + code + "/buzzed").on("value", (snapshot) => {
    if (snapshot.exists() && snapshot.val() !== null) {
      result.innerText = "Winner: " + snapshot.val();
      buzzBtn.disabled = true;
    }
  });
}

// Buzz Button
buzzBtn.addEventListener("click", () => {
  db.ref("groups/" + groupCode + "/buzzed").get().then((snapshot) => {
    if (!snapshot.exists() || snapshot.val() === null) {
      db.ref("groups/" + groupCode).update({ buzzed: "Player_" + Math.floor(Math.random() * 1000) });
    }
  });
});
