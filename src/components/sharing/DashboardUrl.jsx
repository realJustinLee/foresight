import { setdashboardSelection, setStartDate, setEndDate, setScenerios } from "../Store";
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

//Ran at the beginning of loading the dashboard right from an URL. Takes items in the hash and populates
//the dashboard with them.
//export const loadHash = () => {
//Load Start Date
//if (searchParams.has("start") && parseInt(searchParams.get("start")) &&

function DashboardURL({ start, end, scenerios, parameter, year, region, subcat, updateStartDate, updateEndDate, updateParam, updateScenerios}) {
  let searchParams = new URLSearchParams(window.location.hash.substring(1));
  if(searchParams.has("start") && !isNaN(parseInt(searchParams.get("start"))) && parseInt(searchParams.get("start")) !== start)
    console.log("START:", searchParams.get("start"));
  if(searchParams.has("end") && !isNaN(parseInt(searchParams.get("start"))) && parseInt(searchParams.get("start")) !== end)
    console.log("END:", searchParams.get("end"));
  if(searchParams.has("selected"))
    console.log("SELECTED:", searchParams.get("selected"));
  if(searchParams.has("scenerios"))
    console.log("SCENERIOS:", searchParams.get("scenerios"));
  if(searchParams.has("params"))
    console.log("PARAMS:", searchParams.get("params"));
  if(searchParams.has("year"))
    console.log("YEAR:", searchParams.get("year"));
  if(searchParams.has("region"))
    console.log("REGION:", searchParams.get("region"));
  if(searchParams.has("subsector"))
    console.log("SUBSECTOR:", searchParams.get("subsector"));
}


function mapStateToProps(state) {
  return {
    start: parseInt(state.startDate),
    end: parseInt(state.endDate),
    scenerios: state.scenerios,
    parameter: state.dashboardSelection,
    year: state.dashboardYear,
    region: state.dashboardRegion,
    subcat: state.dashboardSubsector,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    updateStartDate: (start) => dispatch(setStartDate(start)),
    updateEndDate: (end) => dispatch(setEndDate(end)),
    updateParam: (guage) => dispatch(setdashboardSelection(guage)),
    updateScenerios: (index, name, scenerios) => dispatch(setScenerios(index, name, scenerios)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardURL);