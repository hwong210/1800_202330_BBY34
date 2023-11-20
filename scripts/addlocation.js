function submitWashroom() {
    console.log("inside submit washroom");
    let washroomName = document.getElementById("text-field").value;
    let washroomAddress = document.getElementById("text-field-two").value;
    let washroomStorageBin = document.querySelector('input[name="storage-bin"]:checked').value;
    let washroomWheelchair = document.querySelector('input[name="wheelchair"]:checked').value;
    let washroomWater = document.querySelector('input[name="water"]:checked').value;
    let washroomBikePump = document.querySelector('input[name="bike-pump"]:checked').value;
 
    
    console.log(washroomName, washroomAddress, washroomStorageBin, washroomWheelchair, washroomWater, washroomBikePump);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

      
        db.collection("washrooms").add({
            
            userID: userID,
            name: washroomName,
            address: washroomAddress,
            storagebin: washroomStorageBin,
            wheelchair: washroomWheelchair,
            water: washroomWater,
            bikepump: washroomBikePump,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'addlocation.html';
    }
}
