export const barQuery = `
query BarQuery($param: String!, $year: Int!, $nextToken: String) {
  listGcamDataTableAggClass1Regions(
    filter: {
      x: {eq: $year}, 
      param: {eq: $param}
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

export const lineQuery = `
query BarQuery($param: String!, $reg: String!, $sub: String!, $nextToken: String) {
  listGcamDataTableAggClass1Regions(
    filter: {
      region: {eq: $reg},
      class: {eq: $sub},
      param: {eq: $param}
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
query BarQuery($param: String!, $sub: String!, $nextToken: String) {
  listGcamDataTableAggClass1Globals(
    filter: {
      class: {eq: $sub},
      param: {eq: $param}
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
query BarQuery($param: String!, $reg: String!, $nextToken: String) {
  listGcamDataTableAggParamRegions(
    filter: {
      region: {eq: $reg},
      param: {eq: $param}
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
query BarQuery($param: String!, $nextToken: String) {
  listGcamDataTableAggParamGlobals(
    filter: {
      param: {eq: $param}
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

