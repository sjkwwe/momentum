// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow, service, directionsService, directionsRenderer;


async function initMap() {
  
  // The location of SPH
  const position = { lat: 37.5426955 , lng: 126.9517408 };
  const {PlacesService} = await google.maps.importLibrary("places");
  const {Marker} = await google.maps.importLibrary("marker");
  map = new google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: 16,
  });

  // The marker, positioned at SPH
  const marker = new Marker({
    map: map,
    title: "SPH",
    position: position,
  });

  // PlaceService
  let request = {
    location: position,
    radius: "1000",
    type: ["bank"],
  };

  service = new PlacesService(map);
  service.nearbySearch(request, findNearBank);

  // DirrectionsRequest
  
  const selectedModeValue = document.getElementById("mode").value
  let directions = {
    origin: { lat: 37.658358, lng: 126.794419 },
    destination: position,
    travelMode: google.maps.TravelMode[selectedModeValue],
  };

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  await calculateAndDisplayRoute(directionsService, directionsRenderer, directions);
  
    
  

  infoWindow = new google.maps.InfoWindow({
    content: "서울시 마포구 마포대로92 효성해링턴스퀘어 A동 3층"
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker); // Open the InfoWindow at the marker's position
  });

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
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
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

async function findNearBank(results, status) {
  const {PlacesServiceStatus} = await google.maps.importLibrary("places")
  if (status == PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      }
    }
  }
};

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent(place.name || "");
    infoWindow.open(map);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}



async function calculateAndDisplayRoute(directionsService, directionsRenderer, directions) {
  await directionsService.route(directions, (response, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(response);
    } else {
      window.alert("Directions request failed due to " + status);
    }
  });
};

