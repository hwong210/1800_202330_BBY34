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

            
            document.getElementById("washroom-name").innerHTML = washroomName;
            // need to include image later once hason implements
            console.log(washroomName);

        } );

}

displayWashroomInfo();