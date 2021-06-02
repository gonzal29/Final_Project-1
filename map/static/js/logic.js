// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var baseURL = "https://feeds.citibikenyc.com/stations/stations.json";
var date = "$where=lastCommunicationTime between'2019-01-01 12:00:00 AM' and '2019-12-31 11:59:59 PM'";
var complaint = "&complaint_type=Rodent";
var limit = "&$limit=10000";

// Assemble API query URL
var url = baseURL + date + complaint + limit;

// Grab the data with d3
d3.json("stations.json",function(response) {
  console.log(response);
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.stationBeanList.length; i++) {

    // Set the data location property to a variable
    var location = response.stationBeanList[i];

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.latitude, location.longitude]));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
