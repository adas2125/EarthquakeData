// Map Initialization and Tile Layer source: https://leafletjs.com/examples/quick-start/
// initializing the map and setting the view to the center of the world
var map = L.map('map').setView([51.505, -0.09], 13);

// adding the OpenStreetMap tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    attribution: '© OpenStreetMap'
}).addTo(map);

// initializing a popup that will be displayed when the user clicks on the map
var popup = L.popup();

// Global constant needed to convert between meters and miles
const METERS_PER_MILE = 1609.344;

// adding markers layer to the map where the markers will be displayed
// source: https://leafletjs.com/reference.html#layergroup
var markers = L.layerGroup().addTo(map);

// flag to check if markers are displayed on the map
var markersDisplayed = false;

// flag to check if the map is processing a request
let isProcessing = false;

// source: https://www.npmjs.com/package/leaflet.awesome-markers
var redMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: 'red'
});

var blueMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: 'blue'
});

// slider and slider value source: https://www.w3schools.com/howto/howto_js_rangeslider.asp
const slider = document.getElementById("myRange");
const output = document.getElementById("radius");
const modeSelector = document.getElementById("mode-selector");

// show slider value when slider is moved source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
function handleSliderChange() {
    if (modeSelector.value === "click") {
        // update the slider value in the HTML page
        output.innerHTML = "Value: " + this.value;
    }
}

// removes all markers from the map
function clearLayers() {
    markers.clearLayers();
    markersDisplayed = false;
}

// adds markers to the map that are either blue or red based on the tsunami value
function addMarkers(data, index) {
    let marker;
    // adding blue markers for earthquakes that caused a tsunami and red markers otherwise
    if (tsunami == 1) {
        marker = L.marker([latitude, longitude], {icon: blueMarker}).addTo(markers);
    } else {
        marker = L.marker([latitude, longitude], {icon: redMarker}).addTo(markers);
    }
    // adding a popup to the marker that contains the magnitude, city and country
    marker.bindPopup(`Magnitude: ${data[index][1]}<br>City: ${data[index][2]}<br>Country: ${data[index][3]}`);
}

// function that is called when the user clicks on the map
function onMapClick(e) {
    // handling one click at a time
    if (isProcessing) {
        return;
    }

    isProcessing = true;
    
    // remove markers if already displayed
    if (markersDisplayed) {
        clearLayers();
        // resetting the number of severe earthquakes in the HTML page
        document.getElementById("severe-count").innerHTML = "Severe earthquakes: 0";
    }
    
    // adding a popup to the map where the user clicked
    popup
        .setLatLng(e.latlng)
        .setContent(`You clicked at ${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}`)
        .openOn(map).addTo(markers);
    
    // visualizing the search area on the map source: https://leafletjs.com/examples/quick-start/
    let sliderValue = slider.value;
    var circle = L.circle([e.latlng.lat, e.latlng.lng], {
        color: 'green',
        fillColor: '#f03',
        fillOpacity: 0.25,
        radius: sliderValue*METERS_PER_MILE
    }).addTo(markers);
    markersDisplayed = true;
    
    // sending the request to the server with the latlng and search radius value
    fetch('/coords', {
        method: 'POST',
        body: JSON.stringify({
            latlng: e.latlng,
            sliderValue: sliderValue
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
    .then((data) => {
        // counting the number of severe earthquakes (magnitude >= 7)
        let severe_count = 0;

        // adding markers to the map based on the response from the server
        for (let index = 0; index < data.length; index++) {
            latitude = data[index][4];
            longitude = data[index][5];
            tsunami = data[index][6];

            addMarkers(data, index);
            
            if (data[index][1] >= 7) {
                severe_count++;
            }
        }
        
        // updating the number of severe earthquakes in the HTML page
        document.getElementById("severe-count").innerHTML = `Severe earthquakes: ${severe_count}`;
        isProcessing=false;
    }).catch((error) => {
        // logging the error to the console
        console.log(error)
        isProcessing=false;
    });
}

function clickMode() {
    if (markersDisplayed) {
        clearLayers();
    }
    // preventing redundant event listeners
    map.off('click', onMapClick);

    // Source: https://leafletjs.com/examples/quick-start/
    map.on('click', onMapClick);
}

function handleSubmit(event) {
    if (markersDisplayed) {
        clearLayers();
        document.getElementById("severe-count").innerHTML = "Severe earthquakes: 0";
    }
    // preventing the form from submitting
    event.preventDefault(); 

    // getting the selected continent, month and year from the form
    selectedContinent = document.getElementById("continent").value;
    selectedMonth = document.getElementById("month").value;
    selectedYear = document.getElementById("year").value;

    // sending the request to the server with the selected continent, month and year
    fetch('/query', {
        method: 'POST',
        body: JSON.stringify({ 
            continent: selectedContinent, 
            month: selectedMonth, 
            year: selectedYear 
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        // counting the number of severe earthquakes (magnitude >= 7)
        let severe_count = 0;
        for (let index = 0; index < data.length; index++) {            
            // getting the latitude, longitude and tsunami value from the response
            latitude = data[index][4];
            longitude = data[index][5];
            tsunami = data[index][6];

            addMarkers(data, index);
            
            if (data[index][1] >= 7) {
                severe_count++;
            }
        }
        // checking if there are any markers displayed on the map
        if (data.length > 0) {
            markersDisplayed = true;
        } else {
            markersDisplayed = false;
        }
        // updating the number of severe earthquakes in the HTML page
        document.getElementById("severe-count").innerHTML = `Severe earthquakes: ${severe_count}`;
    });
}

function exploreMode() {
    if (markersDisplayed) {
        clearLayers();
    }
    // getting the form by its id
    var exploreForm = document.getElementById("explore-form");

    // preventing redundant event listeners
    exploreForm.removeEventListener("submit", handleSubmit);

    // Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
    exploreForm.addEventListener("submit", handleSubmit);
}

// change mode when mode selector is changed
// source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
function handleModeChange() {
    const selectedMode = modeSelector.value;

    document.getElementById("severe-count").innerHTML = "Severe earthquakes: 0";

    // show click-mode elements if click mode is selected
    if (selectedMode === "click") {
        output.innerHTML = "Value: " + slider.value;
        document.getElementById("explore-mode-elements").style.display = "none";
        document.getElementById("click-mode-elements").style.display = "block";
        clickMode();
    // show explore-mode elements if explore mode is selected
    } else if (selectedMode === "explore") {
        // Remove the map click listener when in "explore" mode
        map.off('click', onMapClick);
        document.getElementById("click-mode-elements").style.display = "none";
        document.getElementById("explore-mode-elements").style.display = "block";
        exploreMode();
    }
}

clickMode(); // set click mode as default
slider.addEventListener("input", handleSliderChange);
modeSelector.addEventListener("change", handleModeChange);
