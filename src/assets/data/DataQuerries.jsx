// const DataQuerries({ open, selection, updateCurrentGuage, updateStart, updateEnd, updateScenerios, openScenerios, openGuages, updateParse, updateParseReg, updateParseSub, updateParseRegSub, curYear, setCountries }) => {    
//   //GraphQL Querries for dashboard data.
//   const queryRegSub = `
//     query MyQuery($nextToken: String) {
//       listGcamDataTableAggParamGlobals(limit: 100000, nextToken: $nextToken) {
//         items {
//           id
//           value
//           x
//           scenario
//           units
//           param
//         }
//         nextToken
//       }
//     }
//   `;
//   const querySub = `
//     query MyQuery($param: String!, $nextToken: String) {
//       listGcamDataTableAggParamRegions(filter: {param: {eq: $param}}, limit: 100000, nextToken: $nextToken) {
//         items {
//           id
//           value
//           x
//           scenario
//           param
//           region
//         }
//         nextToken
//       }
//     }
//   `;
//   const queryReg = `
//     query MyQuery($param: String!, $nextToken: String) {
//       listGcamDataTableAggClass1Globals(filter: {param: {eq: $param}}, limit: 100000, nextToken: $nextToken) {
//         items {
//           id
//           value
//           x
//           scenario
//           param
//           region
//           classLabel
//           class
//         }
//         nextToken
//       }
//     }
//   `;
//   const query = `
//     query MyQuery($param: String!, $year: Int!, $nextToken: String) {
//       listGcamDataTableAggClass1Regions(filter: {x: {eq: $year}, param: {eq: $param}}, limit: 100000, nextToken: $nextToken) {
//         items {
//           id
//           value
//           x
//           scenario
//           param
//           region
//           classLabel
//           class
//         }
//         nextToken
//       }
//     }
//   `;
  
//   //Retrieves data for all four needed categories.
//   //Raw data, Aggregate Region, Aggregate Subcategory, and Aggregate Region and Subcategory.
//   const fetchForesightRegSub = useCallback(async () => {
//     let nextToken = null;
//     let allItems = [];

//     try {
//       do {
//         const response = await API.graphql(
//           graphqlOperation(queryRegSub, {
//            nextToken
//           })
//         );
//         //console.log("PAGINATION:" + response.data.listGcamDataTableAggParamGlobals.nextToken);
//         //console.log("Foresight data reg sub response:", response.data); // Print the response data

//         const items = response.data.listGcamDataTableAggParamGlobals.items;
//         allItems = allItems.concat(items);

//         nextToken = response.data.listGcamDataTableAggParamGlobals.nextToken;
//       } while(nextToken);
      
//       allItems.sort((a,b) => a.x - b.x);
//       updateParseRegSub(allItems);
//     } catch (error) {
//       console.error(error);
//   }
//   }, [selection, queryRegSub, updateParseRegSub]);
//   const fetchForesightSub = useCallback(async () => {
//     let nextToken = null;
//     let allItems = [];

//     try {
//       do {
//         const response = await API.graphql(
//           graphqlOperation(querySub, {
//             param: selection, nextToken
//           })
//         );
//         const items = response.data.listGcamDataTableAggParamRegions.items;
//         allItems = allItems.concat(items);

//         nextToken = response.data.listGcamDataTableAggParamRegions.nextToken;
//       } while(nextToken);
      
//       allItems.sort((a,b) => a.x - b.x);
//       let countries1 = filterRegion(getDates(getScenerio(allItems, openScenerios.at(0).title), curYear));
//       let countries2 = filterRegion(getDates(getScenerio(allItems, openScenerios.at(1).title), curYear));
//       countries1 = countries1.concat(countries2);
//       setCountries([...new Set(countries1)]);
//       updateParseSub(allItems);
//     } catch (error) {
//       console.error(error);
//   }
//   }, [selection, querySub, updateParseSub]);
//   const fetchForesightReg = useCallback(async () => {
//     let nextToken = null;
//     let allItems = [];

//     try {
//       do {
//         const response = await API.graphql(
//           graphqlOperation(queryReg, {
//             param: selection, nextToken
//           })
//         );
//         //console.log("PAGINATION:" + response.data.listGcamDataTableAggClass1Globals.nextToken);
//         //console.log("Foresight data reg response:", response.data); // Print the response data

//         const items = response.data.listGcamDataTableAggClass1Globals.items;
//         allItems = allItems.concat(items);

//         nextToken = response.data.listGcamDataTableAggClass1Globals.nextToken;
//       } while(nextToken);
      
//       allItems.sort((a,b) => a.x - b.x);
//       updateParseReg(allItems);
//     } catch (error) {
//       console.error(error);
//   }
//   }, [selection, queryReg, updateParseReg]);
//   const fetchForesight = useCallback(async () => {
//     let nextToken = null;
//     let allItems = [];

//     try {
//       do {
//         const response = await API.graphql(
//           graphqlOperation(query, {
//             param: selection, year: curYear, nextToken
//           })
//         );
//         //console.log("PAGINATION:" + response.data.listGcamDataTableAggClass1Regions.nextToken);
//         //console.log("Foresight data response:", response.data); // Print the response data

//         const items = response.data.listGcamDataTableAggClass1Regions.items;
//         allItems = allItems.concat(items);

//         nextToken = response.data.listGcamDataTableAggClass1Regions.nextToken;
//       } while(nextToken);
      
//       allItems.sort((a,b) => a.x - b.x);
//       updateParse(allItems);
//     } catch (error) {
//       console.error(error);
//   }
//   }, [curYear, selection, query, updateParse]);

//   //For each change in selection, parses from AWS.
//   useEffect(() => {
//     updateParseReg("i");
//     updateParseSub("i");
//     updateParseRegSub("i");
//     fetchForesightRegSub();
//     fetchForesightSub();
//     fetchForesightReg();
//   }, [selection, updateParse, updateParseReg, updateParseSub, updateParseRegSub, fetchForesightRegSub, fetchForesightSub, fetchForesightReg, fetchForesight]);

//   useEffect(() => {
//     console.log("UPDATE QUERRY DATE:", curYear);
//     updateParse("i");
//     fetchForesight();
//   }, [curYear, selection, updateParse, updateParseReg, updateParseSub, updateParseRegSub, fetchForesightRegSub, fetchForesightSub, fetchForesightReg, fetchForesight]);
//   function mapStateToProps(state) {
//     return {
//       open: state.open,
//       selection: state.dashboardSelection,
//       openScenerios: state.scenerios,
//       openGuages: state.guages,
//       parse: state.parsedData,
//       curYear: state.dashboardYear,
//     };
//   }
  
//   function mapDispatchToProps(dispatch) {
//     return {
//       toggleOpen: () => dispatch({ type: "toggleOpen" }),
//       updateStart: (start) => dispatch(setStartDate(start)),
//       updateEnd: (end) => dispatch(setEndDate(end)),
//       updateCurrentGuage: (guage) => dispatch(setdashboardSelection(guage)),
//       updateScenerios: (index, name, scenerios) => dispatch(setScenerios(index, name, scenerios)),
//       updateParse: (data) => dispatch(setParsed(data)),
//       updateParseReg: (data) => dispatch(setParsedReg(data)),
//       updateParseSub: (data) => dispatch(setParsedSub(data)),
//       updateParseRegSub: (data) => dispatch(setParsedRegSub(data)),
//       setCountries: (color) => dispatch(setBarCountries(color)),
//     };
//   }
  
//   export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
  