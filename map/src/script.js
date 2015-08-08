// replace "toner" here with "terrain" or "watercolor"
var layer = new L.StamenTileLayer("toner-lite");
var map = new L.Map("map", {
    center: new L.LatLng(40.7009,-73.9579),
    zoom: 11
});

flip = new L.FeatureGroup();

flipstyle = {
    'weight': .5,
    'color': '#feebe2',
    "fillColor": "#feebe2",
    "fillOpacity": 1
}

cc = new L.FeatureGroup();


function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}



// map.addLayer(layer);

$.getJSON("./data/nycc_joined_to_nyc_flips_2263.geojson", function(data){
    function getColor(d) {
    return d > 9537580 ? '#feebe2' :
           d > 7399998  ? '#fbb4b9' :
           d > 5226396  ? '#f768a1' :
           d > 3088804  ? '#c51b8a' :
           d > 987210.15   ? '#7a0177' :
                      '#7a0177';
    }

    function ccstyle(feature) {
        return {
            fillColor: getColor(feature.properties.flip_tax),
            fillOpacity: 0.7
        };
    }

    var ccd = L.geoJson(data, 
        { onEachFeature: function(feature, layer){
                layer.on({click: zoomToFeature});
                layer.bindPopup('If the fund were redistributed by District, City Council District '+feature.properties.council+' would have '+feature.properties.flip_tax_formatted+' to support development without displacement. <h5><a id =zoom href="district"'+feature.properties.council+'>Zoom in to see buildings in District '+ feature.properties.council+'</h5>')
        })
    ccd.addTo(cc)
    cc.addTo(map)
})

$.getJSON("./data/nyc_flips.geojson", function(data) {
    var flips = L.geoJson(data, {
    style: flipstyle });
    flips.addTo(flip);
 });


map.on('zoomend', function(e){
    console.log(map.getZoom())
    if(map.getZoom() < 14){
        cc.addTo(map)
    } else {
        map.removeLayer(cc)
        layer.addTo(map)
        flip.addTo(map)
    }
})
