import 'ol/ol.css';
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import proj from 'ol/proj'; //is this the right way to pull this in? Or should it just be a single class?
import sync from 'ol-hashed';
import hashed from 'hashed';
import jquery from 'jquery';

var labels = new TileLayer({
            title: 'Labels',
            source: new XYZ({
              
              url: 'https://{1-4}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png'
           })
          });

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://{1-4}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
      })
    }),
    labels
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

function onClick(id, callback) {
  document.getElementById(id).addEventListener('click', callback);
}

onClick('labels', function() {
  labels.setVisible(document.getElementById("labels").checked);
})  

onClick('submit-url', function() {
  var name = document.getElementById("cog-url").value;
    console.log("submitted url" + name)

        var url = "http://bstlgagxwg.execute-api.us-east-1.amazonaws.com/production/tiles/{z}/{x}/{y}.png?url=" + name;
        
         var cogLayer = new TileLayer({
            type: 'base',
            source: new XYZ({
              url: url
            })
          });
        map.addLayer(cogLayer);
       var boundsUrl="https://bstlgagxwg.execute-api.us-east-1.amazonaws.com/production/bounds?url=" + name;
       jquery.getJSON(boundsUrl, function(result){ //TODO: Get jquery right in imports
                 var extent = proj.transformExtent(result.bounds, 'EPSG:4326', 'EPSG:3857');
                 map.getView().fit(extent, map.getSize());
                 //map.getView().animate({
                 //   center: (ol.proj.fromLonLat([lon, lat])),
                 //   duration: 2000
                 //     });
                 
          });
       console.log("updating to 43")
       //update({count: 43});
       update({url: name});
       console.log("updated " + state );

}) 

function toggleControl(element){
    console.log("called" + element)
    labels.setVisible(element.checked);
   
  }

var state = {
  //count: 42,
  url: {
    default: "",
    deserialize: String
  }
};

function listener(newState) {
  console.log("state is" + newState[0] + "  " + newState);
  console.log("center is " + newState.center);
  console.log("zoom is " + newState.zoom);
  if ('url' in newState) {
    //console.log("url is in!  " + newState.url);
    var decoded = decodeURIComponent(newState.url);
    console.log("decoded is " + decoded);
    var tilesUrl = "http://bstlgagxwg.execute-api.us-east-1.amazonaws.com/production/tiles/{z}/{x}/{y}.png?url=" + decoded;
        
         var cogLayer = new TileLayer({
            type: 'base',
            source: new XYZ({
              url: tilesUrl
            })
          });
        map.addLayer(cogLayer);
        var view = map.getView();

        console.log("view center is " + view.getCenter());
        /*if (view.center)
       var boundsUrl="https://bstlgagxwg.execute-api.us-east-1.amazonaws.com/production/bounds?url=" + decoded;
       jquery.getJSON(boundsUrl, function(result){ 
                 var extent = proj.transformExtent(result.bounds, 'EPSG:4326', 'EPSG:3857');
                 map.getView().fit(extent, map.getSize());
                 //map.getView().animate({
                 //   center: (ol.proj.fromLonLat([lon, lat])),
                 //   duration: 2000
                 //     });
                 
          });
       console.log("finished loading " + boundsUrl);*/
      //update({url: decoded});  
    }
  // called when the state in the URL is different than what we have
}

// register a state provider
var update = hashed.register(state, listener);

// When the state of your application changes, update the hash.
 // URL hash will become #/count/43/color/blue

// persist center and zoom in the URL hash
sync(map);
