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


