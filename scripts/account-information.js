var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userCity = userDoc.data().city;
                    var userCountry = userDoc.data().country;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userCountry != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}
document.getElementById('account-edit-btn').addEventListener('click', editUserInfo);

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;
    userCity = document.getElementById('cityInput').value;
    userCountry = document.getElementById('countryInput').value;

    currentUser.update({
        name: userName,
        city: userCity,
        country: userCountry

    })
        .then(() => {
            console.log("Account information successfully updated.");
            alert('Account information successfully updated.');
        })

    document.getElementById('personalInfoFields').disabled = true;

}

document.getElementById('account-save-btn').addEventListener('click', saveUserInfo);


function signOut() {
    // Display a confirmation dialog
    var confirmation = window.confirm("Are you sure you want to sign out?");

    if (confirmation) {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log("User signed out");
            alert('You are now signed out!');
            // Redirect to the main page.
            window.location.href = "main.html";
        }).catch(function (error) {
            // An error happened.
            console.error("Error during sign-out:", error);
        });
    } else {
        // User canceled the sign-out
        console.log("Sign-out canceled");
    }
}

// Example of calling the sign-out function, you can trigger this based on user interaction.
// For example, a button click event.
document.getElementById("sign-out-btn").addEventListener("click", signOut);

