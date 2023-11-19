var washroomDocID = localStorage.getItem("washroomDocID");    //visible to all functions on this page

// works fine
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

function writeReview() {
    console.log("inside write review")
    let reviewText = document.getElementById("text-box-area").value;

    // star rating issue below. need help. doesnt save properly
    const stars = document.getElementsByName('rate');

    //working fine
    let reviewRating = 0;
    
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].checked) {
          reviewRating = parseInt(stars[i].value);
          break;
        }
      }    

    let cleanTag = document.getElementById("clean-button");
    // if cleantag checked then cleanvalue = 1, otherwise 0
    let cleanValue = 0;
    // Update cleanValue only if the checkbox is checked
    if (cleanTag.checked) {
        cleanValue = 1;
    }
  
    let ventilatedTag = document.getElementById("ventilated-button");
    let ventilatedValue = 0;
    if (ventilatedTag.checked) {
        ventilatedValue = 1;
    }

    let spaciousTag = document.getElementById("spacious-button");
    let spaciousValue = 0;
    if (spaciousTag.checked) {
        spaciousValue = 1;
    }

    let privateTag = document.getElementById("private-button");
    let privateValue = 0;
    if (privateTag.checked) {
        privateValue = 1;
    }

    // may remove if included in addwashroom section
    let accessibleTag = document.getElementById("accessible-button");
    let accessibleValue = 0;
    if (accessibleTag.checked) {
        accessibleValue = 1;
    }

    console.log(reviewText, reviewRating);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        db.collection("reviews").add({
            washroomDocID: washroomDocID,
            rating: reviewRating,
            userID: userID,
            reviewText: reviewText,
            clean: cleanValue,
            ventilated: ventilatedValue,
            spacious: spaciousValue,
            private: privateValue,
            // may remove if included in addwashroom section
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
