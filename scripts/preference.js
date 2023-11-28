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

document.getElementById("save").addEventListener("click", function () {
    // Check if the user is logged in
    var user = firebase.auth().currentUser;
    if (!user) {
        alert("Please log in to save preferences.");
        return; // Don't proceed further if the user is not logged in
    }

    // Get user preferences from checkboxes, radio buttons, sliders, etc.
    var clean = document.getElementById("clean-outlined").checked;
    var ventilated = document.getElementById("ventilated-outlined").checked;
    var spacious = document.getElementById("spacious-outlined").checked;
    var private = document.getElementById("private-outlined").checked;
    var accessible = document.getElementById("accessible-outlined").checked;
    var distance = document.getElementById("distance").value;
    var storageBin = document.getElementById("storagebin-checkbox").checked;
    var wheelchair = document.getElementById("wheelchair-checkbox").checked;
    var waterFountain = document.getElementById("waterfountain-checkbox").checked;
    var bikePump = document.getElementById("bikepump-checkbox").checked;
    var rating = getSelectedRating();

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
        bikePump: bikePump,
        rating: rating
    };

    // Get the user ID from the authenticated user
    var userID = user.uid;

    // Call a function to store preferences in Firebase with the userID
    storeUserPreferences(userID, userPreferences);

    // Save preferences to local storage
    savePreferencesToLocal(userPreferences);

    // display filtered washrooms
    displayCardsDynamicallyAfterFiltering("washrooms");

});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //console error?
        console.log("User is signed in: ", user.uid);
        displayName(user.uid);
        // Proceed with preferences functionality
        initPreferences(user);
    } else {
        // User is not signed in
        console.log("User is signed out");
    }
});

function getSelectedRating() {
    var stars = document.getElementsByName('rate');

    for (var i = 0; i < stars.length; i++) {
        if (stars[i].checked) {
            return parseInt(stars[i].value);
        }
    }

    return 0;
}

//------------------------------------------------------------------------------
// display new cards in the main page after filtering.
// save button triggers to redirect to the main page and show new result.
//------------------------------------------------------------------------------

function displayCardsDynamicallyAfterFiltering(collection) {
    let cardTemplate = document.getElementById("washroomCardTemplate");
    var storedPreferences = localStorage.getItem('userPreferences');

    if (storedPreferences) {
        var preferences = JSON.parse(storedPreferences);

        // Create a base query with the collection
        var query = db.collection(collection);

        // Amenities. Check if the "storageBin" preference is checked
        if (preferences.storageBin) {
            query = query.where("storageBin", "==", true);
        }

        if (preferences.wheelchair) {
            query = query.where("wheelchair", "==", true);
        }

        if (preferences.waterFountain) {
            query = query.where("waterFountain", "==", true);
        }

        if (preferences.bikePump) {
            query = query.where("bikePump", "==", true);
        }


        // // Testing preferences tags.
        // if (preferences.clean) {
        //     query = query.where("clean", "==", true);
        // }

        // if (preferences.ventilated) {
        //     query = query.where("ventilated", "==", true);
        // }

        // if (preferences.spacious) {
        //     query = query.where("spacious", "==", true);
        // }

        // if (preferences.private) {
        //     query = query.where("private", "==", true);
        // }

        // if (preferences.accessible) {
        //     query = query.where("accessible", "==", true);
        // }

        // Execute the query
        query.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    var title = doc.data().name;
                    var storageBin = doc.data().storageBin;
                    var wheelchair = doc.data().wheelchair;
                    var waterFountain = doc.data().waterFountain;
                    var bikePump = doc.data().bikePump;
                    var image = doc.data().imageURL;
                    var docID = doc.id;

                    // // testing
                    // var clean = doc.data().clean;
                    // var ventilated = doc.data().ventilated;
                    // var spacious = doc.data().spacious;
                    // var private = doc.data().private;
                    // var accessible = doc.data().accessible;

                    let newcard = cardTemplate.content.cloneNode(true);

                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-image').src = image ? image : 'img/logo.jpg';
                    newcard.querySelector('.card-storagebin').innerHTML = storageBin
                        ? 'Storage Bin' : '';
                    newcard.querySelector('.card-wheelchair').innerHTML = wheelchair
                        ? 'Wheelchair Access' : '';
                    newcard.querySelector('.card-waterFountain').innerHTML = waterFountain
                        ? 'Fountain' : '';
                    newcard.querySelector('.card-bikePump').innerHTML = bikePump
                        ? 'Bike Pump' : '';
                    newcard.querySelector('a').href = "eachWashroom.html?docID=" + docID;

                    // //testing
                    // document.getElementById("clean").innerHTML = clean ? 'Clean' : '';
                    // document.getElementById("ventilated").innerHTML = ventilated ? 'Ventilated' : '';
                    // document.getElementById("spacious").innerHTML = spacious ? 'Spacious' : '';
                    // document.getElementById("private").innerHTML = private ? 'Private' : '';
                    // document.getElementById("accessible").innerHTML = accessible ? 'Accessible' : '';

                    newcard.querySelector('i').id = 'save-' + docID;
                    newcard.querySelector('i').onclick = () => saveBookmark(docID);

                    let readMoreButton = newcard.querySelector('.btn-read-more');
                    readMoreButton.setAttribute('onclick', `navigateToEachWashroom('${docID}')`);

                    document.getElementById(collection + "-go-here").appendChild(newcard);
                });
            })
            .catch(error => {
                console.error("Error getting documents: ", error);
            });
    }
}



// Navigates to specific washroom according to the docID.
function navigateToEachWashroom(docID) {
    // Added the docID at the end of the URL to maintain uniqueness.
    let url = `http://127.0.0.1:5500/eachWashroom.html?docID=${docID}`;
    window.location.href = url;
}


function storeUserPreferences(userID, preferences) {
    console.log("Storing user preferences...", userID, preferences); // debugging

    db.collection("preferences").doc(userID).set(preferences)
        .then(function () {
            console.log("User preferences written for ID: ", userID);

            // display new cards in the main page after filtering
            // displayCardsDynamicallyAfterFiltering("washrooms");

            // continue with the next action
            return Promise.resolve();
        })

        .then(function () {
            // window.location.href = 'main.html';
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
        document.getElementById('bikepump-checkbox').checked = preferences.bikePump;
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


function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                var userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("username-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
insertNameFromFirestore();

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the washroom to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(docID) {
    // Manage the backend process to store the washroomDocID in the database, recording which washroom was bookmarked by the user.
    currentUser.update({
        // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
        // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(docID)
    })
        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
            console.log("bookmark has been saved for" + docID);
            var iconID = 'save-' + docID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}