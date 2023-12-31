var fileText = document.querySelector(".fileText");
var fileItem;
var fileName;
var addressInp;
var place;
var lat;
var lng;
var washroomRef;

function generateUniqueFileName() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueFileName = `${timestamp}_${randomString}`;
    return uniqueFileName;
}

function getFile(e) {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
}

function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'));

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();

        // Assuming showAddress sets up lat and lng
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();

        console.log(lat, lng);

        // Create a reference to the washroom document
        washroomRef = db.collection("washrooms").doc();

        // Set the location data in the washroom document
        washroomRef.set({
            lat: lat,
            lng: lng,
        }).then(() => {
            // Continue with the rest of the logic...
            submitWashroom(place, washroomRef);
        }).catch((error) => {
            console.error("Error adding lat and lng to washrooms: ", error);
        });
    });
}

// This function is what allows the "addlocation.html" page to receive the user's input 
// (text, images, etc) and store them in the Washroom collection in Firebase. The image
// in particular is more complex, where the image is first saved into the Firebase storage,
// and the link to that image is what is saved in each Washroom document. 
function submitWashroom() {
    let fileInput = document.getElementById("fileInp");

    if (fileInput.files.length > 0) {
        let fileName = generateUniqueFileName();
        console.log(fileName);

        let fileItem = fileInput.files[0];

        let storageRef = firebase.storage().ref("images/" + fileName);
        let uploadTask = storageRef.put(fileItem);

        uploadTask
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((downloadURL) => {
                console.log("ImageURL: ", downloadURL);

                let name = document.getElementById("washroomName").value;
                let address = document.getElementById("address").value;
                let storageBin = document.getElementById('storageBin').checked;
                let wheelchair = document.getElementById('wheelchair').checked;
                let waterFountain = document.getElementById('waterFountain').checked;
                let bikePump = document.getElementById('bikePump').checked;
                let clean = document.getElementById('clean').checked;
                let ventilated = document.getElementById('ventilated').checked;
                let spacious = document.getElementById('spacious').checked;
                let private = document.getElementById('private').checked;
                let accessible = document.getElementById('accessible').checked;

                console.log(address, storageBin, wheelchair, waterFountain, bikePump);

                var user = firebase.auth().currentUser;
                if (user) {
                    var userID = user.uid;

                    washroomRef.update({
                        name: name,
                        userID: userID,
                        address: address,
                        storageBin: storageBin,
                        wheelchair: wheelchair,
                        waterFountain: waterFountain,
                        bikePump: bikePump,
                        clean: clean,
                        ventilated: ventilated,
                        spacious: spacious,
                        private: private,
                        accessible: accessible,
                        imageURL: downloadURL,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        submitWashroom(place, washroomRef, lat, lng);
                        window.location.href = "thanks.html"; 
                    }).catch((error) => {
                        console.error("Error updating washroom details: ", error);
                    });
                } else {
                    console.log("No user is signed in");
                    window.location.href = 'addlocation.html';
                }
            })
            .catch((error) => {
                console.error("Error getting download URL: ", error);
            });
    }
}
