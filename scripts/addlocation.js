function submitWashroom() {
    console.log("inside submit washroom");
    let washroomName = document.getElementById("text-field").value;
    let washroomAddress = document.getElementById("text-field-two").value;
 
    const stars = document.querySelectorAll('.star');
		
    
    let hygieneLevel = 0;
		
    
    stars.forEach((star) => {
				
        if (star.textContent === 'star') {
						
            hygieneLevel++;
        }
    });
    
    let safetyLevel = 0;
		
    
    stars.forEach((star) => {
				
        if (star.textContent === 'star') {
						
            safetyLevel++;
        }
    });
    
    
    console.log(washroomName, washroomAddress, safetyLevel, hygieneLevel);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

      
        db.collection("washrooms").add({
            
            userID: userID,
            name: washroomName,
            address: washroomAddress,
            safety: safetyLevel,
            hygiene: hygieneLevel,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'addlocation.html';
    }
}

const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        }
    });
});
