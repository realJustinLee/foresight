import { useEffect, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import { connect } from 'react-redux';
import { setBarCountries } from '../../components/Store';
import { getScenerio, filterRegion, listRegions, filterSubcat } from './DataManager';


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

function DataQuerries({ scenerios, start, end, parameter, year, region, subcat, setGuage, setDates, setLine, setChoropleth, setBar, setAggSub, setCountries, setRegions, setSubcategories }) {
  const scenarios = scenerios.map(obj => obj.title);

  const fetchData = async (query, variables) => {
    let nextToken = null;
    let allItems = [];
    do {
      const response = await API.graphql(graphqlOperation(query, { ...variables, nextToken }));
      const items = response.data[Object.keys(response.data)[0]].items;
      allItems.push(...items);
      nextToken = response.data[Object.keys(response.data)[0]].nextToken;
    } while (nextToken);
    return allItems;
  };

  const fetchParallel = useCallback(async (queries) => {
    const results = await Promise.all(queries.map(([query, variables]) => fetchData(query, variables)));
    return results.flat().sort((a, b) => a.x - b.x);
  }, []);

  const fetchLine = useCallback(async () => {
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
  }, [region, subcat, scenarios, parameter, setLine, fetchParallel]);

  const fetchChoropleth = useCallback(async () => {
    const queries = [];
    if (subcat === "Aggregate of Subsectors") {
      queries.push([choroplethQueryAggSub, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1] }]);
    } else {
      queries.push([choroplethQuery, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1], sub: subcat }]);
    }
    const result = await fetchParallel(queries);
    setChoropleth(result);
    setRegions(listRegions(result));
  }, [subcat, scenarios, parameter, year, setChoropleth, fetchParallel]);

  const fetchBar = useCallback(async () => {
    const result = await fetchParallel([[barQuery, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
    setBar(result);
  }, [scenarios, parameter, year, setBar, fetchParallel]);

  const fetchGuage = useCallback(async () => {
    const result = await fetchParallel([[queryGuage, { start, end, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
    setGuage(result);
  }, [scenarios, start, end, setGuage, fetchParallel]);

  const fetchDates = useCallback(async () => {
    const result = await fetchParallel([[queryDates, { param: parameter, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
    setDates(result);
  }, [scenarios, parameter, setDates, fetchParallel]);

  const fetchAggSub = useCallback(async () => {
    const result = await fetchParallel([[aggSubQuery, { param: parameter, date: year, scenario1: scenarios[0], scenario2: scenarios[1] }]]);
    setAggSub(result);
    setCountries(filterRegion(getScenerio(result, scenarios[0])));
  }, [scenarios, parameter, year, setAggSub, setCountries, fetchParallel]);

  const fetchAggReg = useCallback(async () => {
    const result = await fetchParallel([[aggRegQuery, { param: parameter, date: year, scenario1: scenarios[0] }]]);
    setSubcategories(filterSubcat(result));
  }, [scenarios, parameter, year, setSubcategories, fetchParallel]);

  useEffect(() => {
    const abortController = new AbortController();
    setLine("i");
    fetchLine(abortController.signal);
    return () => abortController.abort();
  }, [scenarios, parameter, region, subcat, setLine, fetchLine]);

  useEffect(() => {
    const abortController = new AbortController();
    setChoropleth("i");
    fetchChoropleth(abortController.signal);
    return () => abortController.abort();
  }, [scenarios, parameter, year, subcat, setChoropleth, fetchChoropleth]);

  useEffect(() => {
    const abortController = new AbortController();
    setBar("i");
    fetchBar(abortController.signal);
    return () => abortController.abort();
  }, [scenarios, parameter, year, setBar, fetchBar]);

  useEffect(() => {
    const abortController = new AbortController();
    setGuage("i");
    fetchGuage(abortController.signal);
    return () => abortController.abort();
  }, [scenarios, start, end, setGuage, fetchGuage]);

  useEffect(() => {
    const abortController = new AbortController();
    setDates("i");
    fetchDates(abortController.signal);
    return () => abortController.abort();
  }, [scenarios, parameter, setDates, fetchDates]);

  useEffect(() => {
    const abortController = new AbortController();
    setAggSub("i");
    fetchAggSub(abortController.signal);
    return () => abortController.abort();
  }, [scenarios, parameter, year, setAggSub, fetchAggSub]);

  useEffect(() => {
    const abortController = new AbortController();
    setSubcategories("i");
    fetchAggReg(abortController.signal);
    return () => abortController.abort();
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCountries: (countryList) => dispatch(setBarCountries(countryList)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(DataQuerries);