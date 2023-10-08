$('#map').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');

function parseQueryParameters() {
  var params = new URLSearchParams(window.location.search);
  var lat = parseFloat(params.get('lat'));
  var lng = parseFloat(params.get('lng'));
  var zoom = parseInt(params.get('zoom'));

  // Check if lat, lng, and zoom are valid numbers; otherwise, use defaults
  if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) {
      lat = 38.9637; // Default latitude
      lng = 35.2433; // Default longitude
      zoom = 5;      // Default zoom level
  }

  return {
      lat: lat,
      lng: lng,
      zoom: zoom
  };
}

// Initialize the Leaflet map
var initialLocation = parseQueryParameters();
var map = L.map('map').setView([initialLocation.lat, initialLocation.lng], initialLocation.zoom);

const mapThings = [];

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
          const entry = {};
          for (let j = 0; j < headers.length; j++) {
              entry[headers[j].trim()] = values[j].trim();
          }
          data.push(entry);
      }
  }

  return data;
}

function fetchDataAndProcess() {
  const apiUrl = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/3329023b6bef1f9c6bf12a5fe2164fbe/VIIRS_SNPP_NRT/world/1';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      parseCSV(data).forEach(function (fire){
        mapThings.shift(L.circle([fire["latitude"], fire["longitude"]], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: fire["bright_ti4"]
      }).addTo(map));
      $( "#loadingDiv" ).fadeOut(1000, function() {
        // fadeOut complete. Remove the loading div
         //makes page more lightweight 
      })
      $( "#loadingDiv" ).remove();
      })
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Call the function immediately to fetch data
fetchDataAndProcess();



// Set up an interval to fetch data every 1 minute (60,000 milliseconds)
setInterval(fetchDataAndProcess, 60000);


L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20, // Increase maxZoom for better detail
    attribution: 'SeismoScope Map, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map); // Add the tile layer to the map

document.getElementById("inputSonDeprem").style.display="none";
document.getElementById("sondeprembutton").style.display="none";
document.getElementById("input-label").style.display="none";
  
var secimElementi = document.getElementById("mapSelect");
secimElementi.addEventListener("change", function() {
  var secilenDeger = secimElementi.value;
  if (secilenDeger === "map2") {
    document.location.href="/";
  }
  else if (secilenDeger === "map3") {
    document.location.href="/archive";
  } else if (secilenDeger === "map4") {
    document.location.href="/eonet";
  } else {
    document.getElementById("inputSonDeprem").style.display="none";
    document.getElementById("sondeprembutton").style.display="none";
    document.getElementById("input-label").style.display="none";
  }
});

function getShareableLink(lat, lng, zoom) {
  return window.location.href.split('?')[0] + `?lat=${lat}&lng=${lng}&zoom=${zoom}`;
}

// Function to parse query parameters from the URL
function parseQueryParameters() {
  var params = new URLSearchParams(window.location.search);
  return {
      lat: parseFloat(params.get('lat')) || 0,
      lng: parseFloat(params.get('lng')) || 0,
      zoom: parseInt(params.get('zoom')) || 2
  };
}

// Initialize the Leaflet map
var initialLocation = parseQueryParameters();



// Function to handle map click events
function onMapClick(e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  var zoom = map.getZoom();
  var shareLink = getShareableLink(lat, lng, zoom);

  // Copy the shareable link to the clipboard
  var textArea = document.createElement("textarea");
  textArea.value = shareLink;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  // Provide feedback to the user
  alert('Link copied to clipboard!');
}

// Event listener for when the map is clicked
map.on('click', onMapClick);

document.getElementById("profile").onclick= function () {
  window.location.href = "/profile";
};

document.getElementById("chat").onclick= function () {
  window.location.href = "/chat";
};

document.getElementById("blog").onclick= function () {
  window.location.href = "/blog";
};

document.getElementById("settings").onclick= function () {
  window.location.href = "/settings";
};