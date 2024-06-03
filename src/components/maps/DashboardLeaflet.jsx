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
import ChoroplethLegend from '../dropdowns/ChoroplethLegend';

const LeafletSync = ({ data, data2, uniqueValue, setRegion }) => {
  //Choropleth Visualization Settings
  const [choroplethColorPalette, setChoroplethColorPalette] = useState("pal_green");
  const [choroplethInterpolation, setInterpolation] = useState("VALUE - LOG");
  const divisions = 7;
  const mapData = data
  console.log("CHoropleth Data", data);
  mapData.forEach(country => {
    country.color = getColor(country.value, data, country.id);
  });
  console.log("CHoropleth Data", data, mapData);
  // Map state:
  const [mapInstance, setMapInstance] = useState(null);
  const [country, setCountryDisplay] = useState("");

  function getColorValues(color, number, n) {
    const colors = getColorsFromPalette(color);
    return colors[Math.floor(((Object.keys(colors).length - 1) / n) * (n - number))];
  }

  function getScaleValuesTest(value, placement, dataLength) {
    let bracket = 0;
    switch (choroplethInterpolation) {
      case "VALUE - LINEAR":
        bracket = Math.round((1 - value) * (divisions - 1));
        break;
      case "VALUE - LOG":
        bracket = divisions - Math.round(divisions * (-1 * Math.exp(-5 * (value)) + 1));
        break;
      case "VALUE - CUBIC":
        bracket = Math.round(((1 - value) ** 3) * (divisions - 1));
        break;
      case "DATA - EQUAL":
        bracket = Math.round((1 - value) * (divisions - 1));
        break;
      case "DATA - SIGMOID":
        bracket = Math.round((placement / dataLength) * divisions);
        break;
      default:
        bracket = Math.round(divisions / (1 + Math.exp(-10 * (placement / dataLength) + 5)));
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

  function getColor(value, data, country) {
    return getScaleValuesTest(getRelativeDataValue(value), getRank(data, country), Object.keys(data).length);
  }

  function style(feature) {
    console.log(feature.id, mapData.filter(item => item.index === feature.id).at(0))
    return {
      fillColor: getColor(getChoroplethValue(mapData, feature.id), mapData, feature.id),
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
  const tileRef = useRef(null);

  // Base tile for the map:
  tileRef.current = L.tileLayer(
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

  // Map creation:
  useEffect(() => {
    mapRef.current = L.map(mapkey + '_1', mapParams);
    // Set map instance to state:
    if (!mapInstance) {
      setMapInstance(mapRef.current);
    }
  }, []);

  // If you want to use the mapInstance in a useEffect hook,
  // you first have to make sure the map exists. Then, you can add your logic.
  useEffect(() => {
    // Check for the map instance before adding something (ie: another event handler).
    // If no map, return:
    if (!mapInstance) return;
    var bounds = L.latLngBounds(L.latLng(-89.98155760646617, -180), L.latLng(89.99346179538875, 180));
    mapInstance.setMaxBounds(bounds);
    mapInstance.on('drag', function () {
      mapInstance.panInsideBounds(bounds, { animate: false });
    });
    mapInstance.on('zoomstart', () => {
      //console.log('Zooming1!!!');
    });
    mapInstance.eachLayer(function (layer) {
      mapInstance.removeLayer(layer);
    });
    var map_base = L.layerGroup([tileRef.current]);
    map_base.addTo(mapInstance);
    L.geoJSON(landcells, { style: style, onEachFeature: onEachFeature }).addTo(mapInstance);
    setMapInstance(mapInstance);
  }, [mapInstance, mapData, choroplethColorPalette, choroplethInterpolation]);

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
    <div id={mapkey + '_1'} style={mapStyles} />
  );
};

export default LeafletSync;
