import { useEffect, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import { connect } from 'react-redux';
import { setBarCountries } from '../../components/Store';
import { getScenerio, filterRegion } from './DataManager';


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


function DataQuerries({ scenerios, start, end, parameter, year, region, subcat, setGuage, setDates, setLine, setChoropleth, setBar, setAggSub, setCountries }) {
  const scenarios = scenerios.map(obj => obj.title);


  //Query for Line
  const fetchLine = useCallback(async () => {
    let nextToken = null;
    let allItems = [];
    try {
      if (subcat === "Aggregate of Subsectors" || subcat === "class1") {
        if (region === "Global") {
          //console.log("AGGREGSUB");
          do {
            const response = await API.graphql(
              graphqlOperation(lineQueryAggRegSub, {
                param: parameter,
                scenario1: scenarios[0],
                scenario2: scenarios[1],
                nextToken
              })
            );
            const items = response.data.listGcamDataTableAggParamGlobals.items;
            allItems.push(...items)
            nextToken = response.data.listGcamDataTableAggParamGlobals.nextToken;
          } while (nextToken);
          allItems.sort((a, b) => a.x - b.x);
          console.log("Line:", allItems);
          setLine(allItems);
        }
        else {
          //console.log("AGGREG");
          do {
            const response = await API.graphql(
              graphqlOperation(lineQueryAggSub, {
                param: parameter,
                scenario1: scenarios[0],
                scenario2: scenarios[1],
                reg: region,
                nextToken
              })
            );
            const items = response.data.listGcamDataTableAggParamRegions.items;
            allItems.push(...items)
            nextToken = response.data.listGcamDataTableAggParamRegions.nextToken;
          } while (nextToken);
          allItems.sort((a, b) => a.x - b.x);
          console.log("Line:", allItems);
          setLine(allItems);
        }
      }
      else if (region === "Global") {
        //console.log("AGGSUB");
        do {
          const response = await API.graphql(
            graphqlOperation(lineQueryAggReg, {
              param: parameter,
              scenario1: scenarios[0],
              scenario2: scenarios[1],
              sub: subcat,
              nextToken
            })
          );
          const items = response.data.listGcamDataTableAggClass1Globals.items;
          allItems.push(...items)
          nextToken = response.data.listGcamDataTableAggClass1Globals.nextToken;
        } while (nextToken);
        allItems.sort((a, b) => a.x - b.x);
        console.log("Line:", allItems);
        setLine(allItems);
      }
      else {
        //console.log("NOAGG", subcat);
        do {
          const response = await API.graphql(
            graphqlOperation(lineQuery, {
              param: parameter,
              scenario1: scenarios[0],
              scenario2: scenarios[1],
              reg: region,
              sub: subcat,
              nextToken
            })
          );
          const items = response.data.listGcamDataTableAggClass1Regions.items;
          allItems = allItems.concat(items);
          nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
        } while (nextToken);
        allItems.sort((a, b) => a.x - b.x);
        console.log("Line:", allItems);
        setLine(allItems);
      }
    } catch (error) {
      console.error(error);
    }
  }, [region, subcat, scenarios, parameter, setLine]);


  //Query for Choropleth
  const fetchChoropleth = useCallback(async () => {
    let nextToken = null;
    let allItems = [];
    try {
      if (subcat === "Aggregate of Subsectors") {
        do {
          const response = await API.graphql(
            graphqlOperation(choroplethQueryAggSub, {
              param: parameter,
              date: year,
              scenario1: scenarios[0],
              scenario2: scenarios[1],
              nextToken
            })
          );
          const items = response.data.listGcamDataTableAggParamRegions.items;
          allItems.push(...items)
          nextToken = response.data.listGcamDataTableAggParamRegions.nextToken;
        } while (nextToken);
        allItems.sort((a, b) => a.x - b.x);
        console.log("Choropleth:", allItems);
        setChoropleth(allItems);
      }
      else {
        //console.log("NOAGG", subcat);
        do {
          const response = await API.graphql(
            graphqlOperation(choroplethQuery, {
              param: parameter,
              date: year,
              scenario1: scenarios[0],
              scenario2: scenarios[1],
              sub: subcat,
              nextToken
            })
          );
          const items = response.data.listGcamDataTableAggClass1Regions.items;
          allItems = allItems.concat(items);
          nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
        } while (nextToken);
        allItems.sort((a, b) => a.x - b.x);
        console.log("Choropleth:", allItems);
        setChoropleth(allItems);
      }
    } catch (error) {
      console.error(error);
    }
  }, [subcat, scenarios, parameter, year, setChoropleth]);


  //Query for Bar
  const fetchBar = useCallback(async () => {
    let nextToken = null;
    let allItems = [];

    try {
      do {
        const response = await API.graphql(
          graphqlOperation(barQuery, {
            param: parameter,
            date: year,
            scenario1: scenarios[0],
            scenario2: scenarios[1],
            nextToken
          })
        );

        const items = response.data.listGcamDataTableAggClass1Regions.items;
        allItems.push(...items)

        nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
      } while (nextToken);

      allItems.sort((a, b) => a.x - b.x);
      console.log("Bar:", allItems);
      setBar(allItems);
    } catch (error) {
      console.error(error);
    }
  }, [scenarios, parameter, year, setBar]);


  //Query for guages
  const fetchGuage = useCallback(async () => {
    let nextToken = null;
    let allItems = [];

    try {
      do {
        const response = await API.graphql(
          graphqlOperation(queryGuage, {
            start: start,
            end: end,
            scenario1: scenarios[0],
            scenario2: scenarios[1],
            nextToken
          })
        );

        const items = response.data.listGcamDataTableAggParamGlobals.items;
        allItems.push(...items)

        nextToken = response.data.listGcamDataTableAggParamGlobals.nextToken;
      } while (nextToken);

      allItems.sort((a, b) => a.x - b.x);
      console.log("Guage:", allItems);
      setGuage(allItems);
    } catch (error) {
      console.error(error);
    }
  }, [scenarios, start, end, setGuage]);
  
  //Query for dates
  const fetchDates = useCallback(async () => {
    let nextToken = null;
    let allItems = [];

    try {
      do {
        const response = await API.graphql(
          graphqlOperation(queryDates, {
            param: parameter,
            scenario1: scenarios[0],
            scenario2: scenarios[1],
            nextToken
          })
        );

        const items = response.data.listGcamDataTableAggParamGlobals.items;
        allItems.push(...items)

        nextToken = response.data.listGcamDataTableAggParamGlobals.nextToken;
      } while (nextToken);

      allItems.sort((a, b) => a.x - b.x);
      console.log("Dates:", allItems);
      setDates(allItems);
    } catch (error) {
      console.error(error);
    }
  }, [scenarios, parameter, setDates]);

  //Query for AggSub
  const fetchAggSub = useCallback(async () => {
    let nextToken = null;
    let allItems = [];

    try {
      do {
        const response = await API.graphql(
          graphqlOperation(aggSubQuery, {
            param: parameter,
            date: year,
            scenario1: scenarios[0],
            scenario2: scenarios[1],
            nextToken
          })
        );

        const items = response.data.listGcamDataTableAggParamRegions.items;
        allItems.push(...items)

        nextToken = response.data.listGcamDataTableAggParamRegions.nextToken;
      } while (nextToken);

      allItems.sort((a, b) => a.x - b.x);
      console.log("AggSub:", allItems);

      setAggSub(allItems);
      //console.log("!!", filterRegion(getScenerio(allItems, scenarios[0])));
      setCountries(filterRegion(getScenerio(allItems, scenarios[0])));
    } catch (error) {
      console.error(error);
    }
  }, [scenarios, parameter, year, setAggSub, setCountries]);


  //Line changes for different parameters, scenarios, regions and subcategories
  useEffect(() => {
    console.log("Change Line");
    console.log(scenarios, parameter, region, subcat);
    setLine("i");
    fetchLine();
  }, [scenarios, parameter, region, subcat, setLine, fetchLine]);


  //Choropleth changes for different parameters, scenarios, year, and subcategories
  useEffect(() => {
    console.log("Change Choropleth");
    console.log(scenarios, parameter, year, subcat);
    setChoropleth("i");
    fetchChoropleth();
  }, [scenarios, parameter, year, subcat, setChoropleth, fetchChoropleth]);


  //Bar Chart changes for different parameters, scenarios, and year
  useEffect(() => {
    console.log("Change Bar");
    console.log(scenarios, parameter, year);
    setBar("i");
    fetchBar();
  }, [scenarios, parameter, year, setBar, fetchBar]);


  //Guages change for different scenarios
  useEffect(() => {
    console.log("Change Guage");
    console.log(scenarios, start, end);
    setGuage("i");
    fetchGuage();
  }, [scenarios, start, end, setGuage, fetchGuage]);

  //Dates change for different parameters and scenarios
  useEffect(() => {
    console.log("Change Dates");
    console.log(scenarios, start, end);
    setDates("i");
    fetchDates();
  }, [scenarios, parameter, fetchDates]);
  
  //Aggregated Subsectors for each country
  useEffect(() => {
    console.log("Change CSV2");
    console.log(scenarios, parameter, year);
    setAggSub("i");
    fetchAggSub();
  }, [scenarios, parameter, year, setAggSub, fetchGuage, fetchAggSub]);
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