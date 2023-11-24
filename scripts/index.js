let map, infoWindow;

// initMap is now async
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: { lat: 49.248499, lng: -123.001375 },
        zoom: 15,
        mapId: '485cac226bd67abf',
    });

    //Marker object
    const marker = new google.maps.Marker({
        position: { lat: 49.22557826237964, lng: -123.01363150112999 }, 
        map,
    });

    //infoWindo object
    infoWindow = new InfoWindow();
    
    //Marker event to retrieve lat/long for googlemap link
    marker.addListener("click", () => {

        const markerPosition = marker.getPosition();
        const googleMapsLink = `https://www.google.com/maps?q=${markerPosition.lat()},${markerPosition.lng()}`;
        const content = `
        <div>
            <h3>Location Information</h3>
            <p>Latitude: ${markerPosition.lat()}</p>
            <p>Longitude: ${markerPosition.lng()}</p>
            <a href="${googleMapsLink}" target="_blank">Open in Google Maps</a>
        </div>`;
      
          // Set the content and open the InfoWindow
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
    });
    
  

  const locationButton = document.createElement("button");

  locationButton.textContent = "Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
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

// Trigger the async initMap function
initMap();