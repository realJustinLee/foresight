import { useState, useEffect, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import { connect } from 'react-redux';
import { setAllScenarios, setSceneriosNoUpdate, setGuageList, setdashboardGuages, setdashboardSelection, setStartDate, setEndDate, setDashDate, setBarCountries } from '../../components/Store';
import { getUnits, findClosestDateAllParamsAbove, getScenerio, filterRegion, listRegions, filterSubcat } from './DataManager';


export const lineQuery = `
query BarQuery($param: String!, $reg: String!, $sub: String!, $nextToken: String, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggClass1Regions(
    filter: {
      region: {eq: $reg},
      class: {eq: $sub},
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      value
      x
      scenario
    }
    nextToken
  }
}
`;


export const lineQueryAggReg = `
query BarQuery($param: String!, $sub: String!, $nextToken: String, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggClass1Globals(
    filter: {
      class: {eq: $sub},
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      value
      x
      scenario
    }
    nextToken
  }
}
`;


export const lineQueryAggSub = `
query BarQuery($param: String!, $reg: String!, $nextToken: String, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggParamRegions(
    filter: {
      region: {eq: $reg},
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      value
      x
      scenario
    }
    nextToken
  }
}
`;


export const lineQueryAggRegSub = `
query BarQuery($param: String!, $nextToken: String, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggParamGlobals(
    filter: {
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      value
      x
      scenario
    }
    nextToken
  }
}
`;


export const choroplethQuery = `
query BarQuery($param: String!, $nextToken: String, $scenario1: String!, $scenario2: String!, $date: Int!, $sub: String!) {
  listGcamDataTableAggClass1Regions(
    filter: {
      class: {eq: $sub},
      param: {eq: $param},
      x: {eq: $date},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      region
      value
      scenario
    }
    nextToken
  }
}
`;


export const choroplethQueryAggSub = `
query BarQuery($param: String!, $nextToken: String, $scenario1: String!, $scenario2: String!, $date: Int!) {
  listGcamDataTableAggParamRegions(
    filter: {
      param: {eq: $param},
      x: {eq: $date},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      region
      value
      scenario
    }
    nextToken
  }
}
`;


export const barQuery = `
query BarQuery($param: String!, $date: Int!, $nextToken: String, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggClass1Regions(
    filter: {
      x: {eq: $date}, 
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 50000, 
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


const queryGuage = `
query MyQuery($nextToken: String, $start: Int!, $end: Int!, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggParamGlobals(
    filter: {
      x: { in: [$start, $end] },
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000,
    nextToken: $nextToken
  ) {
    items {
      units
      value
      x
      scenario
      param
    }
    nextToken
  }
}
`

const queryDataset = `
query MyQuery($nextToken: String) {
  listGcamDataTableAggParamGlobals(
    limit: 100000,
    nextToken: $nextToken
  ) {
    items {
      units
      value
      x
      scenario
      param
    }
    nextToken
  }
}
`

const queryDates = `
query MyQuery($nextToken: String, $param: String!, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggParamGlobals(
    filter: {
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000,
    nextToken: $nextToken
  ) {
    items {
      x
    }
    nextToken
  }
}
`

export const aggSubQuery = `
query BarQuery($param: String!, $date: Int!, $nextToken: String, $scenario1: String!, $scenario2: String!) {
  listGcamDataTableAggParamRegions(
    filter: {
      x: {eq: $date}, 
      param: {eq: $param},
      scenario: { in: [$scenario1, $scenario2] }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      value
      x
      scenario
      region
    }
    nextToken
  }
}
`;

export const aggRegQuery = `
query BarQuery($param: String!, $date: Int!, $nextToken: String, $scenario1: String!) {
  listGcamDataTableAggClass1Globals(
    filter: {
      x: {eq: $date}, 
      param: {eq: $param},
      scenario: {eq: $scenario1 }
    },
    limit: 100000, 
    nextToken: $nextToken
  ) {
    items {
      class
      value
      x
      scenario
      region
    }
    nextToken
  }
}
`;


function DataQuerries({ dataset, scenerios, start, end, parameter, year, region, subcat, setGuage, setDates, setLine, setChoropleth, setBar, setAggSub, setCountries, setRegions, setSubcategories, setAllScenarios, setScenariosTotal, setGuagesTotal, setGuagesCurrent, setGuageSelected, setStart, setEnd, setCurrentDate, URLLoaded }) {

  const [scenarios, setScenarios] = useState(scenerios.map(obj => obj.title));

  useEffect(() => {
    setScenarios(scenerios.map(obj => obj.title));
  }, [scenerios]);

  useEffect(() => {
    setScenarios("i");
    fetchDashboard();
  }, [dataset])

  const fetchData = async (query, variables) => {
    let nextToken = null;
    let allItems = [];
    let retries = 5;
    let delay = 500; // initial delay of 1/2 second

    do {
      try {
        const response = await API.graphql(graphqlOperation(query, { ...variables, nextToken }));
        const items = response.data[Object.keys(response.data)[0]].items;
        allItems.push(...items);
        nextToken = response.data[Object.keys(response.data)[0]].nextToken;
      } catch (error) {
        if (error.errors && error.errors.some(e => e.errorType === 'DynamoDB:ProvisionedThroughputExceededException')) {
          if (retries === 0) throw new Error('Retries exhausted');
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
          retries -= 1;
        } else {
          throw error;
        }
      }
    } while (nextToken);
    return allItems;
  };

  const fetchParallel = useCallback(async (queries) => {
    const results = await Promise.all(queries.map(([query, variables]) => fetchData(query, variables)));
    return results.flat().sort((a, b) => a.x - b.x);
  }, []);

  const fetchDashboard = useCallback(async () => {
    const result = await fetchParallel([[queryDataset]]);
    console.log("Dashboard:", result);
    const scenarios = [...new Set(result.map(item => item.scenario))];
    //Prepare total scenarios
    console.log("STORE SCENARIOS:", scenarios);
    setAllScenarios(scenarios.map(obj => ({title: obj})));
    //Prepare opened scenarios
    const currentScenarios = [];
    const opened = scenarios.slice(0, 2);
    opened.forEach((scenario, index) => {
      currentScenarios.push({ title: scenario, pos: index + 1 });
    });
    console.log("STORE CURRENT SCENARIOS:", currentScenarios);
    setScenariosTotal(currentScenarios);

    const params = [...new Set(result.map(item => item.param))];
    const guages = params.map((guage) => {
      let units = getUnits(result, guage);
      units = units.slice(0, units.indexOf("(")).trim();
      return { title: guage, units: units, group: "water"}});
    console.log("STORE ALL GUAGES:", guages);
    setGuagesTotal(guages);
    // Prepare opened guages
    const currentGuages = guages.slice(0, 5);
    console.log("STORE CURRENT GUAGES:", currentGuages);
    setGuagesCurrent(currentGuages);
    // Prepared selected guage
    const selectedGuage = params[0];
    console.log("STORE SELECTED GUAGE:", selectedGuage);
    setGuageSelected(selectedGuage);

    const start = findClosestDateAllParamsAbove(result, params, 2015);
    const end = findClosestDateAllParamsAbove(result, params, 2100);
    const dashboardDate = findClosestDateAllParamsAbove(result, params, 2020);
    console.log("START DATE:", start);
    setStart(start);
    console.log("END DATE:", end);
    setEnd(end);
    console.log("DASHBOARD DATE:", dashboardDate);
    setCurrentDate(dashboardDate);
  }, [fetchParallel]);

  const fetchLine = useCallback(async () => {
    if (scenarios != "i") {
      const queries = [];
      if (subcat === "Aggregate of Subsectors" || subcat === "class1") {
        if (region === "Global") {
          queries.push([lineQueryAggRegSub, { param: parameter, scenario1: scenarios[0], scenario2: scenarios[1] }]);
        } else {
          queries.push([lineQueryAggSub, { param: parameter, scenario1: scenarios[0], scenario2: scenarios[1], reg: region }]);
        }
      } else if (region === "Global") {
        queries.push([lineQueryAggReg, { param: parameter, scenario1: scenarios[0], scenario2: scenarios[1], sub: subcat }]);
      } else {
        queries.push([lineQuery, { param: parameter, scenario1: scenarios[0], scenario2: scenarios[1], reg: region, sub: subcat }]);
      }
      const result = await fetchParallel(queries);
      setLine(result);
    }
  }, [region, subcat, scenarios, parameter, setLine, fetchParallel]);

  const fetchChoropleth = useCallback(async () => {
    if (scenarios != "i") {
      const queries = [];
      if (subcat === "Aggregate of Subsectors") {
        queries.push([choroplethQueryAggSub, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1] }]);
      } else {
        queries.push([choroplethQuery, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1], sub: subcat }]);
      }
      const result = await fetchParallel(queries);
      setChoropleth(result);
      setRegions(listRegions(result));
    }
  }, [subcat, scenarios, parameter, year, setChoropleth, fetchParallel]);

  const fetchBar = useCallback(async () => {
    if (scenarios != "i") {
      const result = await fetchParallel([[barQuery, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
      setBar(result);
    }
  }, [scenarios, parameter, year, setBar, fetchParallel]);

  const fetchGuage = useCallback(async () => {
    if (scenarios != "i") {
      const result = await fetchParallel([[queryGuage, { start, end, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
      setGuage(result);
    }
  }, [scenarios, start, end, setGuage, fetchParallel]);

  const fetchDates = useCallback(async () => {
    if (scenarios != "i") {
      const result = await fetchParallel([[queryDates, { param: parameter, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
      setDates(result);
    }
  }, [scenarios, parameter, setDates, fetchParallel]);

  const fetchAggSub = useCallback(async () => {
    if (scenarios != "i") {
      const result = await fetchParallel([[aggSubQuery, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
      setAggSub(result);
      setCountries(filterRegion(getScenerio(result, scenarios[0])));
    }
  }, [scenarios, parameter, year, setAggSub, setCountries, fetchParallel]);

  const fetchAggReg = useCallback(async () => {
    if (scenarios != "i") {
      const result = await fetchParallel([[aggRegQuery, { param: parameter, date: year, scenario1: scenarios[0] }]]);
      setSubcategories(filterSubcat(result));
    }
  }, [scenarios, parameter, year, setSubcategories, fetchParallel]);

  useEffect(() => {
    if (URLLoaded && scenarios != "i") {
      const abortController = new AbortController();
      setLine("i");
      fetchLine(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, parameter, region, subcat, setLine, fetchLine, URLLoaded]);

  useEffect(() => {
    if (URLLoaded && scenarios != "i") {
      const abortController = new AbortController();
      setChoropleth("i");
      fetchChoropleth(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, parameter, year, subcat, setChoropleth, fetchChoropleth, URLLoaded]);

  useEffect(() => {
    if (URLLoaded && scenarios != "i") {
      const abortController = new AbortController();
      setBar("i");
      fetchBar(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, parameter, year, setBar, fetchBar, URLLoaded]);

  useEffect(() => {
    if (scenarios != "i") {
      const abortController = new AbortController();
      setGuage("i");
      fetchGuage(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, start, end, setGuage, fetchGuage]);

  useEffect(() => {
    if (scenarios != "i") {
      const abortController = new AbortController();
      setDates("i");
      fetchDates(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, parameter, setDates, fetchDates]);

  useEffect(() => {
    if (URLLoaded && scenarios != "i") {
      const abortController = new AbortController();
      setAggSub("i");
      fetchAggSub(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, parameter, year, setAggSub, fetchAggSub, URLLoaded]);

  useEffect(() => {
    if (scenarios != "i") {
      const abortController = new AbortController();
      setSubcategories("i");
      fetchAggReg(abortController.signal);
      return () => abortController.abort();
    }
  }, [scenarios, parameter, year, setSubcategories, fetchAggReg]);
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
    dataLine: state.parsedDataLine,
    URLLoaded: state.urlLoaded
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


export default connect(mapStateToProps, mapDispatchToProps)(DataQuerries);