import React, { useEffect, useState, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";

import BarHorizontal from "./charts/BarHorizontal";
import ChoroplethImageSlider from './charts/ChoroplethImageSlider';
import { connect } from 'react-redux';
import { choroplethReduce, getScenerios, filterSubcat, lineGraphReduce, getUnits } from '../assets/data/DataManager';
import Line from './charts/Line';
import BarCountryControl from './dropdowns/BarCountryControl';
import { setBarCountries, setParsedLine } from './Store';
import { getBarColors } from '../assets/data/GcamColors';
import { lineQuery, lineQueryAggReg, lineQueryAggSub, lineQueryAggRegSub } from '../assets/data/DataQuerries';

function DashboardGraphs({ openedScenerios, scenerioSpread, start, end, data, dataReg, dataSub, dataRegSub, selectedGuage, curYear, region, subcat, setLineData, dataLine }) {
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

  const fetchLineData = useCallback(async () => {
    let nextToken = null;
    let allItems = [];
    try {
      if (subcat === "Aggregate of Subsectors" || subcat === "class1") {
        if (region === "Global") {
          //console.log("AGGREGSUB");
          do {
            const response = await API.graphql(
              graphqlOperation(lineQueryAggRegSub, {
                param: selectedGuage,
                nextToken
              })
            );
            const items = response.data.listGcamDataTableAggParamGlobals.items;
            allItems = allItems.concat(items);
            nextToken = response.data.listGcamDataTableAggParamGlobals.nextToken;
          } while (nextToken);
          setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
        }
        else {
          //console.log("AGGREG");
          do {
            const response = await API.graphql(
              graphqlOperation(lineQueryAggSub, {
                param: selectedGuage,
                reg: region,
                nextToken
              })
            );
            const items = response.data.listGcamDataTableAggParamRegions.items;
            allItems = allItems.concat(items);
            nextToken = response.data.listGcamDataTableAggParamRegions.nextToken;
          } while (nextToken);
          setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
        }
      }
      else if (region === "Global") {
        //console.log("AGGSUB");
        do {
          const response = await API.graphql(
            graphqlOperation(lineQueryAggReg, {
              param: selectedGuage,
              sub: subcat,
              nextToken
            })
          );
          const items = response.data.listGcamDataTableAggClass1Globals.items;
          allItems = allItems.concat(items);
          nextToken = response.data.listGcamDataTableAggClass1Globals.nextToken;
        } while (nextToken);
        setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
      }
      else {
        //console.log("NOAGG", subcat);
        do {
          const response = await API.graphql(
            graphqlOperation(lineQuery, {
              param: selectedGuage,
              reg: region,
              sub: subcat,
              nextToken
            })
          );
          const items = response.data.listGcamDataTableAggClass1Regions.items;
          allItems = allItems.concat(items);
          nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
        } while (nextToken);
        setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
      }
    } catch (error) {
      console.error(error);
    }
  }, [region, subcat, selectedGuage, setLineData]);
  useEffect(() => {
    setLineData("i");
    fetchLineData(region, subcat);
  }, [selectedGuage, subcat, region, Scenerios.at(0).title, Scenerios.at(1).title, fetchLineData, setLineData]);


  // Initialize datasets. empty datasets will appear as the characer 'i'.
  const csv = data; // No Agg (Bar Chart, Line Chart with filtered Region and Subsector, Choropleth with filtered Subsector)
  const csv1 = dataReg; // Agg Region (Line Chart with filtered Subsector)
  const csv2 = dataSub; // Agg Subsector (Line Chart with Filtered Region, Choropleth Default)
  const csv3 = dataRegSub; // Agg Region and Subsector (Line Chart Default)

  // Debug Data loading
  // console.log("!!", csv, csv1, csv2, csv3);


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
  if (csv3 !== "i") {
    units = getUnits(csv3, selectedGuage);
  }


  // Labels
  const lineChartLabel = (<div>{regionDisplay} {subcatDisplay} Trends</div>)
  const choroplethLabel = (<div>
    <div>Spatial Composition {"(" + curYear + subcatDisplay + ")"}</div>
    <div>{Scenerios.at(0).title} vs. {Scenerios.at(1).title}</div>
  </div>)
  const barChartLabel = (<div>Top 10 Countries {"(" + curYear + ")"} -- By Subsector</div>)


  // Line Chart Visualization
  const lineChart = (dataLine === 'i') ? (
    "Loading Dataset..."
  ) : (
    <Line data={lineGraphReduce(dataLine, selectedGuage, Scenerios, region, subcat, start, end)} unit={units} />
  )


  // Choropleth Visualization
  const choropleth = (csv2 === 'i') ? (
    "Loading Dataset..."
  ) : (
    <ChoroplethImageSlider
      id={"Dashboard_Big"}
      scenario_1={Scenerios.at(0).title}
      scenario_2={Scenerios.at(1).title}
      dataset={choroplethReduce(csv2, Scenerios.at(0).title, selectedGuage, curYear)}
      dataset2={choroplethReduce(csv2, Scenerios.at(1).title, selectedGuage, curYear)}
    />
  )


  // Bar Chart Visualization
  const barChart = (csv === "i" || csv1 === 'i' || csv2 === 'i') ? (
    "Loading Dataset..."
  ) : (
    <div className='bar-grid grid-border'>
      <BarCountryControl csv={csv2} scenerio={Scenerios.at(0).title} scenerio2={Scenerios.at(1).title} year={curYear} className="choropleth-control" />
      <BarHorizontal csv={csv} csv2={csv2} color={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(0).title} />
      <BarHorizontal csv={csv} csv2={csv2} color={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(1).title} />
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
    data: state.parsedData,
    dataReg: state.parsedDataReg,
    dataSub: state.parsedDataSub,
    dataRegSub: state.parsedDataRegSub,
    dataLine: state.parsedDataLine,
    curYear: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
    countries: state.barCountries,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setCountries: (color) => dispatch(setBarCountries(color)),
    setLineData: (data) => dispatch(setParsedLine(data)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardGraphs);