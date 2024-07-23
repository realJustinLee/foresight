import React, { useEffect, useState } from 'react';

import BarHorizontal from "./charts/BarHorizontal";
import { connect } from 'react-redux';

import Line from './charts/Line';
import BarCountryControl from './dropdowns/BarCountryControl';
import { setDashDate, setDashReg, setDashSubs } from './Store';
import LeafletSync from "./maps/LeafletSync";
import { choroplethReduce, filterSubcat, lineGraphReduce, getUnits } from 
'./data/DataManager';
import { getBarColors } from './data/GcamColors';
import { datasets } from './data/Scenarios';

/**
 * DashboardGraphs component is responsible for rendering the three data 
 * visualizations (currently a line chart, choropleth, and bar chart) based on
 * the selected scenarios, parameter, and the user selected date, region, and 
 * subcategory. This is rendered below the DashboardFloater.
 * 
 * @param {object} props - The component props.
 * @param {object[]} props.openedScenerios - State indicating the currently 
 * selected scenarios.
 * @param {string} props.selectedGuage - State indicating the currently
 * selected guage.
 * @param {object[]} props.openedGuages - State indicating the currently
 * open guages.
 * @param {Number} props.curYear - State indicating the currently
 * selected year.
 * @param {string} props.region - State indicating the currently
 * selected region.
 * @param {string} props.subcat - State indicating the currently
 * selected subcategory.
 * @param {object[]} props.lineData - Dataset containing data required
 * for the line chart.
 * @param {object[]} props.guageData - Dataset containing data required
 * for the guage display.
 * @param {object[]} props.choroplethData - Dataset containing data required
 * for the choropleth Leaflet.
 * @param {object[]} props.barData - Dataset containing data required
 * for the bar chart.
 * @param {object[]} props.aggSub - Dataset containing data with global
 * regions.
 * @param {(date: Number) => any} props.setDashboardDate - Function setting the
 * date value .
 * @param {(reg: string) => any} props.setDashboardReg - Function setting the
 * region value .
 * @param {(subs: string) => any} props.setDashboardSubs - Function setting the
 * subsector value .
 * @param {string} props.choroplethColorPalette - The current choropleth color 
 * palette selection.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setChoroplethColorPalette - 
 * Function that sets the current choropleth color palette.
 * @param {string} props.choroplethInterpolation - The current choropleth 
 * interpolation selection.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setInterpolation - 
 * Function that sets the current choropleth interpolation.
 * @param {string} props.dataset - State indicating the current dataset.
 * @param {object} props.datasetInfo - State indicating the dataset headers
 * for user-uploaded datasets.
 * @returns {ReactElement} The rendered component.
 */
function DashboardGraphs({ openedScenerios, selectedGuage, openedGuages, 
  curYear, region, subcat, lineData, guageData, choroplethData, barData, 
  aggSub, setDashboardDate, setDashboardReg, setDashboardSubs, 
  choroplethColorPalette, setChoroplethColorPalette, choroplethInterpolation, 
  setInterpolation, dataset, datasetInfo }) {

  const [width, setWidth] = useState(window.innerWidth);

  const [dashYear, setYear] = useState(curYear);
  const [dashRegion, setRegion] = useState(region);
  const [dashSubcategory, setSubcategory] = useState(subcat);

  //console.log(openedScenerios, selectedGuage)
  useEffect(() => {
    setDashboardDate(dashYear)
  }, [dashYear, setDashboardDate]);

  useEffect(() => {
    setDashboardReg(dashRegion)
  }, [dashRegion, setDashboardReg]);

  useEffect(() => {
    setDashboardSubs(dashSubcategory)
  }, [dashSubcategory, setDashboardSubs]);

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

  const Scenerios = (openedScenerios && openedScenerios.length > 1) ? 
  openedScenerios : [{ title: "" }, { title: "" }];


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
  let lineChartLabel = 
  (<div className="text-centered">{regionDisplay} {subcatDisplay} Trends</div>)
  let choroplethLabel = (<div className="text-centered">
    <div>Spatial Composition {"(" + curYear + subcatDisplay + ")"}</div>
    <div>{Scenerios.at(0).title} vs. {Scenerios.at(1).title}</div>
  </div>)
  let barChartLabel = (<div className="text-centered"> Top 10 Countries 
  {"(" + curYear + ")"} -- By Subsector</div>)
  //console.log(lineData);
  // Line Chart Visualization
  const lineChart = (lineData === 'i') ? (
    <div className="grid-border-hidden text-centered">
      Loading Dataset...
    </div>
  ) : (
    <Line data={lineGraphReduce(lineData, selectedGuage, Scenerios, 
      dashSubcategory)} unit={units} date={dashYear} setDate={setYear} />
  )

  const getRegion = () => {
    if(datasets.find(obj => obj.dataset === dataset)) {
      //console.log("!!", datasets.find(obj => obj.dataset === dataset))
      return (datasets.find(obj => obj.dataset === dataset).params)[selectedGuage].region;
    }
    else if(datasetInfo.find(obj => obj.dataset === dataset)) {
      //console.log("!!", datasetInfo.find(obj => obj.dataset === dataset).params[selectedGuage].region, selectedGuage)
      return (datasetInfo.find(obj => obj.dataset === dataset).params)[selectedGuage].region;
    }
    return "region";
  };

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
      mapRegion={getRegion()} //.find(param => param.title === selectedGuage).region
      data={choroplethReduce(choroplethColorPalette, choroplethInterpolation, 
        8, choroplethData, Scenerios.at(0).title)}
      data2={choroplethReduce(choroplethColorPalette, choroplethInterpolation, 
        8, choroplethData, Scenerios.at(1).title)}
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
      <BarCountryControl csv={aggSub} scenario={Scenerios.at(0).title} 
      scenerio2={Scenerios.at(1).title} 
      className="choropleth-control" />
      <BarHorizontal csv={barData} color={openedGuages ? 
        getBarColors(barData, Scenerios.at(0).title, 
        openedGuages.find(guage => guage.title === selectedGuage) ? openedGuages.find(guage => guage.title === selectedGuage).group : ["#error"]) : ["#666666"]} 
        listKeys={filterSubcat(barData)} scenerio={Scenerios.at(0).title} 
        setdashboardSub={setSubcategory} left={true} 
        selectedGuage = {selectedGuage}/>
      <BarHorizontal csv={barData} color={openedGuages ? 
        getBarColors(barData, Scenerios.at(0).title, 
        openedGuages.find(guage => guage.title === selectedGuage) ? openedGuages.find(guage => guage.title === selectedGuage).group : ["error"]) : ["#666666"]} 
        listKeys={filterSubcat(barData)} scenerio={Scenerios.at(1).title} 
        setdashboardSub={setSubcategory} left={false} 
        selectedGuage = {selectedGuage}/>
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

/**
 * Maps the state from the Redux store to the component props.
 * 
 * @param {object} state - The current state.
 * @returns {object} The mapped props.
 */
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
    datasetInfo: state.datasetInfo,
  };
}

/**
 * Maps the dispatch functions to the component props.
 * 
 * @param {Function} dispatch - The dispatch function.
 * @returns {object} The mapped props.
 */
function mapDispatchToProps(dispatch) {
  return {
    setDashboardDate: (date) => dispatch(setDashDate(date)),
    setDashboardReg: (reg) => dispatch(setDashReg(reg)),
    setDashboardSubs: (subs) => dispatch(setDashSubs(subs)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardGraphs);