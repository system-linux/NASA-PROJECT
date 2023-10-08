

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

var initialLocation = parseQueryParameters();
var map = L.map('map').setView([initialLocation.lat, initialLocation.lng], initialLocation.zoom);

const mapThings = [];
var firstTime = true

L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20, // Increase maxZoom for better detail
    attribution: 'SeismoScope Map, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map); // Add the tile layer to the map

function addToLast(anchorText){
  var div1 = document.createElement("div");
  div1.className='panel2';
  div1.id = "lastEarthquake02";
  div1.style.backgroundColor = "#D3D3D3";
  var h21 = document.createElement("h2");
  h21.innerHTML = anchorText;
  div1.appendChild(h21);
  document.getElementById("lastEarthquakes").appendChild(div1);
}

function deleteAllToLast(){
	document.querySelectorAll("#lastEarthquake02").forEach(function(element) {
		element.parentNode.removeChild(element);
	});
}

function refreshMap() {
	const apiUrl = `https://api.orhanaydogdu.com.tr/deprem/kandilli/archive?date=${document.getElementById('dateselect').value}`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
            if (firstTime) { 
				deleteAllToLast()
                lastDepremId=data["result"]["0"]["earthquake_id"];
                firstTime=(!firstTime);
                data["result"].forEach(function (earthquake) {
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                        mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                            color: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0.05) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0.06 && earthquake["mag"] / earthquake["depth"] <= 0.1 ) ? '#ff0' : '#f03',
                            fillColor: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0.05) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0.06 && earthquake["mag"] / earthquake["depth"] <= 0.1 ) ? '#ff0' : '#f03',
                            fillOpacity: 0.5,
                            radius: earthquake["mag"]*earthquake["depth"]*70
                        }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Şiddet: ${earthquake["mag"]}ml<br>Derinlik: ${earthquake["depth"]}km<br><br>Kaynak: <b>${earthquake["provider"].toUpperCase()}</b><br>Tarih: ${earthquake["date"]}`));
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                });
                
            } else {
                if (!(data["result"]["0"]["earthquake_id"] === lastDepremId)) {
                    mapThings.forEach(function (thing) {
                        map.removeLayer(thing) 
                    });
                    lastDepremId=data["result"]["0"]["earthquake_id"];
                    data["result"].forEach(function (earthquake) {
                        mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                            color: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0.05) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0.06 && earthquake["mag"] / earthquake["depth"] <= 0.1 ) ? '#ff0' : '#f03',
                            fillColor: (earthquake["mag"] / earthquake["depth"] >= 0 && earthquake["mag"] / earthquake["depth"] <= 0.05) ? '#0f3' : (earthquake["mag"] / earthquake["depth"] >= 0.06 && earthquake["mag"] / earthquake["depth"] <= 0.1 ) ? '#ff0' : '#f03',
                            fillOpacity: 0.5,
                            radius: earthquake["mag"]*earthquake["depth"]*70
                        }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Şiddet: ${earthquake["mag"]}ml<br>Derinlik: ${earthquake["depth"]}km<br><br>Kaynak: <b>${earthquake["provider"].toUpperCase()}</b><br>Tarih: ${earthquake["date"]}`));
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                    });
                }
            }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      }); 
}


var filterInput = document.getElementById("floatingInputValue");
filterInput.addEventListener("input", function() {
var panel2Divs = document.querySelectorAll(".panel2");
panel2Divs.forEach(function(div) {
    var h2Tags = div.querySelectorAll("h2");
    h2Tags.forEach(function(h2) {
    var h2Content = h2.textContent.toLowerCase(); 
    var filterText = filterInput.value.toLowerCase();
    if (h2Content.includes(filterText)) {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
    });
  });
});

$( "#loadingDiv" ).fadeOut(1000, function() {
  // fadeOut complete. Remove the loading div
  $( "#loadingDiv" ).remove(); //makes page more lightweight 
})

document.getElementById("refresh-button").onclick=function(){ refreshMap(); }

document.getElementById("sondeprembutton").onclick = function(event) {
  event.preventDefault();
  refreshMap();
}

var secimElementi = document.getElementById("mapSelect");
secimElementi.addEventListener("change", function() {
  var secilenDeger = secimElementi.value;
  if (secilenDeger === "1") {

  }
  else if (secilenDeger === "2"){

    window.location.href = "/";
  } 
  else if (secilenDeger === "3"){
  
    window.location.href = "/fire";
  } else if (secilenDeger === "4"){
 
    window.location.href = "/eonet";
  } 
});


function openModal(title, content, linkUrl) {
  var modal = document.getElementById('myModal');
  var modalTitle = document.getElementById('modalTitle');
  var modalContent = document.getElementById('modalContent');

  modal.style.display = 'block';
  modalTitle.innerText = title;
  modalContent.innerHTML = content + ' <a href="' + linkUrl + '">Tıkla</a>';
}

function closeModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'none';
}





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