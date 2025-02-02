import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = { /* Your Config */ };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get group & player from URL
const urlParams = new URLSearchParams(window.location.search);
const groupCode = urlParams.get("group");
const playerID = urlParams.get("player");

// Listen for new players and update UI
const playersRef = ref(db, `groups/${groupCode}/players`);
onValue(playersRef, (snapshot) => {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = "";
    snapshot.forEach((child) => {
        const li = document.createElement("li");
        li.textContent = child.val().id;
        playerList.appendChild(li);
    });
});

// Start Game Button (only for host)
document.getElementById("start-game").addEventListener("click", () => {
    update(ref(db, `groups/${groupCode}/gameState`), {
        isStarted: true,
        activePlayer: null,
        round: 0,
        totalRounds: 20,
        startTime: Date.now(),
        endTime: null
    });
});
