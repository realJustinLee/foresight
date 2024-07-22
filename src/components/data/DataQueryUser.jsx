import { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { setAllScenarios, setdashboardGuages, setdashboardSelection, setGuageList, setSceneriosNoUpdate, setStartDate, setEndDate, setDashDate, setBarCountries } from '../Store';
import { filterRegion, findClosestDateAllParamsAbove, getScenerio, listRegions } from './DataManager';
function DataQueryUser({ dataset, userUploadedData, userUploadedInfo, scenerios, setAllScenarios, setScenariosTotal, setGuagesTotal, setGuagesCurrent, setGuageSelected, setStart,
  setEnd, setCurrentDate, setDates, setLine, setChoropleth, setBar, setGuage, setAggSub, setCountries, setRegions, setSubcategories, year, region, subcat, start, end, parameter }) {
  const data = userUploadedData[dataset];
  const dataInfo = userUploadedInfo.filter(data => data.dataset === dataset)[0];

  const [scenarios, setScenarios] = useState("i");

  useEffect(() => {
    setScenarios(scenerios.map(obj => obj.title));
  }, [scenerios]);

  const setData = () => {
    console.log("i");
    //Prepare Scenarios
    //console.log(data, dataInfo, dataset);
    //console.log("STORE SCENARIOS:", dataInfo.scenarios);
    const currentScenarios = [];
    const opened = dataInfo.scenarios.filter(scenario => scenario === 'GCAM_SSP2' || scenario === 'GCAM_SSP3').length === 2 ? dataInfo.scenarios.filter(scenario => scenario === 'GCAM_SSP2' || scenario === 'GCAM_SSP3') : dataInfo.scenarios.slice(0, 2);
    //console.log(opened);
    opened.forEach((scenario, index) => {
      currentScenarios.push({ title: scenario, pos: index + 1 });
    });
    //console.log("STORE CURRENT SCENARIOS:", currentScenarios);

    setAllScenarios(dataInfo.scenarios.map(obj => ({ title: obj })));
    setScenarios(dataInfo.scenarios.map(obj => obj.title));
    setScenariosTotal(currentScenarios);


    //Prepare Guages
    const guages = Object.keys(dataInfo.params).map(param => {
      let guage = dataInfo.params[param];
      return { title: guage.title, units: guage.units, group: guage.group }
    })
    const guageNames = Object.keys(dataInfo.params);
    //console.log("STORE ALL GUAGES:", guages);
    setGuagesTotal(guages);

    const currentGuages = guages.slice(0, 5);
    //console.log("STORE CURRENT GUAGES:", currentGuages);
    setGuagesCurrent(currentGuages);

    const selectedGuage = guageNames[0];
    //console.log("STORE SELECTED GUAGE:", selectedGuage);
    setGuageSelected(selectedGuage);


    // Prepare Dates
    const start = findClosestDateAllParamsAbove(data.aggParam_global, guageNames, 2015);
    const end = findClosestDateAllParamsAbove(data.aggParam_global, guageNames, 2100);
    const dashboardDate = findClosestDateAllParamsAbove(data.aggParam_global, guageNames, 2020);
    //console.log("START DATE:", start);
    setStart(start);
    //console.log("END DATE:", end);
    setEnd(end);
    //console.log("DASHBOARD DATE:", dashboardDate);
    setCurrentDate(dashboardDate);

    // Prepare Datasets
    //console.log(dashboardDate, subcat, region)
    let lineData = [];
    if (subcat === "Aggregate of Subsectors" || subcat === "class1") {
      if (region === "Global") {
        lineData = data.aggParam_global.filter(item => item.param === selectedGuage && opened.includes(item.scenario));
      } else {
        lineData = data.aggParam_regions.filter(item => item.param === selectedGuage && opened.includes(item.scenario) && item.region === region);
      }
    } else if (region === "Global") {
      lineData = data.aggClass1_global.filter(item => item.param === selectedGuage && opened.includes(item.scenario) && item.class === subcat);
    } else {
      lineData = data.aggClass1_regions.filter(item => item.param === selectedGuage && opened.includes(item.scenario) && item.region === region && item.class === subcat);
    }
    let choroplethData = [];
    if (subcat === "Aggregate of Subsectors") {
      choroplethData = data.aggParam_regions.filter(item => item.param === selectedGuage && item.x === dashboardDate && opened.includes(item.scenario));
    } else {
      choroplethData = data.aggClass1_regions.filter(item => item.param === selectedGuage && item.x === dashboardDate && opened.includes(item.scenario) && item.class === subcat);
    }

    let barData = data.aggClass1_regions.filter(item => item.param === selectedGuage && item.x === dashboardDate && opened.includes(item.scenario));
    let guageData = data.aggParam_global.filter(item => (item.x === start || item.x === end) && opened.includes(item.scenario));
    let dateData = data.aggParam_global.filter(item => item.param === selectedGuage && opened.includes(item.scenario));
    let aggSubData = data.aggParam_regions.filter(item => item.param === selectedGuage && item.x === dashboardDate && opened.includes(item.scenario));
    let aggRegData = data.aggClass1_global.filter(item => item.param === selectedGuage && item.x === dashboardDate && item.scenario === opened[0]).map(dataValue => dataValue.class);

    lineData.sort((a, b) => a.x - b.x);
    //console.log("DATASET: LINE", lineData);
    setLine(lineData);
    //console.log("DATASET: CHOROPLETH", choroplethData);
    setChoropleth(choroplethData);
    //console.log("DATASET: REGIONS", listRegions(choroplethData));
    setRegions(listRegions(choroplethData));
    //console.log("DATASET: BAR", barData);
    setBar(barData);
    //console.log("DATASET: GUAGE", guageData);
    setGuage(guageData);
    //console.log("DATASET: DATES", dateData);
    setDates(dateData);
    //console.log("DATASET: AGGSUB", aggSubData);
    setAggSub(aggSubData);
    //console.log("DATASET: COUNTRIES", filterRegion(getScenerio(aggSubData, scenarios[0])));
    setCountries(filterRegion(getScenerio(aggSubData, currentScenarios[0].title)));
    //console.log("DATASET: AGGREG", aggRegData);
    setSubcategories(aggRegData);

  };

  useEffect(() => {
    setData();
  }, [dataset]); //Do not include setData or you must render this for every frame.

  useEffect(() => {
    setLine("i");
    let lineData = [];
    if (subcat === "Aggregate of Subsectors" || subcat === "class1") {
      if (region === "Global") {
        lineData = data.aggParam_global.filter(item => item.param === parameter && scenarios.includes(item.scenario));
      } else {
        lineData = data.aggParam_regions.filter(item => item.param === parameter && scenarios.includes(item.scenario) && item.region === region);
      }
    } else if (region === "Global") {
      lineData = data.aggClass1_global.filter(item => item.param === parameter && scenarios.includes(item.scenario) && item.class === subcat);
    } else {
      lineData = data.aggClass1_regions.filter(item => item.param === parameter && scenarios.includes(item.scenario) && item.region === region && item.class === subcat);
    }
    lineData.sort((a, b) => a.x - b.x);
    setLine(lineData);
  }, [scenarios, data, parameter, region, subcat, setLine]);

  useEffect(() => {
    setChoropleth("i");
    let choroplethData = [];
    if (subcat === "Aggregate of Subsectors") {
      choroplethData = data.aggParam_regions.filter(item => item.param === parameter && item.x.toString() === year.toString() && scenarios.includes(item.scenario));
    } else {
      choroplethData = data.aggClass1_regions.filter(item => item.param === parameter && item.x.toString() === year.toString() && scenarios.includes(item.scenario) && item.class === subcat);
    }
    //console.log(data, scenarios, parameter, year, subcat);
    setChoropleth(choroplethData);
    setRegions(listRegions(choroplethData));
  }, [scenarios, data, parameter, year, subcat, setChoropleth, setRegions]);

  useEffect(() => {
    setBar("i");
    let barData = data.aggClass1_regions.filter(item => item.param === parameter && item.x.toString() === year.toString() && scenarios.includes(item.scenario));
    setBar(barData);
  }, [scenarios, data, parameter, year, setBar]);

  useEffect(() => {
    setGuage("i");
    let guageData = data.aggParam_global.filter(item => (item.x.toString() === start.toString() || item.x.toString() === end.toString()) && scenarios.includes(item.scenario));
    setGuage(guageData);
  }, [scenarios, data, start, end, setGuage]);

  useEffect(() => {
    setDates("i");
    let dateData = data.aggParam_global.filter(item => item.param === parameter && scenarios.includes(item.scenario));
    setDates(dateData);
  }, [scenarios, data, parameter, setDates]);

  useEffect(() => {
    setAggSub("i");
    let aggSubData = data.aggParam_regions.filter(item => item.param === parameter && item.x.toString() === year.toString() && scenarios.includes(item.scenario));
    setAggSub(aggSubData);
    setCountries(filterRegion(getScenerio(aggSubData, scenarios[0])));
  }, [scenarios, data, parameter, year, setAggSub, setCountries]);

  useEffect(() => {
    setSubcategories("i");
    let aggRegData = data.aggClass1_global.filter(item => item.param === parameter && item.x.toString() === year.toString() && item.scenario === scenarios[0]).map(dataValue => dataValue.class);
    setSubcategories(aggRegData);
  }, [scenarios, data, parameter, year, setSubcategories]);
}

function mapStateToProps(state) {
  return {
    userUploadedData: state.datasetData,
    userUploadedInfo: state.datasetInfo,
    scenerios: state.scenerios,
    year: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
    start: parseInt(state.startDate),
    end: parseInt(state.endDate),
    parameter: state.dashboardSelection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setAllScenarios: (scenarios) => dispatch(setAllScenarios(scenarios)),
    setScenariosTotal: (scenarios) => dispatch(setSceneriosNoUpdate(scenarios)),
    setGuagesTotal: (guages) => dispatch(setGuageList(guages)),
    setGuagesCurrent: (guages) => dispatch(setdashboardGuages(guages)),
    setGuageSelected: (guages) => dispatch(setdashboardSelection(guages)),
    setStart: (start) => dispatch(setStartDate(start)),
    setEnd: (end) => dispatch(setEndDate(end)),
    setCurrentDate: (current) => dispatch(setDashDate(current)),
    setCountries: (countryList) => dispatch(setBarCountries(countryList)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataQueryUser);