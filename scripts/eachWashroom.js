// counts reviews
function countReviews(washroomID) {
    return db.collection("reviews")
        .where("washroomID", "==", washroomID)
        .get()
        .then(allReviews => {
            const reviews = allReviews.docs.map(doc => {
                const data = doc.data();
                return {
                    rating: data.rating,

                    clean: data.clean,
                    // ventilated : data.ventilated,
                    // spacious : data.spacious,
                    // private : data.private,
                    // accessible : data.accessible
                };
            });
            const reviewCount = reviews.length;
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

            // Counts the reviews with specific tags
            const cleanCount = reviews.filter(review => review.clean === 1).length;


            return {
                reviewCount: reviewCount,
                totalRating: totalRating,
                cleanCount: cleanCount
            };   
        })
        .catch(error => {
            console.error("Error counting reviews:", error);
            throw error;
        });
}

// displays unique washroom info according to db
function displayWashroomInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    db.collection("washrooms")
        .doc(ID)
        .get()
        .then(doc => {
            var address = doc.data().address;
            var name = doc.data().name;
            var code = doc.data().code;
            var storageBin = doc.data().storageBin;
            var wheelchair = doc.data().wheelchair;
            var waterFountain = doc.data().waterFountain;
            var bikePump = doc.data().bikePump;
            var clean = doc.data().clean;
            var ventilated = doc.data().ventilated;
            var spacious = doc.data().spacious;
            var private = doc.data().private;
            var accessible = doc.data().accessible;
            var imageLink = doc.data().imageURL;

            // Declare count
            var count;
            var ratingAverageFormula;
            var maxRating = 5;

            countReviews(ID)
                .then(result => {
                    count = result;
                    // Log the reviewCount for debugging
                    console.log("Review Count:", count);
            
                    // Formula to calculate the average rating, rounded to the first decimal place.
                    ratingAverageFormula = Math.round(10 * (count.totalRating / (count.reviewCount * 5) * 5)) / 10;

                    // Update the washrooms document with the reviewCount, totalRating, and ratingAverage.
                    return db.collection("washrooms")
                        .doc(ID)
                        .update({
                            reviewCount: count.reviewCount, // Access reviewCount from the result
                            totalRating: count.totalRating, // Access totalRating from the result
                            ratingAverage: ratingAverageFormula,
                            cleanCount: count.cleanCount
                        });
                })
                .then(() => {
                    // UI average rating. Does not show if no reviews.
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

            // UI elements
            document.getElementById("name").innerHTML = name;
            document.getElementById("address").innerHTML = address;
            // document.getElementById("clean").innerHTML = clean ? 'Clean' : '';
            // document.getElementById("ventilated").innerHTML = ventilated ? 'Ventilated' : '';
            // document.getElementById("spacious").innerHTML = spacious ? 'Spacious' : '';
            // document.getElementById("private").innerHTML = private ? 'Private' : '';
            // document.getElementById("accessible").innerHTML = accessible ? 'Accessible' : '';

            // Need to include image later once hason implements
            let imgEvent = document.querySelector(".washroom-img");
            imgEvent.src = imageLink;
            console.log(washroomName);
        })
        .catch(error => {
            console.error("Error fetching washroom info:", error);
        });
}

// Call the displayWashroomInfo function
displayWashroomInfo();

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

function populateReviews() {
    // for review collection holder container
    let washroomCardTemplate = document.getElementById("reviewCardTemplate");
    let washroomCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href);
    // initializes washroomid to docid found in url
    let washroomID = params.searchParams.get("docID");

    let a;
    let b;

    db.collection("reviews")
        // where to get data? under washroomDocID field and the field value must == to the washroomID found in url
        .where("washroomID", "==", washroomID)
        .get() // gets matching data
        .then((allReviews) => {
            // the array of all reviews
            reviews = allReviews.docs;
            console.log(reviews);

            // Sorts from latest to oldest
            reviews.sort((a, b) => {
                return b.data().timestamp - a.data().timestamp;
            });

            reviews.forEach((doc) => {
                // how to get user name not id?
                var userID = doc.data().userID;

                // Fetch user's name from the users collection
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

                        // Use the mapCleanValueToTag function to get the review tag
                        var cleanTag = mapCleanValueToTag(clean);
                        var ventilatedTag = mapVentilatedValueToTag(ventilated);
                        var spaciousTag = mapSpaciousValueToTag(spacious);
                        var privateTag = mapPrivateValueToTag(private);
                        var accessibleTag = mapAccessibleValueToTag(accessible);

                        // cloning washroomcardtemplate
                        let reviewCard = washroomCardTemplate.content.cloneNode(true);
                        reviewCard.querySelector(".review-name").innerHTML = userName;

                        let tagsContainer = reviewCard.querySelector(".review-tags");

                        tagsContainer.innerHTML = cleanTag + ventilatedTag + spaciousTag + privateTag + accessibleTag;
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

