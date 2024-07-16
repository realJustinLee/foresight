import React, { useEffect, useState } from 'react';

import BarHorizontal from "./charts/BarHorizontal";
import { connect } from 'react-redux';
import { choroplethReduce, filterSubcat, lineGraphReduce, getUnits, getScenerio } from '../assets/data/DataManager';
import Line from './charts/Line';
import BarCountryControl from './dropdowns/BarCountryControl';
import { getBarColors } from '../assets/data/GcamColors';
import { setDashDate, setDashReg, setDashSubs } from './Store';
import LeafletSync from "./maps/LeafletSync";
import { datasets } from '../assets/data/Scenarios';

function DashboardGraphs({ openedScenerios, selectedGuage, openedGuages, curYear, region, subcat, lineData, guageData, choroplethData, barData, aggSub, setDashboardDate, setDashboardReg, setDashboardSubs, choroplethColorPalette, setChoroplethColorPalette, choroplethInterpolation, setInterpolation, dataset }) {
  const [width, setWidth] = useState(window.innerWidth);

  const [dashYear, setYear] = useState(curYear);
  const [dashRegion, setRegion] = useState(region);
  const [dashSubcategory, setSubcategory] = useState(subcat);

  useEffect(() => {
    setDashboardDate(dashYear)
  }, [dashYear]);

  useEffect(() => {
    setDashboardReg(dashRegion)
  }, [dashRegion]);

  useEffect(() => {
    setDashboardSubs(dashSubcategory)
  }, [dashSubcategory]);

  useEffect(() => {
    //console.log("SCENERIO CHANGE");
  }, [openedScenerios]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const Scenerios = (openedScenerios && openedScenerios.length > 1) ? openedScenerios : [{ title: "" }, { title: "" }];


  // Display label text. Setting default display text for aggregates.
  let subcatDisplay = "";
  let regionDisplay = "";
  if (subcat !== "Aggregate of Subsectors")
    subcatDisplay = " " + subcat;
  if (region !== "class1")
    regionDisplay = region;


  // Load Units for Display
  let units = "ERROR: Units not loaded";
  if (guageData !== "i") {
    units = getUnits(guageData, selectedGuage);
  }


  // Labels
  let lineChartLabel = (<div className="text-centered">{regionDisplay} {subcatDisplay} Trends</div>)
  let choroplethLabel = (<div className="text-centered">
    <div>Spatial Composition {"(" + curYear + subcatDisplay + ")"}</div>
    <div>{Scenerios.at(0).title} vs. {Scenerios.at(1).title}</div>
  </div>)
  let barChartLabel = (<div className="text-centered"> Top 10 Countries {"(" + curYear + ")"} -- By Subsector</div>)

  // Line Chart Visualization
  const lineChart = (lineData === 'i') ? (
    <div className="grid-border-hidden text-centered">
      Loading Dataset...
    </div>
  ) : (
    <Line data={lineGraphReduce(lineData, selectedGuage, Scenerios, dashSubcategory)} unit={units} date={dashYear} setDate={setYear} />
  )


  // Choropleth Visualization
  const choropleth = (choroplethData === 'i') ? (
    <div className="grid-border-hidden text-centered">
      Loading Dataset...
    </div>
  ) : (
    <LeafletSync
      setRegion={setRegion}
      choroplethData={choroplethData}
      Scenerios={Scenerios}
      mapRegion={(datasets.find(obj => obj.dataset === dataset).params)[selectedGuage].region} //.find(param => param.title === selectedGuage).region
      data={choroplethReduce(choroplethColorPalette, choroplethInterpolation, 8, getScenerio(choroplethData, Scenerios.at(0).title))}
      data2={choroplethReduce(choroplethColorPalette, choroplethInterpolation, 8, getScenerio(choroplethData, Scenerios.at(1).title))}
      uniqueValue={"Dashboard_Big"}
      choroplethColorPalette={choroplethColorPalette}
      setChoroplethColorPalette={setChoroplethColorPalette}
      choroplethInterpolation={choroplethInterpolation}
      setInterpolation={setInterpolation}
    />
  )


  // Bar Chart Visualization
  const barChart = (barData === "i" || aggSub === 'i') ? (
    <div className="grid-border-hidden text-centered">
      Loading Dataset...
    </div>
  ) : (
    <div className='bar-grid grid-border'>
      <BarCountryControl csv={aggSub} scenario={Scenerios.at(0).title} scenerio2={Scenerios.at(1).title} year={dashYear} className="choropleth-control" />
      <BarHorizontal csv={barData} color={openedGuages ? getBarColors(barData, Scenerios.at(0).title, openedGuages.find(guage => guage.title === selectedGuage).group) : ["#666666"]} listKeys={filterSubcat(barData)} scenerio={Scenerios.at(0).title} setdashboardSub={setSubcategory} left={true} selectedGuage = {selectedGuage}/>
      <BarHorizontal csv={barData} color={openedGuages ? getBarColors(barData, Scenerios.at(0).title, openedGuages.find(guage => guage.title === selectedGuage).group) : ["#666666"]} listKeys={filterSubcat(barData)} scenerio={Scenerios.at(1).title} setdashboardSub={setSubcategory} left={false} selectedGuage = {selectedGuage}/>
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
    openedGuages: state.guages,
    selectedGuage: state.dashboardSelection,
    curYear: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
    countries: state.barCountries,
    dataset: state.dataset,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDashboardDate: (date) => dispatch(setDashDate(date)),
    setDashboardReg: (reg) => dispatch(setDashReg(reg)),
    setDashboardSubs: (subs) => dispatch(setDashSubs(subs)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardGraphs);