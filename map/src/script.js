// replace "toner" here with "terrain" or "watercolor"
var baselayer = new L.StamenTileLayer("toner-lite");
var map = new L.Map("map", {
    center: new L.LatLng(40.7009,-73.9579),
    zoom: 11
});

flip = new L.FeatureGroup();
cc = new L.FeatureGroup();

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

flipstyle = {
    'fillOpacity': 1,
    'fillColor': '#980043', 
    'opacity': 0  
}

function cloropleth(d){
      return d <= 987270.16  ? '#F1EEF6' :
          d <= 1730582.92  ? '#D7B5D8' :
          d <= 3546568.7   ? '#DF65B0' :
          d <= 5147418.5   ? '#DD1C77' :
          d <= 9537580   ? '#980043' :
          '#980043';
}

function cloropleth_style(feature){
    return{
          weight: 2,
          opacity: 0.1,
          color: '#ddd',
          fillOpacity: 1,
          fillColor: cloropleth(feature.properties.flip_tax)
      }
}



$.getJSON("./data/nycc_joined_to_nyc_flips_2263.geojson", function(data){
    var ccd = L.geoJson(data, {
            style: cloropleth_style,
            onEachFeature: function(feature, layer){
                layer.on({click: zoomToFeature,})
                layer.bindPopup('With the fund, City Council District '+feature.properties.council+' would have '+feature.properties.flip_tax_formatted+' to support development without displacement.')
            }})
    ccd.addTo(cc)
    cc.addTo(map)
})

$.getJSON("./data/nyc_flips.geojson", function(data) {
    var flips = L.geoJson(data, {
    style: flipstyle,
    onEachFeature: function(feature, layer){
        layer.on({click: function(e){
            window.location.hash = feature.properties.BBL
        }})
        layer.bindPopup('<h3>'+feature.properties.ADDRESS+'</h3>Sold on '+feature.properties.AFTER_DOCU+' for '+feature.properties.AFTER_D_01+'<br>'+feature.properties.BBL)
    // hash url to BBL
        url = window.location.href
        thisurl = url.split('#') 
        if (thisurl[1]){
            if (thisurl[1] == feature.properties.BBL){
                center = layer.getBounds().getCenter()
                map.setView([center.lat, center.lng], 22)
            }   
        }      
    } });
    flips.addTo(flip);
 });


map.on('viewreset', function(e){
    if(map.getZoom() > 14){
        map.removeLayer(cc)
        baselayer.addTo(map)
        flip.addTo(map)
    } else {
        cc.addTo(map)
        map.removeLayer(baselayer)
        map.removeLayer(flip)
    }
})

// hashed locations


