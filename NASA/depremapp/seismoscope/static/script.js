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
const mapThings2 = [];
var lastDeprem = 80;
var lastDepremId = "";
var firstTime = true;

function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

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



  
function fetchDataAndProcess() {
    const apiUrl = `https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=${lastDeprem}`;
  
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
                data["result"].forEach(function (earthquake) {
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                        mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                            color: (earthquake["mag"] >= 0 && earthquake["mag"] <= 3) ? '#0f3' : (earthquake["mag"] >= 7 && earthquake["mag"] <= 12 ) ? '#f03' : '#ff0',
                            fillColor: (earthquake["mag"] >= 0 && earthquake["mag"] <= 3) ? '#0f3' : (earthquake["mag"] >= 7 && earthquake["mag"] <= 12 ) ? '#f03' : '#ff0',
                            fillOpacity: 0.5,
                            radius: earthquake["mag"]*earthquake["depth"]*70
                        }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Mag: ${earthquake["mag"]}ml<br>Depth: ${earthquake["depth"]}km<br><br>Source: <b>${earthquake["provider"].toUpperCase()}</b><br>Tarih: ${earthquake["date"]}`));
                        addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                });
            } else {
                    mapThings.forEach(function (thing) {
                        map.removeLayer(thing) 
                    });
                    lastDepremId=data["result"]["0"]["earthquake_id"];
                    data["result"].forEach(function (earthquake) {
                        mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                            color: (earthquake["mag"] >= 0 && earthquake["mag"] <= 3) ? '#0f3' : (earthquake["mag"] >= 7 && earthquake["mag"] <= 12 ) ? '#f03' : '#ff0',
                            fillColor: (earthquake["mag"] >= 0 && earthquake["mag"] <= 3) ? '#0f3' : (earthquake["mag"] >= 7 && earthquake["mag"] <= 12 ) ? '#f03' : '#ff0',
                            fillOpacity: 0.5,
                            radius: earthquake["mag"]*earthquake["depth"]*70
                        }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Mag: ${earthquake["mag"]}ml<br>Depth: ${earthquake["depth"]}km<br><br>Source: <b>${earthquake["provider"].toUpperCase()}</b><br>Tarih: ${earthquake["date"]}`));
                    });

            }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

    const date = new Date();
    const apiUrl2 = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    fetch(apiUrl2)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
            if (firstTime) { 
                firstTime=(!firstTime);
                data["features"].forEach(function (feature) {
                        addToLast(`<b>${feature["properties"]["title"]}</b> | ${feature["properties"]["mag"]}ml`)
                        mapThings2.push(L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], {
                          color: (feature["properties"]["mag"] >= 0 && feature["properties"]["mag"] <= 3) ? '#0f3' : (feature["properties"]["mag"] >= 7 && feature["properties"]["mag"] <= 12 ) ? '#f03' : '#ff0',
                          fillColor: (feature["properties"]["mag"] >= 0 && feature["properties"]["mag"] <= 3) ? '#0f3' : (feature["properties"]["mag"] >= 7 && feature["properties"]["mag"] <= 12 ) ? '#f03' : '#ff0',
                          fillOpacity: 0.5,
                          radius: feature["geometry"]["coordinates"][2]*200
                        }).addTo(map).bindPopup(`<b>${feature["properties"]["title"]}</b><br>Mag: ${feature["properties"]["mag"]}ml<br><br>Source: <b>USGS</b>`));
                        //addToLast(`<b>${earthquake["title"]}</b> | ${earthquake["mag"]}`)
                });
            }
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
  
  // Set up an interval to fetch data every 1 minute (60,000 milliseconds)
setInterval(fetchDataAndProcess, 60000);

function refreshMap() {
	deleteAllToLast()
    const apiUrl = `https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=${lastDeprem}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        mapThings.forEach(function (thing) {
            map.removeLayer(thing) 
        });
        lastDepremId=data["result"]["0"]["earthquake_id"];
        data["result"].forEach(function (earthquake) {
            mapThings.push(L.circle([earthquake["geojson"]["coordinates"]["1"], earthquake["geojson"]["coordinates"]["0"]], {
                color: (earthquake["mag"] >= 0 && earthquake["mag"] <= 3) ? '#0f3' : (earthquake["mag"] >= 7 && earthquake["mag"] <= 12 ) ? '#f03' : '#ff0',
                fillColor: (earthquake["mag"] >= 0 && earthquake["mag"] <= 3) ? '#0f3' : (earthquake["mag"] >= 7 && earthquake["mag"] <= 12 ) ? '#f03' : '#ff0',
                fillOpacity: 0.5, 
                radius: earthquake["mag"]*earthquake["depth"]*70
            }).addTo(map).bindPopup(`<b>${earthquake["title"]}</b><br>Şiddet: ${earthquake["mag"]}ml<br>Derinlik: ${earthquake["depth"]}km<br><br>Kaynak: <b>${earthquake["provider"].toUpperCase()}</b><br>Tarih: ${earthquake["date"]}`));
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}

$('form').keypress(function(event) { 
  return event.keyCode != 13;
});

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

document.getElementById("refresh-button").onclick=function(){ refreshMap(); }

document.getElementById("sondeprembutton").onclick=function(){
    if (document.getElementById("inputPassword2").value <1){
      alert("Minimum değer 1 olabilir!");
      document.getElementById("inputPassword2").value = null;
      return false;
    }
    lastDeprem = document.getElementById("inputPassword2").value;
    refreshMap();
    return false;
}
function changeDisplay(dispStat){
  document.getElementById("inputPassword2").style.display=dispStat;
  document.getElementById("sondeprembutton").style.display=dispStat;
  document.getElementById("input-label").style.display=dispStat;
}
var secimElementi = document.getElementById("mapSelect");
secimElementi.addEventListener("change", function() {
  var secilenDeger = secimElementi.value;
  if (secilenDeger === "1") {
    changeDisplay("block");
  }
  else if (secilenDeger === "2"){
    changeDisplay("block");
    window.location.href = "/archive";
  } 
  else if (secilenDeger === "3"){
    changeDisplay("block");
    window.location.href = "/fire";
  } 
  else if (secilenDeger === "4"){
    changeDisplay("block");
    window.location.href = "/eonet";
  } 
  else {
    changeDisplay("None");
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Sayfa yüklendiğinde çalışacak kodlar buraya gelir
  // Paneli gizle
  var panel = document.getElementById("panel");
  if (panel) {
      panel.style.display = "none";
  } else {
      console.error("Panel element not found.");
  }
});

function togglePanel() {
  var panel = document.getElementById("panel");
  if (panel) {
      if (panel.style.display === "block") {
          panel.style.display = "none";
      } else {
          panel.style.display = "block";
      }
  } else {
      console.error("Panel element not found.");
  }
}

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