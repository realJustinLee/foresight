import React, { useEffect, useState, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";

import BarHorizontal from "./charts/BarHorizontal";
import ChoroplethImageSlider from './charts/ChoroplethImageSlider';
import { connect } from 'react-redux';
import { choroplethReduce, getDates, getScenerio, filterRegion, filterSubcat, getBarHorizontal, lineGraphReduce, processData, getUnits } from '../assets/data/DataManager';

import Line from './charts/Line';
import BarCountryControl from './dropdowns/BarCountryControl';
import { setBarCountries } from './Store';
import { getBarColors } from '../assets/data/GcamColors';

//BarHorizontal
const barQuery = `
query BarQuery($param: String!, $year: Int!, $scenario: String!, $nextToken: String) {
  listGcamDataTableAggClass1Regions(
    filter: {
      x: {eq: $year}, 
      param: {eq: $param},
      scenario: {eq: $scenario}
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      id
      value
      x
      scenario
      param
      region
      classLabel
      class
    }
    nextToken
  }
}
`;

function DashboardGraphs({ openedScenerios, scenerioSpread, start, end, data, dataReg, dataSub, dataRegSub, selectedGuage, curYear, region, subcat, countries, setCountries }) {
  const Scenerios = openedScenerios ? openedScenerios : ["ERR", "ERR"];

  const [barData, setBarData] = useState("i");
  const [lineData, setLineData] = useState("i");
  const fetchLineData = (reg, sub) => {
    console.log(reg, sub);
    //subcat === "" ? (region === "" ? dataaggrs : dataaggs) : (region === "" ? dataaggr : data);
  }

  const fetchBarData = useCallback(async () => {
    let nextToken = null;
    let allItems = [];
    try {
      do {
        const response = await API.graphql(
          graphqlOperation(barQuery, {
            param: selectedGuage, 
            year: curYear, 
            scenario: Scenerios.at(0).title,
            nextToken
          })
        );
        const items = response.data.listGcamDataTableAggClass1Regions.items;
        allItems = allItems.concat(items);

        nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
      } while(nextToken);
      do {
        const response = await API.graphql(
          graphqlOperation(barQuery, {
            param: selectedGuage, 
            year: curYear, 
            scenario: Scenerios.at(1).title,
            nextToken
          })
        );
        const items = response.data.listGcamDataTableAggClass1Regions.items;
        allItems = allItems.concat(items);

        nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
      } while(nextToken);
      setBarData(allItems);
    } catch (error) {
      console.error(error);
  }
  }, [curYear, selectedGuage, Scenerios, barQuery, setBarData]);

  useEffect(() => {
    fetchBarData();
    console.log("UPDATE Bar Query:", barData);
  }, [curYear, selectedGuage, Scenerios, barQuery, setBarData]);

  useEffect(() => {
    fetchLineData();
    console.log("UPDATE Line Query:", lineData);
  }, [selectedGuage, curYear, region, Scenerios, setLineData]);

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
        {rawData === 'i' ? (
          "Loading Dataset..."
        ) : (
          <Line data={lineGraphReduce(rawData, selectedGuage, Scenerios, region, subcat, start, end)} unit={units} />
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
        {(csv === 'i' || csv1 === 'i' || csv2 === 'i') ? (
          "Loading Dataset..."
        ) : (
          <div className='bar-grid grid-border'>
            <BarCountryControl csv = {csv2} scenerio = {Scenerios.at(0).title} scenerio2 = {Scenerios.at(1).title} year = {curYear} className="choropleth-control"/>
            <BarHorizontal color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(0).title} />
            <BarHorizontal color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(1).title} />
          </div>
        )}
      </div>
      <div className="graph-grid-small">
        <div>{regionDisplay} {subcatDisplay} Trends</div>
        {rawData === 'i' ? (
          "Loading Dataset..."
        ) : (
          <Line data={lineGraphReduce(rawData, selectedGuage, Scenerios, region, subcat, start, end)} unit={units} />
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
        {(csv === 'i' || csv2 === 'i') ? (
          "Loading Dataset..."
        ) : (
          <div className='bar-grid grid-border'>
            <BarCountryControl csv = {csv2} scenerio = {Scenerios.at(0).title} scenerio2 = {Scenerios.at(1).title} year = {curYear} className="choropleth-control"/>
            <BarHorizontal color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(0).title} />
            <BarHorizontal color ={getBarColors(csv, Scenerios.at(0).title, curYear)} listKeys={filterSubcat(csv1)} scenerio={Scenerios.at(1).title} />
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
    curYear: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
    countries: state.barCountries,
  };
}

function mapDispatchToProps(dispatch) {
  return {
      setCountries: (color) => dispatch(setBarCountries(color)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardGraphs);