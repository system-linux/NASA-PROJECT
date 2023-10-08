var map = L.map('map').setView([38.9637, 35.2433], 5); // Set coordinates to the middle of Turkey and an appropriate zoom level

const mapThings = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, // Increase maxZoom for better detail
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    document.location.href="/fire";
  } else if (secilenDeger === "map2") {
      document.location.href="/eonet";
  } else {
    document.getElementById("inputSonDeprem").style.display="none";
    document.getElementById("sondeprembutton").style.display="none";
    document.getElementById("input-label").style.display="none";
  }
});



map.on('click', function(e) {
  const apiUrl = `https://api.nasa.gov/planetary/earth/imagery?lat=51&lon=0&dim=0&api_key=6BKYSEZ4MiWbQSnqvnwtxyUpQaOLdAMJN1ya3VFe`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});