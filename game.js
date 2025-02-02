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

const gameStateRef = ref(db, `groups/${groupCode}/gameState`);

onValue(gameStateRef, (snapshot) => {
    const gameState = snapshot.val();
    if (!gameState || !gameState.isStarted) return;

    // Hide start button after game begins
    document.getElementById("start-game").style.display = "none";

    // Display game logic
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
    return Object.keys(players)[Math.floor(Math.random() * Object.keys(players).length)];
}

if (gameState.round >= gameState.totalRounds) {
    update(gameStateRef, { endTime: Date.now() });
}

