import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = { /* Your Config */ };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Generate random player ID
const playerID = "player-" + Math.floor(1000 + Math.random() * 9000);

// Join group and redirect
document.getElementById("join-group").addEventListener("click", () => {
    const groupCode = document.getElementById("group-code").value;
    const playerRef = ref(db, `groups/${groupCode}/players/${playerID}`);
    
    set(playerRef, { id: playerID });

    // Redirect to game page
    window.location.href = `game.html?group=${groupCode}&player=${playerID}`;
});
