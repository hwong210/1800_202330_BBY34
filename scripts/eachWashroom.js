// displays unique washroom info according to db
function displayWashroomInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    db.collection("washrooms")
        .doc(ID)
        .get()
        .then(doc => {
            var thisWashroom = doc.data();
            var address = doc.data().address;
            var name = doc.data().name;
            var code = doc.data().code

            
            document.getElementById("name").innerHTML = name;
            document.getElementById("address").innerHTML = address
            // need to include image later once hason implements
            let imgEvent = document.querySelector(".washroom-img")
            imgEvent.src="../img/"+code+".jpg"
            console.log(washroomName);

        } );

}

displayWashroomInfo();

function populateReviews() {
    // for review collection holder container
    let washroomCardTemplate = document.getElementById("reviewCardTemplate");
    let washroomCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href);
    // initializes washroomid to docid found in url
    let washroomID = params.searchParams.get("docID");

    db.collection("reviews")
        // where to get data? under washroomDocID field and the field value must == to the washroomID found in url
        .where("washroomID", "==", washroomID)
        .get() // gets matching data
        .then((allReviews) => {
            // the array of all reviews
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                // how to get user name not id?
                var userID = doc.data().userID;

                // Fetch user's name from the users collection
                db.collection("users")
                    .doc(userID)
                    .get()
                    .then((userDoc) => {
                        var userName = userDoc.data().name;

                        // rest of your code remains unchanged
                        var rating = doc.data().rating;
                        var clean = doc.data().clean;
                        var reviewText = doc.data().reviewText;
                        var time = doc.data().timestamp.toDate();

                        // cloning washroomcardtemplate
                        let reviewCard = washroomCardTemplate.content.cloneNode(true);
                        reviewCard.querySelector(".review-name").innerHTML = userName;
                        reviewCard.querySelector(".review-tags").innerHTML = clean;
                        reviewCard.querySelector(".review-text").innerHTML = reviewText;
                        reviewCard.querySelector(".review-time").innerHTML = new Date(
                            time
                        ).toLocaleString();

                        // IT WORKS bless
                        let starRating = "";
                        for (let i = 0; i < 5; i++) {
                            if (i < rating) {
                                // span gold star
                                starRating += '<span class="star-gold">&#9733;</span>';
                            } else {
                                starRating += '<span class="star-black">&#9733;</span>';
                            }
                        }
                        reviewCard.querySelector(".review-rating").innerHTML = starRating;

                        washroomCardGroup.appendChild(reviewCard);
                    });
            });
        });
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

