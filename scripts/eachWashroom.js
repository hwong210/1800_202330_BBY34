//-----------------------------------------------------------------------------
// This function is displayWashroomInfo() loads.
// Counts and calculates the reviews and its tags.
//-----------------------------------------------------------------------------
function countReviews(washroomID) {
    return db.collection("reviews")
        .where("washroomID", "==", washroomID)
        .get()
        .then(allReviews => {
            const reviews = allReviews.docs.map(doc => ({
                rating: doc.data().rating,
                clean: doc.data().clean,
                ventilated: doc.data().ventilated,
                spacious: doc.data().spacious,
                private: doc.data().private,
                accessible: doc.data().accessible,
            }));

            const countWithTag = tag => reviews.filter(review => review[tag] === 1).length;

            return {
                reviewCount: reviews.length,
                totalRating: reviews.reduce((sum, review) => sum + review.rating, 0),
                cleanCount: countWithTag('clean'),
                ventilatedCount: countWithTag('ventilated'),
                spaciousCount: countWithTag('spacious'),
                privateCount: countWithTag('private'),
                accessibleCount: countWithTag('accessible'),
            };
        })
        .catch(error => {
            console.error("Error counting reviews:", error);
            throw error;
        });
}

//-----------------------------------------------------------------------------
// This function is called automatically once the washroom page loads.
// Populates washroom information associated with the washroomID onto the page.
//-----------------------------------------------------------------------------
function displayWashroomInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    db.collection("washrooms")
        .doc(ID)
        .get()
        .then(doc => {
            // We did not have time to display the ameneties (eg. waterFountain, ventilated, etc.) onto the washroom pages.
            var address = doc.data().address;
            var name = doc.data().name;
            var imageLink = doc.data().imageURL;

            // Declares count.
            var count;
            var ratingAverageFormula;
            var maxRating = 5;

            countReviews(ID)
                .then(result => {
                    count = result;

                    // Formula to calculate the average rating, rounded to the first decimal place.
                    ratingAverageFormula = Math.round(10 * (count.totalRating / (count.reviewCount * 5) * 5)) / 10;

                    // Update the washrooms document with the reviewCount, totalRating, and ratingAverage.
                    return db.collection("washrooms")
                        .doc(ID)
                        .update({
                            // Updates specified fields on DB.
                            reviewCount: count.reviewCount,
                            totalRating: count.totalRating,
                            ratingAverage: ratingAverageFormula,

                            cleanCount: count.cleanCount,
                            ventilatedCount: count.ventilatedCount,
                            spaciousCount: count.spaciousCount,
                            privateCount: count.privateCount,
                            accessibleCount: count.accessibleCount
                        });
                })
                .then(() => {
                    if (!(count.reviewCount >= 1)) {
                        document.getElementById("ratingAverage").innerHTML = "No reviews yet.";
                    } else {
                        document.getElementById("ratingAverage").innerHTML = ratingAverageFormula + " / " + maxRating;
                    }
                    console.log("Washroom info updated successfully.");

                })
                .catch(error => {
                    console.error("Error counting reviews or updating washroom collection:", error);
                });

            document.getElementById("name").innerHTML = name;
            document.getElementById("address2").innerHTML = address;

            let imgEvent = document.querySelector(".washroom-img");
            imgEvent.src = imageLink;
            console.log(washroomName);
        })
        .catch(error => {
            console.error("Error fetching washroom info:", error);
        });
}

displayWashroomInfo();


//-----------------------------------------------------------------------------
// The functions below is called by populateReviews() when it loads.
// Displays a tag on the populated review card if the tag value was selected
// (equal to 1).
//-----------------------------------------------------------------------------
function mapCleanValueToTag(cleanValue) {
    return cleanValue === 1 ? '<span class="review-tag-colors" id="clean-button">clean</span>' : '';
}

function mapVentilatedValueToTag(ventilatedValue) {
    return ventilatedValue === 1 ? '<span class="review-tag-colors" id="ventilated-button">ventilated</span>' : '';
}

function mapSpaciousValueToTag(spaciousValue) {
    return spaciousValue === 1 ? '<span class="review-tag-colors" id="spacious-button">spacious</span>' : '';
}

function mapPrivateValueToTag(privateValue) {
    return privateValue === 1 ? '<span class="review-tag-colors" id="private-button">private</span>' : '';
}

function mapAccessibleValueToTag(accessibleValue) {
    return accessibleValue === 1 ? '<span class="review-tag-colors" id="accessible-button">accessible</span>' : '';
}

//-----------------------------------------------------------------------------
// This function is called automatically once the washroom page loads.
// Populates all the reviews associated with the washroomID onto the page.
//-----------------------------------------------------------------------------
function populateReviews() {
    let washroomCardTemplate = document.getElementById("reviewCardTemplate");
    let washroomCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href);
    // Initializes washroomid to docid found in url
    let washroomID = params.searchParams.get("docID");

    db.collection("reviews")
        .where("washroomID", "==", washroomID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);

            // Sorts from latest to oldest
            reviews.sort((a, b) => {
                return b.data().timestamp - a.data().timestamp;
            });

            reviews.forEach((doc) => {
                var userID = doc.data().userID;

                db.collection("users")
                    .doc(userID)
                    .get()
                    .then((userDoc) => {
                        var userName = userDoc.data().name;
                        var rating = doc.data().rating;

                        var clean = doc.data().clean;
                        var ventilated = doc.data().ventilated;
                        var spacious = doc.data().spacious;
                        var private = doc.data().private;
                        var accessible = doc.data().accessible;

                        var reviewText = doc.data().reviewText;
                        var time = doc.data().timestamp.toDate();

                        // Uses the map*ValueToTag function to get the review tag.
                        var cleanTag = mapCleanValueToTag(clean);
                        var ventilatedTag = mapVentilatedValueToTag(ventilated);
                        var spaciousTag = mapSpaciousValueToTag(spacious);
                        var privateTag = mapPrivateValueToTag(private);
                        var accessibleTag = mapAccessibleValueToTag(accessible);

                        let reviewCard = washroomCardTemplate.content.cloneNode(true);
                        reviewCard.querySelector(".review-name").innerHTML = userName;

                        let tagsContainer = reviewCard.querySelector(".review-tags");

                        tagsContainer.innerHTML = cleanTag + ventilatedTag + spaciousTag + privateTag + accessibleTag;
                        reviewCard.querySelector(".review-text").innerHTML = reviewText;
                        reviewCard.querySelector(".review-time").innerHTML = new Date(
                            time
                        ).toLocaleString();

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

//-----------------------------------------------------------------------------
// This function is called when the user clicks on the "Write Review" button.
// Saves the washroom document ID to the local storage and redirects to the
// review page.
//-----------------------------------------------------------------------------
function saveWashroomDocumentIDAndRedirect() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    localStorage.setItem('washroomDocID', ID);
    window.location.href = 'review.html';
    console.log(ID);
}

document.getElementById('writeReviewBtn').addEventListener('click', saveWashroomDocumentIDAndRedirect);

