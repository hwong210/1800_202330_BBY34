var washroomDocID = localStorage.getItem("washroomDocID");    //visible to all functions on this page


// for below, need to wait for dan to finish washroom list and to create initial list

// function getWashroomName(id) {
//     db.collection("washrooms")
//         .doc(id)
//         .get()
//         .then((thisWashroom) => {
//             var washroomName = thisWashroom.data().name;
//             document.getElementById("washroom-name").innerHTML = washroomName;
//                 });
// }

// getWashroomName(washroomDocID);

function writeReview() {
    console.log("inside write review")
    let reviewText = document.getElementById("text-box-area").value;

    // star rating issue below. need help. doesnt save properly
    const stars = document.querySelectorAll('.star');

    let reviewRating = stars.length;

    stars.forEach((star) => {
        if (star.checked) {
            reviewRating++;
        }
    });

    console.log(reviewText, reviewRating);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        db.collection("reviews").add({
            washroomDocID: washroomDocID,
            userID: userID,
            reviewText: reviewText,
            rating: reviewRating,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            // redirects to review submission page
            window.location.href = "review-submission-successful-copy.html";
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'review.html';
    }
}        
