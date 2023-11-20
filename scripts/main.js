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
                document.getElementById("name-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

insertNameFromFirestore();

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("washroomCardTemplate"); // Retrieve the HTML element with the ID "washroomCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "washrooms"
        .then(allWashrooms=> {
        
            allWashrooms.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                
                var washroomAddress = doc.data().address; //gets the address field
                
                // below is change from louise, remove if broken. it works
                // gets the document id
                var docID = doc.id;
                
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-address').innerHTML = washroomAddress;
                
                // read more button
                let readMoreButton = newcard.querySelector('.btn-read-more');
                readMoreButton.setAttribute('onclick', `navigateToEachWashroom('${docID}')`);

                //attach to gallery, Example: "washrooms-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

            })
        })
}

displayCardsDynamically("washrooms");  //input param is the name of the collection

// navigates to specific washroom according to docid
function navigateToEachWashroom(docID) {
    // added docid at end of url
    let url = `http://127.0.0.1:5501/eachWashroom.html?docID=${docID}`;
    window.location.href = url;

}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(user) {
    // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
currentUser.update({
                    // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
            // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(user)
    })
            // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
    .then(function () {
        console.log("bookmark has been saved for" + user);
        var iconID = 'save-' + user;
        //console.log(iconID);
                    //this is to change the icon of the hike that was saved to "filled"
        document.getElementById(iconID).innerText = 'bookmark';
    });
}