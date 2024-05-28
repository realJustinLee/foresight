import React, { useEffect, useState } from 'react';

import BarHorizontal from "./charts/BarHorizontal";
import ChoroplethImageSlider from './charts/ChoroplethImageSlider';
import { connect } from 'react-redux';
import { choroplethReduce, filterSubcat, lineGraphReduce, getUnits } from '../assets/data/DataManager';
import Line from './charts/Line';
import BarCountryControl from './dropdowns/BarCountryControl';
import { setBarCountries, setParsedLine } from './Store';
import { getBarColors } from '../assets/data/GcamColors';

function DashboardGraphs({ openedScenerios, scenerioSpread, start, end, selectedGuage, curYear, region, subcat, lineData, choroplethData, barData, aggSub }) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const Scenerios = openedScenerios ? openedScenerios : ["ERR", "ERR"];

  // Display label text. Setting default display text for aggregates.
  let subcatDisplay = "";
  let regionDisplay = "";
  if (subcat !== "Aggregate of Subsectors")
    subcatDisplay = " " + subcat;
  if (region !== "class1")
    regionDisplay = region;


  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  useEffect(() => {
    setStartDate(start);
    setEndDate(end);
  }, [scenerioSpread, start, end]);


  // Load Units for Display
  let units = "ERROR: Units not loaded";
  if (lineData !== "i") {
    units = getUnits(lineData, selectedGuage);
  }


  // Labels
  const lineChartLabel = (<div className="text-centered">{regionDisplay} {subcatDisplay} Trends</div>)
  const choroplethLabel = (<div className="text-centered">
    <div>Spatial Composition {"(" + curYear + subcatDisplay + ")"}</div>
    <div>{Scenerios.at(0).title} vs. {Scenerios.at(1).title}</div>
  </div>)
  const barChartLabel = (<div className="text-centered"> Top 10 Countries {"(" + curYear + ")"} -- By Subsector</div>)


  // Line Chart Visualization
  const lineChart = (lineData === 'i') ? (
    "Loading Dataset..."
  ) : (
    <Line data={lineGraphReduce(lineData, selectedGuage, Scenerios, region, subcat, start, end)} unit={units} />
  )


  // Choropleth Visualization
  const choropleth = (choroplethData === 'i') ? (
    "Loading Dataset..."
  ) : (
    <ChoroplethImageSlider
      id={"Dashboard_Big"}
      scenario_1={Scenerios.at(0).title}
      scenario_2={Scenerios.at(1).title}
      dataset={choroplethReduce(choroplethData, Scenerios.at(0).title, selectedGuage, curYear)}
      dataset2={choroplethReduce(choroplethData, Scenerios.at(1).title, selectedGuage, curYear)}
    />
  )


  // Bar Chart Visualization
  const barChart = (barData === "i" || aggSub === 'i') ? (
    "Loading Dataset..."
  ) : (
    <div className='bar-grid grid-border'>
      <BarCountryControl csv={aggSub} scenario={Scenerios.at(0).title} scenerio2={Scenerios.at(1).title} year={curYear} className="choropleth-control" />
      <BarHorizontal csv={barData} csv2={aggSub} color={getBarColors(barData, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(barData)} scenerio={Scenerios.at(0).title} />
      <BarHorizontal csv={barData} csv2={aggSub} color={getBarColors(barData, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(barData)} scenerio={Scenerios.at(1).title} />
    </div>
  )


  //Display the grid. Below 1000 pixels results in its upright form.
  return (
    (width >= 1000) ? (
      <div className="graph-grid">
        {lineChartLabel}
        {choroplethLabel}
        {barChartLabel}
        {lineChart}
        {choropleth}
        {barChart}
      </div>
    ) : (
      <div className="graph-grid-small">
        {lineChartLabel}
        {lineChart}
        {choroplethLabel}
        {choropleth}
        {barChartLabel}
        {barChart}
      </div>
    ));
}


function mapStateToProps(state) {
  return {
    openedScenerios: state.scenerios,
    selectedGuage: state.dashboardSelection,
    scenerioSpread: { ...(state.scenerios) },
    start: state.startDate,
    end: state.endDate,
    curYear: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
    countries: state.barCountries,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardGraphs);