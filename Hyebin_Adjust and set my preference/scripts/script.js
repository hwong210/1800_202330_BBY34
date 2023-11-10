//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAubQD94XEVOJpl--IpCtsrrJhbiyiDtXc",
    authDomain: "comp1800-bby34.firebaseapp.com",
    projectId: "comp1800-bby34",
    storageBucket: "comp1800-bby34.appspot.com",
    messagingSenderId: "337346687619",
    appId: "1:337346687619:web:5d9cdc94c326f0058361b6",
    measurementId: "G-G9TZPNE0Y5"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("search").addEventListener("click", function () {
    // Get user preferences from checkboxes, radio buttons, sliders, etc.
    var bestMatch = document.getElementById("bestmatch-checkbox").checked;
    var mostPopular = document.getElementById("mostpopular-checkbox").checked;
    var closest = document.getElementById("closest-checkbox").checked;
    var distance = document.getElementById("myRange").value;
    var hygieneRating = document.querySelector('input[name="rate"]:checked').value;
    var storageBin = document.getElementById("storagebin-checkbox").checked;
    var wheelchair = document.getElementById("wheelchair-checkbox").checked;
    var waterFountain = document.getElementById("waterfountain-checkbox").checked;
    var airPump = document.getElementById("airpump-checkbox").checked;

    // Create an object with user preferences
    var userPreferences = {
        bestMatch: bestMatch,
        mostPopular: mostPopular,
        closest: closest,
        distance: distance,
        hygieneRating: hygieneRating,
        storageBin: storageBin,
        wheelchair: wheelchair,
        waterFountain: waterFountain,
        airPump: airPump
    };

    // Call a function to store preferences in Firebase
    storeUserPreferences(userPreferences);
});

function storeUserPreferences(preferences) {
    // Add a new document with user preferences to the "preferences" collection
    db.collection("preferences").add(preferences)
        .then(function (docRef) {
            console.log("Preferences document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding preferences: ", error);
        });
}

function getUserPreferences() {
    // Read all documents from the "preferences" collection
    db.collection("preferences").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            // Handle the retrieved preferences as needed
        });
    });
}

// Select all input elements with the class name "rates" and store them in the "stars" variable
const stars = document.querySelectorAll('.rate input');

// Function to update star icons based on the selected rating
function updateStars(index) {
    stars.forEach((star, i) => {
        const label = document.querySelector(`.rate label[for="star${i + 1}"]`);
        if (i <= index) {
            label.innerHTML = 'star';
        } else {
            label.innerHTML = 'star_border';
        }
    });
}

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Update star icons based on the clicked star
        updateStars(index);
    });
});

function saveAlert() {
    alert('Your preferences are saved!');
}
