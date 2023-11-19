//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAubQD94XEVOJpl--IpCtsrrJhbiyiDtXc",
    authDomain: "comp1800-bby34.firebaseapp.com",
    projectId: "comp1800-bby34",
    storageBucket: "comp1800-bby34.appspot.com",
    messagingSenderId: "337346687619",
    appId: "1:337346687619:web:5d9cdc94c326f0058361b6"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in: ", user.uid);
        displayName(user.uid);
        // Proceed with preferences functionality
        initPreferences(user);
    } else {
        // User is not signed in
        console.log("User is signed out");
    }
});

function initPreferences(user) {
    document.getElementById("save").addEventListener("click", function () {
        // Get user preferences from checkboxes, radio buttons, sliders, etc.
        var clean = document.getElementById("clean-outlined").value;
        var ventilated = document.getElementById("ventilated-outlined").value;
        var spacious = document.getElementById("spacious-outlined").value;
        var private = document.getElementById("private-outlined").value;
        var accessible = document.getElementById("accessible-outlined").value;
        var distance = document.getElementById("distance").value;
        var storageBin = document.getElementById("storagebin-checkbox").checked;
        var wheelchair = document.getElementById("wheelchair-checkbox").checked;
        var waterFountain = document.getElementById("waterfountain-checkbox").checked;
        var airPump = document.getElementById("airpump-checkbox").checked;
        var rating = document.getElementById("rating").value;

        // Create an object with user preferences
        var userPreferences = {
            clean: clean,
            ventilated: ventilated,
            spacious: spacious,
            private: private,
            accessible: accessible,
            distance: distance,
            storageBin: storageBin,
            wheelchair: wheelchair,
            waterFountain: waterFountain,
            airPump: airPump,
            rating: rating
        };

        // Get the user ID from the authenticated user
        var userID = user.uid;

        // Call a function to store preferences in Firebase with the userID
        storeUserPreferences(userID, userPreferences);

        // Save preferences to local storage
        savePreferencesToLocal(userPreferences);
    });

    function storeUserPreferences(userID, preferences) {
        console.log("Storing user preferences...", userID, preferences); // debugging
        // Add a new document with user preferences to the "preferences" collection
        db.collection("preferences").doc(userID).set(preferences)
            .then(function () {
                console.log("User preferences written for ID: ", userID);
                saveAlert();
            })
            .catch(function (error) {
                console.error("Error adding preferences: ", error);
            });
    }

    function savePreferencesToLocal(preferences) {
        console.log("Storing user preferences locally...", preferences);
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }

    function loadPreferencesFromLocal() {
        // Get preferences from local storage
        var storedPreferences = localStorage.getItem('userPreferences');

        // Check if preferences exist in local storage
        if (storedPreferences) {
            // Parse the JSON string to get preferences object
            var preferences = JSON.parse(storedPreferences);

            // Set form values based on stored preferencs
            document.getElementById('clean-outlined').value = preferences.clean;
            document.getElementById('ventilated-outlined').value = preferences.ventilated;
            document.getElementById('spacious-outlined').value = preferences.spacious;
            document.getElementById('private-outlined').value = preferences.private;
            document.getElementById('accessible-outlined').value = preferences.accessible;
            document.getElementById('distance').value = preferences.distance;
            document.getElementById('storagebin-checkbox').checked = preferences.storageBin;
            document.getElementById('wheelchair-checkbox').checked = preferences.wheelchair;
            document.getElementById('waterfountain-checkbox').checked = preferences.waterFountain;
            document.getElementById('airpump-checkbox').checked = preferences.airPump;
            document.getElementById('rating').value = preferences.rating;
        }
    }

    // Call the loadPreferencesFromLocal function when the page is loaded
    window.onload = loadPreferencesFromLocal;

    function getUserPreferences() {
        var userID;
        userID = document.getElementById('nameInput').value;

        // Read the document from the "users" collection based on userID
        db.collection("users").doc(userID).get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Preferences for user ID", userID, " => ", doc.data());
                    // Handle the retrieved preferences as needed
                } else {
                    console.log("No preferences found for user ID", userID);
                }
            })
            .catch(function (error) {
                console.error("Error getting preferences: ", error);
            });
    }

    function saveAlert() {
        alert('Your preferences are saved!');
    }
}

function displayName(name) {
    var currentUser = db.collection("users").doc(name);

    currentUser.get().then((doc) => {
        if (doc.exists) {
            var username = doc.data().name;
            document.getElementById("username-goes-here").innerHTML = username;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document: ", error);
    });
}

// Validate that at least one option is selected
function validatePreferences() {
    var storageBin = document.getElementById("storagebin-checkbox").checked;
    var wheelchair = document.getElementById("wheelchair-checkbox").checked;
    var waterFountain = document.getElementById("waterfountain-checkbox").checked;
    var airPump = document.getElementById("airpump-checkbox").checked;

    // Check if at least one option is selected
    if (!storageBin && !wheelchair && !waterFountain && !airPump) {
        // Display a warning window
        alert('Please select at least one preference option.');
        return false; // Preferences are not valid
    }
    return saveAlert(); // Preferences are valid
}