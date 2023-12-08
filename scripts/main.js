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


function displayCardsDynamically(collection) {
    // Retrieve the HTML element with the ID "washroomCardTemplate" and store it in the cardTemplate variable. 
    let cardTemplate = document.getElementById("washroomCardTemplate"); 
    // The collection called "washrooms" is being accessed here for cards.
    // "orderBy" orders the cards based on each washroom documents "ratingAverage" field in descending order.
    // The cards are limited to 6 by using .limit, instead of them showing all at once. 
    db.collection(collection).orderBy("ratingAverage", "desc").limit(6).get()   
        .then(allWashrooms => {


            allWashrooms.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key  
                var code = doc.data().code;
                var storageBin = doc.data().storageBin;
                var wheelchair = doc.data().wheelchair;
                var waterFountain = doc.data().waterFountain;
                var bikePump = doc.data().bikePump;
                var image = doc.data().imageURL;

                
                // gets the document id
                var docID = doc.id;

                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-image').src = image ? image : 'img/logo.jpg';
                newcard.querySelector('.card-storagebin').innerHTML = storageBin
                    ? 'Storage Bin' : ''
                newcard.querySelector('.card-wheelchair').innerHTML = wheelchair
                    ? 'Wheelchair Access' : ''
                newcard.querySelector('.card-waterFountain').innerHTML = waterFountain
                    ? 'Fountain' : ''
                newcard.querySelector('.card-bikePump').innerHTML = bikePump
                    ? 'Bike Pump' : ''
                newcard.querySelector('a').href = "eachWashroom.html?docID=" + docID;

                // Bookmarks, attach an onclick, callback function
                newcard.querySelector('i').id = 'save-' + docID; // Guaranteed to be unique
                newcard.querySelector('i').onclick = () => saveBookmark(docID);

                // not working. it makes only one card showing. hyebin
                // currentUser.get().then(userDoc => {
                //     //get the user name
                //     var bookmarks = userDoc.data().bookmarks;
                //     if (bookmarks.includes(docID)) {
                //         document.getElementById('save-' + docID).innerText = 'bookmark';
                //     }

                // Set the 'onclick' attribute for the 'readMoreButton' to navigate to each washroom's details page
                let readMoreButton = newcard.querySelector('.btn-read-more');
                readMoreButton.setAttribute('onclick', `navigateToEachWashroom('${docID}')`);

                //attach to gallery, Example: "washrooms-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

            })
        })
}
displayCardsDynamically("washrooms");  //input param is the name of the collection

// Navigates to specific washroom according to the docID.
function navigateToEachWashroom(docID) {
    // Added the docID at the end of the URL to maintain uniqueness.
    let url = `http://127.0.0.1:5500/eachWashroom.html?docID=${docID}`;
    window.location.href = url;
}


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
