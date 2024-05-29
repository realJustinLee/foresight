import { isValidDate, findClosestDate, getFirstParam, isValidParam, isValidFromObject } from "../../assets/data/DataManager";
import { setdashboardSelection, setStartDate, setEndDate, setSceneriosNoUpdate, setDashDate, setdashboardGuages } from "../Store";
import { connect } from 'react-redux';

//Updates the URL hash for single parameter hashes. Takes in the name and value of the hash.
//Does not guarentee order of placement.
export const updateHash = (name, value) => {
  var searchParams = new URLSearchParams(window.location.hash.substring(1));
  if (!searchParams.has(name))
    searchParams.append(name, value);
  else
    searchParams.set(name, value);
  window.location.hash = searchParams.toString();
}

//Updates the URL hash for a hash comprising of a list. Each element of the list must be added
//through this function and will be seperated by commas.
export const updateListHash = (name, index, value) => {
  var searchParams = new URLSearchParams(window.location.hash.substring(1));
  if (searchParams.has(name)) {
    let arr = searchParams.get(name).toString().split(",");
    arr[index] = value;
    searchParams.set(name, arr.join(","));
    window.location.hash = searchParams.toString();
  }
}

const isequal = (A, B) => {
  if(A.length !== B.length)
    return false;
  return A.every((element, index) => element === B[index]);
}

//Ran at the beginning of loading the dashboard right from an URL. Takes items in the hash and populates
//the dashboard with them.
//export const loadHash = () => {
//Load Start Date
//if (searchParams.has("start") && parseInt(searchParams.get("start")) &&

function DashboardURL({ start, end, openedScenarios, parameter, parameters, year, region, subcat, regionsList, subcategoriesList, updateStartDate, updateEndDate, updateYear, updateParam, updateParams, updateScenerios, dataDate, guageData, Scenarios }) {

  let searchParams = new URLSearchParams(window.location.hash.substring(1));

  function waitForData(data) {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (data !== "i") {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });
  }

  async function loadDates() {
    if (searchParams.has("start")) {
      let date = parseInt(searchParams.get("start"));
      await waitForData(dataDate);
      if (!isNaN(date) && date < end && isValidDate(dataDate, date)) {
        //console.log("CHANGING START:", searchParams.get("start"));
        if (date !== start)
          updateStartDate(date);
      }
      else
        updateHash("start", findClosestDate(dataDate, start));
    }
    else {
      await waitForData(dataDate);
      updateHash("start", findClosestDate(dataDate, start));
    }      
    if (searchParams.has("end")) {
      let date = parseInt(searchParams.get("end"));
      await waitForData(dataDate);
      if (!isNaN(date) && date > start && isValidDate(dataDate, date)) {
        //console.log("CHANGING END:", searchParams.get("end"));
        if (date !== end)
          updateEndDate(date);
      }
      else
        updateHash("end", findClosestDate(dataDate, end));
    }
    else {
      await waitForData(dataDate);
      updateHash("end", findClosestDate(dataDate, end));
    }      
    if (searchParams.has("year")) {
      let date = parseInt(searchParams.get("year"));
      await waitForData(dataDate);
      if (!isNaN(date) && isValidDate(dataDate, date)) {
        //console.log("CHANGING YEAR:", searchParams.get("year"));
        if (date !== year)
          updateYear(date);
      }
      else
        updateHash("year", findClosestDate(dataDate, year));
    }
    else {
      await waitForData(dataDate);
      updateHash("year", findClosestDate(dataDate, year));
    }
  }

  async function loadParams() {
    if (searchParams.has("selectedParam")) {
      let param = searchParams.get("selectedParam");
      await waitForData(guageData);
      if (isValidParam(guageData, param)) {
        //console.log("CHANGING PARAM:", searchParams.get("selectedParam"));
        if (param !== parameter)
          updateParam(param);
      }
      else
        updateHash("selectedParam", getFirstParam(guageData));
    }
    else {
      await waitForData(guageData);
      updateHash("selectedParam", getFirstParam(guageData));
    }/*
    if (searchParams.has("params")) {
      let params = searchParams.get("params").toString().split(",");
      await waitForData(guageData);
      if (isValidParams(guageData, params)) {
        //console.log("CHANGING PARAMS:", searchParams.get("selectedParam"));
        if (params.sort() !== parameters.map((item) => item.title).sort())
          updateParams(params.map(param => ({ title: param })));
      }
      else
        updateHash("displayedParams", parameters.map(item => item.title).join(","));
    }
    else {
      await waitForData(guageData);
      updateHash("displayedParams", parameters.map(item => item.title).join(","));
    }   
    */
  }

  async function loadScenarios() {
    if (searchParams.has("scenarios")) {
      let scenarioList = searchParams.get("scenarios").toString().split(",");
      if (isValidFromObject(scenarioList, Scenarios) && scenarioList.length === 2) {
        if (!isequal(scenarioList.sort(), openedScenarios.map((item) => item.title).sort())) {
          console.log("CHANGING SCENARIOS:", scenarioList.sort(), openedScenarios.map((item) => item.title).sort());
          updateScenerios(scenarioList.map(scenarioItem => ({ title: scenarioItem })));
        }
      }
      else
        updateHash("scenarios", openedScenarios.map(item => item.title).join(","));
    }
    else {
      await waitForData(guageData);
      updateHash("scenarios", openedScenarios.map(item => item.title).join(","));
    }   
  }

  loadDates();
  loadParams();
  loadScenarios();
}

function mapStateToProps(state) {
  return {
    start: parseInt(state.startDate),
    end: parseInt(state.endDate),
    openedScenarios: state.scenerios,
    parameter: state.dashboardSelection,
    parameters: state.guages,
    year: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    updateStartDate: (start) => dispatch(setStartDate(start)),
    updateEndDate: (end) => dispatch(setEndDate(end)),
    updateYear: (year) => dispatch(setDashDate(year)),
    updateParam: (guage) => dispatch(setdashboardSelection(guage)),
    updateParams: (guages) => dispatch(setdashboardGuages(guages)),
    updateScenerios: (scenarios) => dispatch(setSceneriosNoUpdate(scenarios)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardURL);