import { findClosestDateAllParamsAbove, getUnits } from "../data/DataManager";
import { datasets } from "../data/Scenarios";

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

// const isequal = (A, B) => {
//   if (A.length !== B.length)
//     return false;
//   return A.every((element, index) => element === B[index]);
// }

// loadDataURL is called everytime the dashboard reloads, whether it is on the first load, or if it is switching datasets.
// This recieves the data from the dashboardQuery from the DataManager and uses this data to generate the date, scenerio,
// and guage settings for the dashboard. The functionality is different on the first load, as when the urlLoaded parameter
// is false, which only happens on the first load, loadDataURL will search for URL values and replace the default parameters
// if these URL values are valid. This functions as the only URL loading function for the dashboard.
export const loadDataURL = (result, setAllScenarios, setScenariosTotal, setGuagesTotal, setGuagesCurrent, setGuageSelected, setStart, setEnd, setCurrentDate, urlLoaded, toggleURLLoaded, updateDataset, datasetList, dataset) => {
  //Check and handle selected dataset. URL reset if dataset not currently loaded.
  checkDatasetURL(urlLoaded, updateDataset, datasetList, dataset);
  //Prepare total scenarios
  const scenarios = [...new Set(datasets.find(obj => obj.dataset === dataset).scenarios)];
  //console.log(scenarios);
  scenarios.sort();
  //console.log("STORE SCENARIOS:", scenarios);
  setAllScenarios(scenarios.map(obj => ({ title: obj })));

  //Prepare opened scenarios
  const currentScenarios = checkScenarioURL(urlLoaded, scenarios);
  //console.log("STORE CURRENT SCENARIOS:", currentScenarios);
  setScenariosTotal(currentScenarios);

  const params = [...new Set(result.map(item => item.param))];
  const guages = params.map((guage) => {
    let units = getUnits(result, guage);
    units = units.slice(0, units.indexOf("(")).trim();
    return { title: guage, units: datasets.find(obj => obj.dataset === dataset).params[guage] ? datasets.find(obj => obj.dataset === dataset).params[guage].units : units , group: datasets.find(obj => obj.dataset === dataset).params[guage] ? datasets.find(obj => obj.dataset === dataset).params[guage].group : "other" }
  });
  //console.log("STORE ALL GUAGES:", guages);
  setGuagesTotal(guages);
  // Prepare opened guages
  const currentGuages = [];
  //console.log(datasets.find(obj => obj.dataset === dataset))
  datasets.find(obj => obj.dataset === dataset).defaults.forEach(defaultGuage => currentGuages.push(guages.filter(guage => guage ? guage.title === defaultGuage : false)[0]));
  //console.log("STORE CURRENT GUAGES:", currentGuages);
  setGuagesCurrent(checkParamURL(urlLoaded, guages, currentGuages));
  // Prepared selected guage
  //console.log(urlLoaded, currentGuages);
  const selectedGuage = checkGuageURL(urlLoaded, currentGuages, "selectedParam");
  //console.log("STORE SELECTED GUAGE:", selectedGuage);
  setGuageSelected(selectedGuage);

  const start = checkDateURL(urlLoaded, result, params, "start", 2015);
  const end = checkDateURL(urlLoaded, result, params, "end", 2100);
  const dashboardDate = checkDateURL(urlLoaded, result, params, "year", 2020);
  //console.log("START DATE:", start);
  setStart(start);
  //console.log("END DATE:", end);
  setEnd(end);
  //console.log("DASHBOARD DATE:", dashboardDate);
  setCurrentDate(dashboardDate);
  if (!urlLoaded)
    toggleURLLoaded();
}

const checkDatasetURL = (urlLoaded, updateDataset, datasetList, dataset) => {
  let searchParams = new URLSearchParams(window.location.hash.substring(1));
  if (!urlLoaded && searchParams.has("dataset")) {
    if(datasets.includes(searchParams.get("dataset").toString()) || datasetList.includes(searchParams.get("dataset").toString()))
      updateDataset(searchParams.get("dataset").toString());
    else {
      window.location.hash = "";
    }
  }
  else
    updateHash("dataset", dataset);
}

const checkScenarioURL = (urlLoaded, scenarios) => {
  if (scenarios.length < 2) return "Error: Not Enough Scenarios in this Dataset to load in the Dashboard.";
  let searchParams = new URLSearchParams(window.location.hash.substring(1));
  let scenarioList = scenarios.filter(scenario => scenario === 'GCAM_SSP2' || scenario === 'GCAM_SSP3').length === 2 ? scenarios.filter(scenario => scenario === 'GCAM_SSP2' || scenario === 'GCAM_SSP3') : scenarios.slice(0, 2);
  let scenarioOutput = [];
  if (!urlLoaded && searchParams.has("scenarios") && searchParams.get("scenarios").toString().split(",").every((scenario) => scenarios.includes(scenario)))
    scenarioList = searchParams.get("scenarios").toString().split(",");
  else
    updateHash("scenarios", scenarios.filter(scenario => scenario === 'GCAM_SSP2' || scenario === 'GCAM_SSP3').length === 2 ? scenarios.filter(scenario => scenario === 'GCAM_SSP2' || scenario === 'GCAM_SSP3').toString() : scenarios.slice(0, 2).toString());
  if (scenarioList.length < 2) return "Error: Scenarios not loaded.";
  scenarioList.forEach((scenario, index) => {
    scenarioOutput.push({ title: scenario, pos: index + 1 });
  });
  //console.log(scenarioOutput);
  return scenarioOutput;
}

const checkParamURL = (urlLoaded, params, guages) => {
  if (!params || params.length < 1 || !guages || guages.length < 1 || !guages.at(0).title) return "Error: Not Enough Params in this Dataset to load in the Dashboard.";
  //let searchParams = new URLSearchParams(window.location.hash.substring(1));
  let paramList = guages;
  let scenarioOutput = [];
  //console.log(searchParams.get("params").toString().split(","), params);
  // if (!urlLoaded && searchParams.has("params") && searchParams.get("params").toString().split(",").every((guage) => params ? params.map(param => param ? param.title : "error").includes(guage) : false))
  //   paramList = [... new Set(searchParams.get("params").toString().split(","))].map(title => params ? params.find(param => param.title === title) : "error");
  // else
  //  updateHash("params", guages.map(guage => guage.title).toString());
  if (paramList.length < 1 || paramList.length > 6) return "Error: Params not loaded correctly.";
  paramList.forEach((guage) => {
    scenarioOutput.push(guage);
  });
  return scenarioOutput;
}

const checkGuageURL = (urlLoaded, guageData, title) => {
  let searchParams = new URLSearchParams(window.location.hash.substring(1));
  let guageList = guageData ? guageData.map(guage => guage ? guage.title : "") : [];
  if (!urlLoaded && searchParams.has(title) && guageList.includes(searchParams.get(title)))
    return searchParams.get(title);
  if (guageList.length > 0) {
    updateHash(title, guageList[0]);
    return guageList[0];
  }
  return "Error: Data Variables not loaded.";
}

const checkDateURL = (urlLoaded, dataDate, params, title, def) => {
  let searchParams = new URLSearchParams(window.location.hash.substring(1));
  if (!urlLoaded && searchParams.has(title) && parseInt(searchParams.get(title)))
    return findClosestDateAllParamsAbove(dataDate, params, parseInt(searchParams.get(title)));
  updateHash(title, findClosestDateAllParamsAbove(dataDate, params, def));
  return findClosestDateAllParamsAbove(dataDate, params, def);
}