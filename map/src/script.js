// replace "toner" here with "terrain" or "watercolor"
var layer = new L.StamenTileLayer("toner-lite");
var map = new L.Map("map", {
    center: new L.LatLng(40.7009,-73.9579),
    zoom: 15
});

flip = new L.FeatureGroup();
cc = new L.FeatureGroup();

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

$.getJSON("./data/nycc_joined_to_nyc_flips_2263.geojson", function(data){
    var ccd = L.geoJson(data, {onEachFeature: function(feature, layer){
                    layer.on({click: zoomToFeature})
                    layer.bindPopup('If the fund were redistributed by District, City Council District '+feature.properties.council+' would have '+feature.properties.flip_tax_formatted+' to support development without displacement. <h5><a id =zoom href="district"'+feature.properties.council+'>Zoom in to see buildings in District '+ feature.properties.council+'</h5>')
            }})
    ccd.addTo(cc)
    cc.addTo(map)
    })

$.getJSON("./data/nyc_flips.geojson", function(data) {
    var flips = L.geoJson(data, {
    onEachFeature: function(feature, layer){
        layer.bindPopup('<h3>'+feature.properties.address+'</h3>Sold on '+feature.properties.after_docu+' for '+feature.properties.after_d_01)
    } });
    flips.addTo(flip);
 });

map.on('zoomend', function(e){
    console.log(map.getZoom())
    if(map.getZoom() > 14){
        map.removeLayer(cc)
        layer.addTo(map)
        flip.addTo(map)
    }
})
