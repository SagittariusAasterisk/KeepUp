import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYz7JFIRarFhA6-iRGeyVcZwm1IFJNppE",
  authDomain: "keepup-2cbcc.firebaseapp.com",
  databaseURL: "https://keepup-2cbcc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "keepup-2cbcc",
  storageBucket: "keepup-2cbcc.firebasestorage.app",
  messagingSenderId: "3097195539",
  appId: "1:3097195539:web:3052c10553ef1bee14fbe6",
  measurementId: "G-3G12YZ6PPP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get group & player from URL
const urlParams = new URLSearchParams(window.location.search);
const groupCode = urlParams.get("group");
const playerID = urlParams.get("player");

// Display group and player ID on the page
document.getElementById("group-code").textContent = groupCode;
document.getElementById("player-id").textContent = playerID;

console.log("Group Code:", groupCode);
console.log("Player ID:", playerID);

// Store players globally to use in getRandomPlayer()
let players = {};

// Listen for new players and update UI
const playersRef = ref(db, `groups/${groupCode}/players`);
onValue(playersRef, (snapshot) => {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = "";
    players = {}; // Reset global players object

    snapshot.forEach((child) => {
        const playerData = child.val();
        players[child.key] = playerData.id; // Store in global object

        const li = document.createElement("li");
        li.textContent = playerData.id;
        playerList.appendChild(li);
    });

    console.log("Updated Players:", players);
});

// Start Game Button (only for host)
document.getElementById("start-game").addEventListener("click", () => {
    const firstPlayer = getRandomPlayer();
    if (!firstPlayer) {
        alert("No players available!");
        return;
    }

    update(ref(db, `groups/${groupCode}/gameState`), {
        isStarted: true,
        activePlayer: firstPlayer,
        round: 0,
        totalRounds: 20,
        startTime: Date.now(),
        endTime: null
    });
});

const gameStateRef = ref(db, `groups/${groupCode}/gameState`);

onValue(gameStateRef, (snapshot) => {
    const gameState = snapshot.val();
    if (!gameState || !gameState.isStarted) return;

    // Hide start button after game begins
    document.getElementById("start-game").style.display = "none";

    if (gameState.round < gameState.totalRounds) {
        if (gameState.activePlayer === playerID) {
            // Show red button for active player
            document.getElementById("game-area").innerHTML = `
                <button id="red-button" style="background:red;width:200px;height:200px;">Press Me!</button>
            `;

            document.getElementById("red-button").addEventListener("click", () => {
                // Remove button after press
                document.getElementById("game-area").innerHTML = "";

                // Move button to another player
                update(gameStateRef, {
                    activePlayer: getRandomPlayer(),
                    round: gameState.round + 1
                });
            });
        } else {
            // Blank screen for others
            document.getElementById("game-area").innerHTML = "";
        }
    } else {
        // Game Over, show total time
        document.getElementById("game-area").innerHTML = `
            <h3>Game Over! Total Time: ${(gameState.endTime - gameState.startTime) / 1000} seconds</h3>
            <button id="restart-game">Restart</button>
        `;

        document.getElementById("restart-game").addEventListener("click", () => {
            update(gameStateRef, {
                isStarted: false,
                activePlayer: null,
                round: 0,
                startTime: null,
                endTime: null
            });
        });
    }
});

// Function to pick a random player
function getRandomPlayer() {
    const player
