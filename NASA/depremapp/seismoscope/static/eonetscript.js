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

function fetchDataAndProcess() {
  const apiUrl = 'https://eonet.gsfc.nasa.gov/api/v3/events?days=7  &status=open';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      data["events"].forEach(function (sources){
        const titleOfThisSource = `<b>${sources["categories"][0]["title"]}</b>`
        var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        sources["geometry"].forEach(function (thing){
          mapThings.shift(L.circle([thing["coordinates"][1],thing["coordinates"][0]], {
            color: randomColor,
            fillColor: randomColor,
            fillOpacity: 0.5,
            radius: 2000
          }).addTo(map).bindPopup(`${titleOfThisSource}<br>${thing["date"]}<br>SourceID:${sources["id"]}`));
        });
      });
      $( "#loadingDiv" ).fadeOut(1000, function() {
        // fadeOut complete. Remove the loading div
        $( "#loadingDiv" ).remove(); //makes page more lightweight 
      })
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Call the function immediately to fetch data
fetchDataAndProcess();



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
  } else if (secilenDeger === "map3") {
    document.location.href="/archive";
  } else if (secilenDeger === "map4") {
    document.location.href="/fire";
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