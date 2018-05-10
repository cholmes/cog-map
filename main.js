import 'ol/ol.css';
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import proj from 'ol/proj'; //is this the right way to pull this in? Or should it just be a single class?
import Attribution from 'ol/'
import sync from 'ol-hashed';
import hashed from 'hashed';
import { getJSON } from 'jquery';
import validUrl from 'valid-url';

var labels = new TileLayer({
  title: 'Labels',
  source: new XYZ({

    url: 'https://{1-4}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',
    attributions: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ' + 
         '© <a href="https://carto.com/attribution">CARTO</a>',
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

function zoomLoad(name) {
  if (ValidURL(name)) {
    var url = encodeURIComponent(name)
    var boundsUrl = "https://tiles.rdnt.io/bounds?url=" + url;


    getJSON(boundsUrl, function(result) {

      var extent = proj.transformExtent(result.bounds, 'EPSG:4326', 'EPSG:3857');
      map.getView().fit(extent, map.getSize());

      var tilesUrl = createTilesUrl(url);
      var cogLayer = new TileLayer({
        type: 'base',
        source: new XYZ({
          url: tilesUrl
        })
      });
      var layers = map.getLayers();
      layers.removeAt(2); //remove the previous COG map, so we're not loading extra tiles as we move around.
      map.addLayer(cogLayer);
      update({
        url: name
      });

    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert("Request failed. Are you sure '" + name + "' is a valid COG?  ");
    });
    //TODO - include link to COG validator

  }
}

/* 
 * This creates the tiles URL. Change here to use another lambda server, or change the default params.
 * TODO: enable setting of things like RGB and linear stretch in the GUI, and then adjust the url's here.
 */
function createTilesUrl(url) {
  return  "https://tiles.rdnt.io/tiles/{z}/{x}/{y}?url=" + url;
}

//TODO: Add labels back in. Need a nice button for them, and also need to get them to overlay on the map.
// onClick('labels', function() {
//   labels.setVisible(document.getElementById("labels").checked);
// })

onClick('sample-1', function() {
  var planetUrl = "https://s3-us-west-2.amazonaws.com/planet-disaster-data/hurricane-harvey/SkySat_Freeport_s03_20170831T162740Z3.tif"
  document.getElementById("cog-url").value = planetUrl;
  zoomLoad(planetUrl);
});

onClick('sample-2', function() {
  var oamUrl = "http://oin-hotosm.s3.amazonaws.com/56f9b5a963ebf4bc00074e70/0/56f9c2d42b67227a79b4faec.tif"
  document.getElementById("cog-url").value = oamUrl;
  zoomLoad(oamUrl);
});

onClick('sample-3', function() {
  var oamUrl = "http://oin-hotosm.s3.amazonaws.com/59c66c5223c8440011d7b1e4/0/7ad397c0-bba2-4f98-a08a-931ec3a6e943.tif"
  document.getElementById("cog-url").value = oamUrl;
  zoomLoad(oamUrl);
});

onClick('submit-url', function(event) {
  event.preventDefault();
  var name = document.getElementById("cog-url").value;
  console.log("submitted url" + name)
  zoomLoad(name);

})



function toggleControl(element) {
  console.log("called" + element)
  labels.setVisible(element.checked);

}

var state = {
  url: {
    default: "",
    deserialize: function (url) {
      return decodeURIComponent(url)
    },
    serialize: function (url) {
      return encodeURIComponent(url)
    }
  }
};

function listener(newState) {

  if ('url' in newState) {

    //TODO: refactor in to common method with the submit, so we don't duplicate code
    var tilesUrl = createTilesUrl(encodeURIComponent(newState.url));
    var cogLayer = new TileLayer({
      type: 'base',
      source: new XYZ({
        url: tilesUrl
      })
    });

    map.addLayer(cogLayer);

    document.getElementById("cog-url").value = newState.url;
    //This had an attempt to move to a COG location, but then it messed up with existing hashes.
    //May consider adding a button that will zoom the user to the location of the COG displayed.
  }
}

function ValidURL(str) {
  if (!validUrl.isUri(str)) {
    alert("'" + str + "' is not a valid URL. Did you forget to include http://? ");
    //TODO - automatically add in http:// if it's not included and check that.
    return false;
  } else {
    return true;
  }
}

// register a state provider
var update = hashed.register(state, listener);

// persist center and zoom in the URL hash
sync(map);

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("about");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
