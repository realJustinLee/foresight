import { createStore } from 'redux';
import {updateHash} from './sharing/DashboardUrl';
// Define the initial state
const initialState = {
  open: 2,
  urlLoaded: false,
  dataset: "gcamv7p0",
  startDate: 2015,
  endDate: 2100,
  dashboardSelection: "watWithdrawBySec",
  dashboardYear: 2020,
  dashboardRegion: "Global",
  dashboardSubsector: "Aggregate of Subsectors",
  barCountries: [],
  scenerios: [
    {
      title: "GCAM_SSP2",
      pos: 1,
    },
    {
      title: "GCAM_SSP3",
      pos: 2,
    }
  ],
  guages: [
    {
      title: "pop",
      units: "Population",
      group: "population"
    },
    {
      title: "gdp",
      units: "GDP (MER)",
      group: "socioeconomics"
    },
    {
      title: "watWithdrawBySec",
      units: "Water Withdrawal by Sector",
      group: "water"
    },
    {
      title: "agProdByCrop",
      units: "Agriculture Production",
      group: "agriculture"
    },
    {
      title: "energyPrimaryByFuelEJ",
      units: "Energy Primary by Fuel",
      group: "energy"
    },
    {
      title: "emissCO2BySector",
      units: "CO2 emissions",
      group: "emissions"
    }
  ]
};

// Define a reducer function to update the state
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'dashboardSelection':
      return { ...state, dashboardSelection: action.payload };
    case 'toggleOpen':
      return { ...state, open: state.open === 1 ? 0 : 1 };
    case 'toggleURLLoaded':
      return { ...state, urlLoaded: !state.urlLoaded};
    case 'setOpen':
      return { ...state, open: action.payload };
    case 'setDataset':
      return { ...state, dataset: action.payload };
    case 'setStartDate':
      return { ...state, startDate: action.payload };
    case 'setEndDate':
      return { ...state, endDate: action.payload };
    case 'setScenerios':
      return { ...state, scenerios: action.payload };
    case 'setGuages':
      return { ...state, guages: action.payload };
    case 'setDataLine':
      return { ...state, parsedDataLine: action.payload };
    case 'setDashYear':
      return { ...state, dashboardYear: action.payload };
    case 'setDashRegions':
      return { ...state, dashboardRegion: action.payload };
    case 'setDashSubsectors':
      return { ...state, dashboardSubsector: action.payload };
    case 'setBarCountries':
      return { ...state, barCountries: action.payload };
    default:
      return state;
  }
}
// Update Dashboard Parameters
export function setdashboardGraphParams(date, region, subsector) {
  //updateHash("dashdate", date);
  //updateHash("dashreg", region);
  //updateHash("dashsub", subsector);
  setDashReg(region);
  setDashSubs(subsector);
  return { type: 'setDashYear', payload: date };
}

export function setDashDate(date) {
  updateHash("year", date);
  return { type: 'setDashYear', payload: date };
}

export function setOpen(open) {
  return { type: 'setOpen', payload: open };
}

export function setDashReg(region) {
  return { type: 'setDashRegions', payload: region };
}

export function setDashSubs(subsector) {
  return { type: 'setDashSubsectors', payload: subsector };
}
// Change currently selected guage
export function setdashboardSelection(param) {
  updateHash("selectedParam", param);
  return { type: 'dashboardSelection', payload: param };
}

export function setdashboardGuages(guages) {
  //updateHash("selected", num);
  return { type: 'setGuages', payload: guages };
}

// Action creator function to update the dataset
export function setDataset(dataset) {
  return { type: 'setDataset', payload: dataset };
}

// Change dashboard start date
export function setStartDate(date) {
  updateHash("start", date);
  return { type: 'setStartDate', payload: date };
}

// Change dashboard end date
export function setEndDate(date) {
  updateHash("end", date);
  return { type: 'setEndDate', payload: date };
}

// Change dashboard scenerios array
export function setScenerios(index, newTitle, scenerios) {
  return { type: 'setScenerios', payload: scenerios };
}

export function setSceneriosNoUpdate(scenerios) {
  return { type: 'setScenerios', payload: scenerios };
}

export function setBarCountries(country) {
  return { type: 'setBarCountries', payload: country };
}

// Create the Redux store
const store = createStore(reducer);

export default store;