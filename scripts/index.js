let map, infoWindow;

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");

    // Code to get lat and lng from firebase eventually (noncritical, can manually add for final)
    map = new Map(document.getElementById("map"), {
        center: { lat: 49.25144234721972, lng: -123.00352190187303 },
        zoom: 15,
        mapId: '485cac226bd67abf',
    });

    // infoWindow object
    infoWindow = new InfoWindow({
        maxWidth: 400
    });

    db.collection("washrooms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Get the data for each washroom
            const washroomData = doc.data();

            // Create a marker using the template
            const marker = createMarker(washroomData.lat, washroomData.lng, washroomData.address, washroomData);

            // Marker event to retrieve lat/long for googlemap link
            marker.addListener("click", () => {
                const markerPosition = marker.getPosition();
                const googleMapsLink = `https://www.google.com/maps?q=${markerPosition.lat()},${markerPosition.lng()}`;

                const accessibleText = washroomData.accessible ? '<span>Accessible</span>' : '';
                const cleanText = washroomData.clean ? '<span>Clean</span>' : '';
                const ventilatedText = washroomData.ventilated ? '<span>Ventilated</span>' : '';
                const spaciousText = washroomData.spacious ? '<span>Spacious</span>' : '';
                const privateText = washroomData.private ? '<span>Private</span>' : '';
                const amenityText = `${accessibleText} ${cleanText} ${ventilatedText} ${spaciousText} ${privateText}`;

                const content = `
                    <div>
                        <h5>${washroomData.address}</h5>
                        <p style='display: flex; justify-content: space-between; white-space: nowrap;'>${amenityText}</p>
                        <a href="${googleMapsLink}" target="_blank">
                            <img src="${washroomData.imageURL}" alt="Washroom Image" style="max-width: 100%; height: auto;">
                        </a>
                        <a href="${googleMapsLink}" target="_blank">Open in Google Maps</a>
                    </div>`;

                // Set the content and open the InfoWindow
                infoWindow.setContent(content);
                infoWindow.open(map, marker);

                map.panTo(marker.getPosition());
            });
        });
    });

    const locationButton = document.createElement("button");

    locationButton.textContent = "Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);

    locationButton.style.fontSize = "16px"; // Adjust the font size
    locationButton.style.padding = "10px 20px"; // Adjust the padding
    locationButton.style.backgroundColor = "lightBlue";
    locationButton.style.borderColor = "lightBlue";

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Here ya arrrrr.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                },
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

// Function to create a marker
function createMarker(lat, lng, address, washroomData) {
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        // Set the icon with a custom color (red in this example)
        icon: {
            url: './img/logo-bgremoved.png', // Provide the path to your custom icon image
            scaledSize: new google.maps.Size(30, 30),
        },
    });

    return marker;
}

// Trigger the async initMap function
initMap();
