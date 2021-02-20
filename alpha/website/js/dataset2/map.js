

    function addMap (e) {
    var centerpoint = [46.8832566, -114.0870563]; // original centerpoint hell, montanta
    if (!(e.detail.box || e.detail.points) ) return;
    if (e.detail.points && e.detail.points.length >0){

        var centerpoint = e.detail.points[0] // first one
        console.log(`firstpoint ${centerpoint}`)
    } else {
        // calc centerpoint of box
        var points = e.detail.box.split(" ")

        var n = (parseFloat(points[0])+parseFloat(points[2]))/2
        var e = (parseFloat(points[1])  + parseFloat(points[3]))/2
        console.log(`box ${n} ${e}`)
        centerpoint = [n,e]
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
    L.marker(centerpoint).addTo(mymap)
    .bindPopup(e.detail.name).openPopup();


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

