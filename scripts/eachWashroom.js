// displays unique washroom info according to db
function displayWashroomInfo() {
    console.log("Test");
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);

    db.collection("washrooms")
        .doc(ID)
        .get()
        .then(doc => {
            thisWashroom = doc.data();
            washroomAddress = thisWashroom.address;
            washroomName = doc.data().name;

            
            document.getElementById("washroomName").innerHTML = washroomName;
            // need to include image later once hason implements
            console.log(washroomName);

        } );

}

displayWashroomInfo();

function populateReviews() {
    console.log("test");
    // for review collection holder container
    let washroomCardTemplate = document.getElementById("reviewCardTemplate");
    let washroomCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href);
    // initializes washroomid to docid found in url
    let washroomID = params.searchParams.get("docID");

    db.collection("reviews")
        // where to get data? under washroomDocID field and the field value must == to the washroomID found in url
        .where("washroomDocID", "==", washroomID)
        .get() // gets matching data
        .then((allReviews) => {
            // the array of all reviews
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                // how to get user name not id?
                var userName = doc.data().userID;
                // how to make rating represent star value?
                var rating = doc.data().rating;
                var reviewText = doc.data().reviewText;
                var time = doc.data().timestamp.toDate();
                // how to make show tag, not int value. if clean = 1 then show tag?
                var clean = doc.data().clean;

            // cloning washroomcardtemplate
            let reviewCard = washroomCardTemplate.cloneNode(true);
            })
        })
    
}

populateReviews();

function saveWashroomDocumentIDAndRedirect() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    localStorage.setItem('washroomDocID', ID);
    window.location.href = 'review.html';
    console.log(ID);
}

document.getElementById('writeReviewBtn').addEventListener('click', saveWashroomDocumentIDAndRedirect);

