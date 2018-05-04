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


var spacenetURL = ""
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

function zoomLoad(name, rgb="1,2,3", linearStretch="True", tileType="tiles", band1="5", band2="7") {
  if (ValidURL(name)) {
    var url = name //encodeURIComponent(name)
    var boundsUrl = "https://14ffxwyw5l.execute-api.us-east-1.amazonaws.com/production/bounds?url=" + url;

    getJSON(boundsUrl, function(result) {

      var extent = proj.transformExtent(result.bounds, 'EPSG:4326', 'EPSG:3857');
      map.getView().fit(extent, map.getSize());
      console.log(rgb)
      var tilesUrl = createTilesUrl(name, rgb, linearStretch, tileType);
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
function createTilesUrl(url="", rgb="1,2,3", linearStretch="True", tileType="tiles", band1="5", band2="7") {
  return  "https://14ffxwyw5l.execute-api.us-east-1.amazonaws.com/production/"+tileType+ "/{z}/{x}/{y}.jpg?url=" + url + "&rgb=" + rgb + "&linearStretch=" + linearStretch+"&band1=" + band1 + "&band2="+band2;
}



//TODO: Add labels back in. Need a nice button for them, and also need to get them to overlay on the map.
// onClick('labels', function() {
//   labels.setVisible(document.getElementById("labels").checked);
// })

onClick('sample-1', function() {
  spacenetURL = document.getElementById("cog-url").value // = spacenetURL;
  zoomLoad(spacenetURL, "1,2,3", "False");
});

onClick('sample-2', function() {
  spacenetURL = document.getElementById("cog-url").value // = spacenetURL;
  zoomLoad(spacenetURL, "5,3,2", "true");
});

onClick('sample-3', function() {
  spacenetURL = document.getElementById("cog-url").value // = spacenetURL;
  zoomLoad(spacenetURL, "7,5,3", "true");
});

onClick('sample-4', function() {
  spacenetURL = document.getElementById("cog-url").value // = spacenetURL;
  zoomLoad(spacenetURL, "7,5,2", "true", "NDtiles");
});




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
