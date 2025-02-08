// Import Firebase modules (Only works if using <script type="module">)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase,ref, set  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYz7JFIRarFhA6-iRGeyVcZwm1IFJNppE",
  authDomain: "keepup-2cbcc.firebaseapp.com",
  databaseURL: "https://keepup-2cbcc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "keepup-2cbcc",
  storageBucket: "keepup-2cbcc.firebasestorage.app",
  messagingSenderId: "3097195539",
  appId: "1:3097195539:web:3052c10553ef1bee14fbe6",
  measurementId: "G-3G12YZ6PPP"
  /*apiKey: "AIzaSyDYz7JFIRarFhA6-iRGeyVcZwm1IFJNppE",
  authDomain: "keepup-2cbcc.firebaseapp.com",
  databaseURL: "https://keepup-2cbcc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "keepup-2cbcc",*/
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



// Generate random 6-letter group code
function generateGroupCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a new group and redirect
document.getElementById("create-group").addEventListener("click", () => {
    const groupCode = generateGroupCode();
    const playerID = "player-" + Math.floor(1000 + Math.random() * 9000);

    // Save the group and creator in Firebase
    set(ref(db, `groups/${groupCode}`), {
        players: { [playerID]: { id: playerID } },
        gameState: {
            isStarted: false,
            activePlayer: null,
            round: 0,
            totalRounds: 20,
            startTime: null,
            endTime: null
        }
    }).then(() => {
        console.log("Group created and player added:", groupCode, playerID);
        // Redirect only after confirmation
        window.location.href = `game.html?group=${groupCode}&player=${playerID}`;
    }).catch((error) => {
        console.error("Error creating group:", error);
    });

// Generate Player ID based on click time
function generatePlayerID() {
    return "player-" + Date.now().toString().slice(-5) + Math.floor(Math.random() * 100);
}


// Join an existing group
document.getElementById("join-group").addEventListener("click", () => {
    const groupCode = document.getElementById("group-code").value.trim();
    const playerID = generatePlayerID(); // Unique Player ID
  
    if (groupCode) {
        set(ref(db, `groups/${groupCode}/players/${playerID}`), { id: playerID });
        window.location.href = `game.html?group=${groupCode}&player=${playerID}`;
    } else {
        alert("Enter a valid group code.");
    }
});









/*
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

*/


