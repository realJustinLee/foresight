import React, { useEffect, useState, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";

import BarHorizontal from "./charts/BarHorizontal";
import ChoroplethImageSlider from './charts/ChoroplethImageSlider';
import { connect } from 'react-redux';
import { choroplethReduce, getScenerios, filterSubcat, getBarHorizontal, lineGraphReduce, processData, getUnits } from '../assets/data/DataManager';
import Line from './charts/Line';
import BarCountryControl from './dropdowns/BarCountryControl';
import { setBarCountries, setParsedLine } from './Store';
import { getBarColors } from '../assets/data/GcamColors';
import { lineQuery, lineQueryAggReg, lineQueryAggSub, lineQueryAggRegSub } from '../assets/data/DataQuerries';

//BarHorizontal
const barQuery = `
query BarQuery($param: String!, $year: Int!, $nextToken: String) {
  listGcamDataTableAggClass1Regions(
    filter: {
      x: {eq: $year}, 
      param: {eq: $param}
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      value
      x
      scenario
      region
      class
    }
    nextToken
  }
}
`;

function DashboardGraphs({ openedScenerios, scenerioSpread, start, end, data, dataReg, dataSub, dataRegSub, selectedGuage, curYear, region, subcat, setLineData, dataLine }) {
  const Scenerios = openedScenerios ? openedScenerios : ["ERR", "ERR"];

  const fetchLineData = useCallback(async () => {
    let nextToken = null;
    let allItems = [];
    try {
      if(subcat === "Aggregate of Subsectors" || subcat === "class1") {
        if(region === "Global") {
          console.log("AGGREGSUB");
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
          } while(nextToken);
          setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
        }
        else {
          console.log("AGGREG");
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
          } while(nextToken);
          setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
        }
      }
      else if(region === "Global") {
        console.log("AGGSUB");
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
        } while(nextToken);
        setLineData(getScenerios(allItems, Scenerios.at(0).title, Scenerios.at(1).title));
      }
      else {
        console.log("NOAGG", subcat);
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
        } while(nextToken);
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

  const csv = data;
  const csv1 = dataReg;
  const csv2 = dataSub;
  const csv3 = dataRegSub;
  let rawData = "i"
  let subcatDisplay = ""
  let regionDisplay = ""
  let units = "ERROR: Units not loaded";
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
  //console.log("!!", csv, csv1, csv2, csv3);
  if (csv !== "i" && csv1 !== "i" && csv2 !== "i" && csv3 !== "i") {
    rawData = processData(csv, csv1, csv2, csv3, "GCAM_SSP2", selectedGuage, region, subcat);
    //console.log("!!!", rawData);
    units = getUnits(csv3, selectedGuage);

    //Generate list of countries for bar chart.
    
  }
  return (
    <>
      <div className="graph-grid">
        <div>{regionDisplay} {subcatDisplay} Trends</div>
        <div>
          <div>Spatial Composition {"(" + curYear + subcatDisplay + ")"}</div>
          <div>{Scenerios.at(0).title} vs. {Scenerios.at(1).title}</div>
        </div>
        <div>Top 10 Countries {"(" + curYear + ")"} -- By Subsector</div>
        {dataLine === 'i' ? (
          "Loading Dataset..."
        ) : (
          <Line data={lineGraphReduce(dataLine, selectedGuage, Scenerios, region, subcat, start, end)} unit={units} />
        )}
        {csv2 === 'i' ? (
          "Loading Dataset..."
        ) : (
          <ChoroplethImageSlider
            id={"Dashboard_Big"}
            scenario_1={Scenerios.at(0).title}
            scenario_2={Scenerios.at(1).title}
            dataset={choroplethReduce(csv2, Scenerios.at(0).title, selectedGuage, curYear)}
            dataset2={choroplethReduce(csv2, Scenerios.at(1).title, selectedGuage, curYear)}
          />
        )}
        {(csv === "i" || csv1 === 'i' || csv2 === 'i') ? (
          "Loading Dataset..."
        ) : (
          <div className='bar-grid grid-border'>
            <BarCountryControl csv = {csv2} scenerio = {Scenerios.at(0).title} scenerio2 = {Scenerios.at(1).title} year = {curYear} className="choropleth-control"/>
            <BarHorizontal csv = {csv} color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(0).title} />
            <BarHorizontal csv = {csv} color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(1).title} />
          </div>
        )}
      </div>
      <div className="graph-grid-small">
        <div>{regionDisplay} {subcatDisplay} Trends</div>
        {dataLine === 'i' ? (
          "Loading Dataset..."
        ) : (
          <Line data={lineGraphReduce(dataLine, selectedGuage, Scenerios, region, subcat, start, end)} unit={units} />
        )}
        <div>Spatial Composition {"(" + curYear + subcatDisplay + ")"}</div>
        {csv2 === 'i' ? (
          "Loading Dataset..."
        ) : (
          <ChoroplethImageSlider
            id={"Dashboard_Small"}
            scenario_1={Scenerios.at(0).title}
            scenario_2={Scenerios.at(1).title}
            dataset={choroplethReduce(csv2, Scenerios.at(0).title, selectedGuage, curYear)}
            dataset2={choroplethReduce(csv2, Scenerios.at(1).title, selectedGuage, curYear)}
          />
        )}
        <div>Top 10 Countries {"(" + curYear + ")"} -- By Subsector</div>
        {(csv === "i" || csv1 === 'i' || csv2 === 'i') ? (
          "Loading Dataset..."
        ) : (
          <div className='bar-grid grid-border'>
            <BarCountryControl csv = {csv2} scenerio = {Scenerios.at(0).title} scenerio2 = {Scenerios.at(1).title} year = {curYear} className="choropleth-control"/>
            <BarHorizontal csv = {csv} color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(0).title} />
            <BarHorizontal csv = {csv} color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(1).title} />
          </div>
        )}
      </div>
    </>
  );
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