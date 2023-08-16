console.log(embeddedData.routes);
let Routes = JSON.parse(embeddedData.routes);
console.log(Routes);
displayPath(Routes);

function displayPath(routes) {

  let path = (routes[1]);
  const map = L.map('my-map').setView([22.1, 81.8], 4.4);


  const myAPIKey = "b5ccc701212d45658ee3cc25830021f7";


  const isRetina = L.Browser.retina;

  const baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`;
  const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

  L.tileLayer(isRetina ? retinaUrl : baseUrl, {
    attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
    apiKey: myAPIKey,
    maxZoom: 20,
    id: 'osm-bright',
  }).addTo(map);


  let waypoints = "";
  console.log("path" + path);
  let coordinates = (routes[0]);
  console.log(path.length);
  for (let i = 1; i < path.length - 1; i++) {
    console.log("i - " + coordinates[path[i] - 1]);
    let temp = coordinates[path[i] - 1][0];
    coordinates[path[i] - 1][0] = coordinates[path[i] - 1][1];
    coordinates[path[i] - 1][1] = temp;
    waypoints = waypoints.concat(`${coordinates[path[i] - 1].join(',')}|`);
    L.marker(coordinates[path[i] - 1]).addTo(map)
  }
  if (path[path.length - 1] != 1) {
    console.log(coordinates[path[path.length - 1] - 1])
    let temp = coordinates[path[path.length - 1] - 1][0];
    coordinates[path[path.length - 1] - 1][0] = coordinates[path[path.length - 1] - 1][1];
    coordinates[path[path.length - 1] - 1][1] = temp;
    console.log(coordinates[path[path.length - 1] - 1])
    waypoints = waypoints.concat(`${coordinates[path[path.length - 1] - 1].join(',')}`);
    L.marker(coordinates[path[path.length - 1] - 1]).addTo(map)
    console.log(waypoints);
  }
  else {
    waypoints = waypoints.concat(`${coordinates[path[path.length - 1] - 1].join(',')}`);
  }


  const turnByTurnMarkerStyle = {
    radius: 5,
    fillColor: "#fff",
    color: "#555",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
  }

  let mapUrl = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${myAPIKey}`;
  console.log(mapUrl);
  fetch(`https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${myAPIKey}`).then(res => res.json()).then(result => {


    L.geoJSON(result, {
      style: (feature) => {
        return {
          color: "rgba(20, 137, 255, 0.7)",
          weight: 5
        };
      }
    }).bindPopup((layer) => {
      return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`
    }).addTo(map);


    const turnByTurns = [];
    result.features.forEach(feature => feature.properties.legs.forEach((leg, legIndex) => leg.steps.forEach(step => {
      const pointFeature = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": feature.geometry.coordinates[legIndex][step.from_index]
        },
        "properties": {
          "instruction": step.instruction.text
        }
      }
      turnByTurns.push(pointFeature);
    })));

    L.geoJSON({
      type: "FeatureCollection",
      features: turnByTurns
    }, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, turnByTurnMarkerStyle);
      }
    }).bindPopup((layer) => {
      return `${layer.feature.properties.instruction}`
    }).addTo(map);

  }, error => console.log(err));


  const successCallback = (position) => {

    const Coordinates = [position.coords.latitude, position.coords.longitude];
    // L.circleMarker(Coordinates, liveLocationMarkerStyle).addTo(map).bindPopup("Your location");
    L.marker(Coordinates).addTo(map).bindPopup("Your location");
    console.log(Coordinates);
  };

  const errorCallback = (error) => {
    alrt.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show ok" role="alert">
            Unable to locate your current location because of no location access or something went wrong
            <button type="button" class="btn-close ref_but" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;

  };

  // const liveLocationMarkerStyle={
  //   radius: 8,
  // fillColor: "#4c96e0",
  // color: "#fff",
  // weight: 1,
  // opacity: 1,
  // fillOpacity: 1
  // }

  const options = {
    enableHighAccuracy: true
  };
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  const id = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
}