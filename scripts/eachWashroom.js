function displayWashroomInfo() {
    console.log("Test");
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);

    db.collection("washrooms")
        .doc(ID)
        .get()
        .then(dock => {
            thisWashroom = doc.data();
            washroomAddress = thisWashroom.address;
            washroomName = doc.data().name.innerHTML = title;

            // newcard.querySelector('.card-title').innerHTML = title;
            // newcard.querySelector('.card-address').innerHTML = washroomAddress;
        })

}

displayWashroomInfo();