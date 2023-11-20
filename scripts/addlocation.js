function submitWashroom() {
    console.log("inside submit washroom");
    let washroomName = document.getElementById("washroomName").value;
    let washroomAddress = document.getElementById("washroomAddress").value;
    let storageBin = document.getElementById('storageBin').checked;
    let wheelchair = document.getElementById('wheelchair').checked;
    let waterFountain = document.getElementById('waterFountain').checked;
    let bikePump = document.getElementById('bikePump').checked;
    let clean = document.getElementById('clean').checked;
    let ventilated = document.getElementById('ventilated').checked;
    let spacious = document.getElementById('spacious').checked;
    let private = document.getElementById('private').checked;
    let accessible = document.getElementById('accessible').checked;
 
    
    console.log(washroomName, washroomAddress, storageBin, wheelchair, waterFountain, bikePump);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

      
        db.collection("washrooms").add({
            
            userID: userID,
            name: washroomName,
            address: washroomAddress,
            storageBin: storageBin,
            wheelchair: wheelchair,
            waterFountain: waterFountain,
            bikePump: bikePump,
            clean: clean,
            ventilated: ventilated,
            spacious: spacious,
            private: private,
            accessible: accessible,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'addlocation.html';
    }
}
