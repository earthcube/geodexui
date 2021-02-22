

    function addMap (e) {

    var centerpoint = [46.8832566, -114.0870563]; // original centerpoint hell, montanta
    if (!(e.detail.box || e.detail.points || e.detail.poly) ) {
        return;
    }
    if (e.detail.points && e.detail.points.length >0){

        var centerpoint = e.detail.points[0] // first one
        console.log(`firstpoint ${centerpoint}`)
    } else  if (e.detail.box) {
        // calc centerpoint of box
        //var points = e.detail.box.split(" ")
        let box = e.detail.box
        var northing = (box[0][0] + box[1][0])/2
        var easting = (box[0][1] + box[1][1])/2
        console.log(`box ${northing} ${easting}`)
        centerpoint = [northing,easting]
    } else {
        // do polygon here
    }

    var mymap = L.map('mapid').setView(centerpoint, 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

    //L.marker([51.5, -0.09]).addTo(mymap)
        if (e.detail.name){
            L.marker(centerpoint).addTo(mymap)
                .bindPopup(e.detail.name).openPopup();
        } else {
            L.marker(centerpoint).addTo(mymap)
        }


    // have the first one, what about the rest
        if (e.detail.points && e.detail.points.length >1) {

          for (var p =1 ; p < e.detail.points.length; p++) {
              L.marker(e.detail.points[p]).addTo(mymap)
          }
        }
        if (e.detail.poly ) {

       //     L.polygon(e.detail.poly).addTo(mymap)
            }

    if (e.detail.box ) {

  //      L.rectangle(e.detail.box).addTo(mymap)
    }

    // L.polygon([ [51.509, -0.08], [51.503, -0.06], [51.51, -0.047]
    // ]).addTo(mymap).bindPopup("I am a polygon.");

    console.log(e.detail);

    var popup = L.popup();

    function onMapClick(e) {
    popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

    mymap.on('click', onMapClick);
}
    document.addEventListener('addMap',addMap)

