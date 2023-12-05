var washroomDocID = localStorage.getItem("washroomDocID");    //visible to all functions on this page

// Display washroom name on the page.
function getWashroomName(id) {
    db.collection("washrooms")
        .doc(id)
        .get()
        .then((thisWashroom) => {
            var washroomName = thisWashroom.data().name;
            document.getElementById("washroomName").innerHTML = washroomName;
        });
}

getWashroomName(washroomDocID);

// Writes review and stores review values.
function writeReview() {
    // Initializes reviewText to the text box value. 
    let reviewText = document.getElementById("text-box-area").value;

    // Initializes reviewRating to the star value.
    let reviewRating = getStarValue('rate');

    // Initializes values to 0 or 1, depending on if specific buttons are checked.
    let cleanValue = getValueFromCheckbox("clean-button");
    let ventilatedValue = getValueFromCheckbox("ventilated-button");
    let spaciousValue = getValueFromCheckbox("spacious-button");
    let privateValue = getValueFromCheckbox("private-button");
    let accessibleValue = getValueFromCheckbox("accessible-button");

    // Authenticates user.
    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        db.collection("reviews").add({
            washroomID: washroomDocID,
            rating: reviewRating,
            userID: userID,
            reviewText: reviewText,
            clean: cleanValue,
            ventilated: ventilatedValue,
            spacious: spaciousValue,
            private: privateValue,
            accessible: accessibleValue,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "review-submission-successful-copy.html";
        })
            .catch((error) => {
                console.log("Error submitting the review.", error);
            });
    } else {
        console.log("No user is signed in");
        window.location.href = 'review.html';
    }

}

// Function to get the checked star values.
function getStarValue(starId) {
    let stars = document.getElementsByName(starId);
    let starValue = 0;
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].checked) {
            starValue = parseInt(stars[i].value);
        }
    }
    return starValue;
}

// Function to get review tag values.
function getValueFromCheckbox(checkBoxId) {
    let checkbox = document.getElementById(checkBoxId);
    return checkbox.checked ? 1 : 0;
}