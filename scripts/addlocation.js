var fileText = document.querySelector(".fileText");
var uploadPercentage = document.querySelector(".uploadPercentage");
var percentVal;
var fileItem;
var fileName;
var addressInp;
var place;
var lat;
var lng;


function generateUniqueFileName() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueFileName = `${timestamp}_${randomString}`;
    return uniqueFileName;
}

function getFile(e){
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
}

function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'));

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        
        // Assuming showAddress sets up lat and lng
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        
        // Add lat and lng to washrooms collection
        db.collection("washrooms").add({
            lat: lat,
            lng: lng,
        }).then((docRef) => {
            // Call submitWashroom after Firestore operation is complete
            submitWashroom(place);
        }).catch((error) => {
            console.error("Error adding lat and lng to washrooms: ", error);
        });
    });
}

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

                // Continue with the rest of the logic...
                console.log("inside submit washroom");
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
                    var currentUser = db.collection("users").doc(user.uid);
                    var userID = user.uid;

                    db.collection("washrooms").add({
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
                        lat: lat,
                        lng: lng,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        window.location.href = "thanks.html"; // Redirect to the thanks page
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





    

    // uploadTask.on("state_changed", (snapshot)=>{
    //     console.log(snapshot);
    //     percentVal = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
    //     console.log(percentVal);
    //     uploadPercentage.innerHTML = percentVal+"%";
    //     progress.style.width=percentVal+"%";
    // },(error)=>{
    //     console.log("Error is ", error);
    // },()=>{
    //     uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
    //         console.log("URL", url);
    //     })
    // })

