function submitWashroom() {
    console.log("inside submit washroom");
    let washroomName = document.getElementById("text-field").value;
    let washroomAddress = document.getElementById("text-field-two").value;
    
    
    
    console.log(washroomName, washroomAddress);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

      
        db.collection("washrooms").add({
            
            userID: userID,
            name: washroomName,
            address: washroomAddress,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'addlocation.html';
    }
}