import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import "leaflet.sync";
import landcells from "./data/landcells.json"
import {
  ReactCompareSlider
} from "react-compare-slider";
import { getChoroplethValue, getSmallestChoropleth, getLargestChoropleth } from '../../assets/data/DataManager';

import ChoroplethControl from '../dropdowns/ChoroplethControl';
import { getColorsFromPalette } from '../../assets/data/GcamColors';

const LeafletSync = ({ data, data2, uniqueValue, setRegion }) => {
  //Choropleth Visualization Settings
  const [choroplethColorPalette, setChoroplethColorPalette] = useState("pal_green");
  const [choroplethInterpolation, setInterpolation] = useState("VALUE - LOG");

  const mapData = data
  const mapData2 = data2
  // Map state:
  const [mapInstance, setMapInstance] = useState(null);
  const [mapInstance2, setMapInstance2] = useState(null);

  const [country, setCountryDisplay] = useState("");

  function getColorValues(color, number, n) {
    const colors = getColorsFromPalette(color);
    return colors[Math.floor(((Object.keys(colors).length - 1) / n) * (n - number))];
  }

  function getScaleValuesTest(value, placement, dataLength) {
    const divisions = 7;
    let bracket = 0;
    switch(choroplethInterpolation) {
      case "VALUE - LINEAR":
        bracket = Math.round((1-value)*(divisions-1));
        break;
      case "VALUE - LOG":
        bracket = divisions - Math.round(divisions*(-1*Math.exp(-5*(value))+1));
        break;
      case "VALUE - CUBIC":
        bracket = Math.round(((1-value)**3)*(divisions-1));
        break;
      case "DATA - EQUAL":
        bracket = Math.round((1-value)*(divisions-1));
        break;
      case "DATA - SIGMOID":
        bracket = Math.round((placement/dataLength)*divisions);
        break;
      default:
        bracket = Math.round(divisions/(1+Math.exp(-10*(placement/dataLength)+5)));
        break;
    }
    return getColorValues(choroplethColorPalette, Math.min(Math.abs(bracket), divisions), divisions);
  }

  function getRelativeDataValue(countryValue) {
    return (countryValue - getSmallestChoropleth(data)) / (getLargestChoropleth(data) - getSmallestChoropleth(data))
  }

  function getRank(data, country) {
    data.sort((a, b) => b.value - a.value);
    const index = data.findIndex(item => item.id === country);
    return index !== -1 ? index + 1 : -1;
  }

  function getColor(d, data, country) {
    return getScaleValuesTest(getRelativeDataValue(d), getRank(data, country), Object.keys(data).length);
  }

  function style(feature) {
    return {
      fillColor: getColor(getChoroplethValue(mapData, feature.id), mapData, feature.id),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  function style2(feature) {
    return {
      fillColor: getColor(getChoroplethValue(mapData2, feature.id), mapData2, feature.id),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  // Map refs:
  const mapkey = uniqueValue
  const mapRef = useRef(null);
  const mapRef2 = useRef(null);
  const tileRef = useRef(null);
  const tileRef2 = useRef(null);

  // Base tile for the map:
  tileRef.current = L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  tileRef2.current = L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  const mapStyles = {
    width: '100%',
    height: '100%',
  };

  // Options for our map instance:
  const mapParams = {
    center: [0, 0],
    zoom: 1.5,
    zoomControl: false,
    zoomSnap: 0.75,
    closePopupOnClick: false,
    maxBoundsViscosity: 1.0,
    minZoom: 0.8,
    layers: [tileRef.current], // Start with just the base layer
  };

  const mapParams2 = {
    center: [0, 0], // USA
    zoom: 1.5,
    zoomControl: false,
    zoomSnap: 0.75,
    closePopupOnClick: false,
    maxBoundsViscosity: 1.0,
    minZoom: 0.8,
    layers: [tileRef2.current], // Start with just the base layer
  };

  // Map creation:
  useEffect(() => {
    mapRef.current = L.map(mapkey + '_1', mapParams);
    // Set map instance to state:
    if (!mapInstance) {
      setMapInstance(mapRef.current);
    }
    mapRef2.current = L.map(mapkey + '_2', mapParams2);
    // Set map instance to state:
    if (!mapInstance2)
      setMapInstance2(mapRef2.current);
  }, []);

  var legend = L.control();

  legend.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };

  legend.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
    '<b>' + props.name + '</b><br />' + getChoroplethValue(mapData, props.id) + ' people / mi<sup>2</sup>'
    : 'Hover over a state');
  };
  // If you want to use the mapInstance in a useEffect hook,
  // you first have to make sure the map exists. Then, you can add your logic.
  useEffect(() => {
    // Check for the map instance before adding something (ie: another event handler).
    // If no map, return:
    if (!mapInstance || !mapInstance2) return;
    if (mapInstance) {
      var bounds = L.latLngBounds(L.latLng(-89.98155760646617, -180), L.latLng(89.99346179538875, 180));
      mapInstance.setMaxBounds(bounds);
      mapInstance.on('drag', function() {
        mapInstance.panInsideBounds(bounds, { animate: false });
      });
      mapInstance.on('zoomstart', () => {
        //console.log('Zooming1!!!');
      });
    }
    if (mapInstance2) {
      mapInstance2.setMaxBounds(bounds);
      mapInstance2.on('drag', function() {
        mapInstance2.panInsideBounds(bounds, { animate: false });
      });
      mapInstance2.on('zoomstart', () => {
        //console.log('Zooming2!!!');
      });
    }
    mapInstance.eachLayer(function (layer) {
      mapInstance.removeLayer(layer);
    });
    mapInstance2.eachLayer(function (layer) {
      mapInstance2.removeLayer(layer);
    });
    var map_base = L.layerGroup([tileRef.current]);
    var map2_base = L.layerGroup([tileRef2.current]);
    map_base.addTo(mapInstance);
    map2_base.addTo(mapInstance2);
    L.geoJSON(landcells, { style: style, onEachFeature: onEachFeature }).addTo(mapInstance);
    L.geoJSON(landcells, { style: style2, onEachFeature: onEachFeature }).addTo(mapInstance2);
    
    //mapInstance.addControl(legend);
    mapInstance.sync(mapInstance2);
    mapInstance2.sync(mapInstance);
  }, [mapInstance, mapInstance2, mapData, mapData2, choroplethColorPalette, choroplethInterpolation]);

  function highlightFeature(e) {
    var layer = e.target;
    setCountryDisplay(e.sourceTarget.feature.id);
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    layer.bringToFront();
  }

  function resetHighlight(e) {
    var layer = e.target;
    setCountryDisplay("");
    layer.setStyle({
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    });
  }

  function setCountry(e) {
    setRegion(e.sourceTarget.feature.id);
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: setCountry
  });
}

  // Toggle marker on button click:
  return (
    <div className="slider grid-border">
      <div className="slider-container">
        <div className="image-container">
          <div className="choropleth-data-info">
            {country}
            {country===""?"":" - " + getChoroplethValue(mapData, country).toFixed(2)}
          </div>
          <ChoroplethControl
            palette = {choroplethColorPalette}
            interpolation = {choroplethInterpolation}
            changePalette = {setChoroplethColorPalette}
            changeInterpolation = {setInterpolation}
          />
          <div id="map" />
          <ReactCompareSlider
            itemOne={
              <div id={mapkey + '_1'} style={mapStyles} />
            }
            itemTwo={
              <div id={mapkey + '_2'} style={mapStyles} />
            }
            onlyHandleDraggable
            className="map-wrapper"
          />
        </div>
      </div>
    </div>
  );
};

export default LeafletSync;
