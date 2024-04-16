// getParam is a filtering fucntion that removes all entries
// in a dataset without the specified param. Two inputs are given,
// the dataset to modify and the param to filter by. The modified
// dataset is returned.
export const getParam = (data, param) => data.filter(item => item.param === param);

// getSubcat filters a dataset by subcategory. Two inputs are given,
// the dataset to modify and the subcat to filter by. The modified
// dataset is returned.
export const getSubcat = (data, subcat) => data.filter(item => item.class === subcat);

// getRegion filters a dataset by region. Two inputs are given,
// the dataset to modify and the region to filter by. The modified
// dataset is returned.
export const getRegion = (data, region) => data.filter(item => item.region === region);

// getRegion filters a dataset by scenerio. Two inputs are given,
// the dataset to modify and the scenerio to filter by. The modified
// dataset is returned.
export const getScenerio = (data, scenario) => data.filter(item => item.scenario === scenario);

//Gets the units of a parameter for dashboard display
export const getUnits = (data, param) => {
    const item = data.find(item => item.param === param);
    if(item) {
        return item.units;
    }
    return "";
}

// filterDateRange filters a dataset between two provided dates. Three inputs
// are given, the dataset to modify and the dates to filter by. This is used for guages.
export const filterDateRange = (data, start, end) => data.filter(item => item.x >= start && item.x <= end);

// isValidDate takes in a year and determines if it is a valid date for the parameter in the dataset.
// This is uesed in DashboardDate to grey out dates not available in the dataset.
export const isValidDate = (data, date) => data.some(item => item.x === date);

//Returns the first date in the Dataset. Used for default dateranges in the dashboard.
export const getFirstDate = (data) => new Date(data[0]?.x || 0);

//Returns the last date in the Dataset. Used for default dateranges in the dashboard.
export const getLastDate = (data) => new Date(data[data.length - 1]?.x || 0);

export const getDataDate = (data, scenario, param, date) => {
    const item = data.find(row => row.x === parseInt(date) && row.scenario === scenario && row.param === param);
    return item ? item.value : 0;
}

//Finds the closest date to the selected date in the dataset if there is no index with the specified date.
export const findClosestDate = (data, targetDate) => {
    const closest = data.reduce((prev, curr) => {
        return (Math.abs(curr.x - targetDate) < Math.abs(prev.x - targetDate)) ? curr : prev;
    });
    return closest ? closest.x : -1
}

// Gets the percentage for guages
export const getGuage = (data, scenario, param, start, end) => {
    const reducedData = data.filter(row => row.scenario === scenario && row.param === param);
    const startData = getDataDate(reducedData, scenario, param, findClosestDate(reducedData, start));
    const endData = getDataDate(reducedData, scenario, param, findClosestDate(reducedData, end));
    const change = startData !== 0 ? ((endData - startData)/startData)*100 : -1;
    //console.log("START: " + start, "END: " + end, "REV START: " + findClosestDate(reducedData, start), "REV END: " + findClosestDate(reducedData, end));
    //console.log("START DATA: " + startData, "END DATA: " + endData);
    //console.log("MATH DATA: " + change);
    return Math.round(change);
}

// Gets value selected for display
export const getDataset = (data, dataaggr, dataaggs, dataaggrs, date, region, subcat) => {
    return subcat === "" ? (region === "" ? dataaggrs : dataaggs) : (region === "" ? dataaggr : data);
}

// Gets the individual value from the dtat given the date, region, subcat, and scenerio.
export const getDataPoint = (datad, dataaggr, dataaggs, dataaggrs, date, region, subcat, scenario) => {
    let data = getDataset(datad, dataaggr, dataaggs, dataaggrs, date, region, subcat);
    let item = data.find(row => row.x === date && row.scenario === scenario && (region === "" || row.region === region) && (subcat === "" || row.subcat === subcat));
    return item ? item.value : "0";
}

// getLargestChoropleth gets the largest value from a dataset to calculate the shading
// for the Choropleth map. Takes in an already choropleth formated dataset.
export const getLargestChoropleth = (data) => data.reduce((max, item) => Math.max(max, item.value), 0);

// getSmallestChoropleth gets the smallest value from a dataset to calculate the shading
// for the Choropleth map. Takes in an already choropleth formated dataset.
export const getSmallestChoropleth = (data) => data.reduce((min, item) => Math.min(min, item.value), data[0].value);

// getChoroplethValue gets the value for a choropleth region with the id given by id.
export const getChoroplethValue = (data, id) => {
    const item = data.find(item => item.id === id);
    return item ? item.value : 0;
}

export const reduceRegion = (data, region) => {
    data.filter(item => item.region === region).sort((a,b) => a.x - b.x);
}

// getDates aggregates data by summing all data with the same region.
// This results in an output where dates are merged and data is only
// sorted by region. This is useful for charts like the bar chart where
// dates are disregarded. 
//
// NOTE: Expect this function to change as date range functionality is added.
export const getDates = (data, year) => data.filter(item => item.x.toString() === year.toString());

// filterSubcat creates a list of all subcategories for the
// data given. This data should be in the form of an already
// param filtered array.
//
// NOTE: This function may have unexpected results if params
// have not been previously filtered.
export const filterSubcat = (data) => {
    const reducedData = [...new Set(data.map(item => item.class))];
    reducedData.sort();
    return reducedData;
}

export const reduceSubcat = (data, subcat) => {
    const reducedData = data.filter(item => item.class === subcat);
    reducedData.sort((a,b) => a.x - b.x);
    return reducedData;
}

export const getRegions = (countries, data) => {
    return data.filter(item => countries.includes(item.region));
}
// filterRegion creates a list of all regions for the
// data given. This data does not be in the form of an already
// param filtered array.
export const filterRegion = (data) => {
    data.sort((a,b) => b.value - a.value);
    data = data.slice(0, 10);
    data.sort((a,b) => a.value - b.value);
    const reducedData = [...new Set(data.map(item => item.region))];
    return reducedData;
}

export const listRegions = (data) => {
    return Array.from(new Set(data.map(item => item.region)));
}

export const getNoSubcatChoropleth = (data) => {
    let reducedData = [];
    for(let i = 0; i < data.length; i++) {
        reducedData.push({
            id: data.at(i).region,
            value: data.at(i).value
        });   
    }
    return reducedData;
}

export const getBarTotal = (data, param, scenarios) => { 
    let ans = [];
    for(let i = 0; i < scenarios.length; i++) {
        ans.push({
            id: scenarios.at(i).title,
            data: getBarHorizontal(data, param)
        })
    }
    return ans;
}

export const getBarHorizontal = (countries, data, dataAgg, scenerio, param, year) => {
    let output = [];
    let barData = getDates(getScenerio(data, scenerio), year);
    let aggregates = getDates(getScenerio(dataAgg, scenerio), year);
    let subcatList = filterSubcat(barData);
    subcatList.sort()
    //console.log("SCENERIOS:", subcatList);
    let countryList = filterRegion(getRegions(countries, aggregates));
    for(let i = 0; i < countryList.length; i++) {
        let countryData = getRegion(barData, countryList[i], year);
        let obj = {
            "country": countryList[i]
        };
        for(let j = 0; j < subcatList.length; j++) {
            if(getSubcat(countryData, subcatList.at(j)).length > 0)
                obj[subcatList[j]] = parseFloat(getSubcat(countryData, subcatList.at(j)).at(0).value);
            else 
                obj[subcatList[j]] = 0;
        }
        output.push(obj);  
    }
    return output
}

export const lineGraphReduce = (data, param, scenarios, region, subcat, start, end) => 
    scenarios.map(scenario => ({
        id: scenario.title,
        data: getLineGraphReduce(getScenerio(data, scenario.title))
    }))

export const getLineGraphReduce = (data) =>
    data.map(item => ({
        x: parseFloat(item.x),
        y: item.value
    }));

export const choroplethReduce = (data, scenario, param, year) => {
    console.log(data, scenario, param, year);
    let final = getDates(getScenerio(data, scenario), year);
    return getNoSubcatChoropleth(final);
}

export const processData = (aggNone, aggReg, aggSub, aggRegSub, scenario, param, region, subcat) => {
    let data = [];
    if(region === "Global") {
        if(subcat === "Aggregate of Subsectors") {  //Agg Subcat agg Region
            data = getParam(aggRegSub, param);
        }
        else  //Agg Region no agg Subcat
            data = getSubcat(getParam(aggReg, param), subcat);
    }
    else if(subcat === "Aggregate of Subsectors") { //Agg Subcat no agg Region
        data = getRegion(getParam(aggSub, param), region);
    }
    else
        data = getSubcat(getRegion(getParam(aggNone, param), region), subcat);
    return data;
};