

var { light, dark, street } = createBaseLayers();

var url = "static/data/nyc.geojson"
var earthQuakeMarkers = [];
var tectonicPlateMarkers = [];


d3.json(url, parseJSON);
d3.json("GeoJSON/PB2002_boundaries.json", parseBoundariesJSON);

var earthQuakeLayer = L.layerGroup();
var tectonicLayer = new L.layerGroup();

// Only one base layer can be shown at a time
var baseMaps = {
  "Light": light,
  "Dark": dark,
  "Street": street
};

// Overlays that may be toggled on or off
var overlayMaps = {
  "Tectani Plates" : tectonicLayer,
  "EarthQuake": earthQuakeLayer,
};

// Create map object and set default layers
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 11,
  layers: [street, earthQuakeLayer]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


var legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");



  // Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
}

// Finally, we our legend to the map.
legend.addTo(myMap);



function createBaseLayers() {
  var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  });
  return { light, dark, street };
}

function parseJSON(response) {
  for (var i = 0; i < response.features.length; i++) {
    var earthQuake = response.features[i];

    var mCircle = L.circle([earthQuake.geometry.coordinates[1], earthQuake.geometry.coordinates[0]], {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(earthQuake.geometry.coordinates[2]),
      radius: getRadius(earthQuake.properties.mag),
      stroke: true,
      weight: 0.2
    })

    earthQuakeMarkers.push(mCircle.bindPopup("<h2>" + earthQuake.properties.place + "</h2> <hr> <h3>Magnitude: " +
      earthQuake.properties.mag + "</h3> <hr> <h3> depth:" + earthQuake.geometry.coordinates[2] + "</h3>").addTo(earthQuakeLayer));
  }
}

function getRadius(magnitude) {
  return magnitude * Math.pow(magnitude / 10.0, 2) * 300000;
}

function getColor(depth) {
  switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ea822c";
    case depth > 50:
      return "#ee9c00";
    case depth > 30:
      return "#eecc00";
    case depth > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
  }
}


function parseBoundariesJSON(response) {
  console.log("tectanic plate boundary response")
  console.log(response);
  tectonicPlateMarkersList=[];
  for (var i = 0; i < response.features.length; i++) {
      for ( var j=0; j < response.features[i].geometry.coordinates.length; j++){
        
              var coord = response.features[i].geometry.coordinates[j];
              tectonicPlateMarkersList.push(coord)              
      }
  }
  for (x=0; x< tectonicPlateMarkersList.length; x++){

     var plateCircle = L.circle([tectonicPlateMarkersList[x][1],tectonicPlateMarkersList[x][0]], {
          color: "red",
          fillColor: "red",
          fillOpacity: 0.5,
          radius: 1,
          stroke: true,
          weight: 0.1
      }).addTo(tectonicLayer);

     
  }
}