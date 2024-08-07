import { useState, useEffect, useCallback } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { MdFileDownload } from 'react-icons/md';
import { datasets } from '../data/Scenarios';

export const dataDownloadQuery = `
query BarQuery($nextToken: String, $id: String!) {
  queryGcamDataTableAggClass1Regions(
    id: $id,
    limit: 100000,
    nextToken: $nextToken
  ) {
    items {
      dataset
      param
      class
      scenario
      region
      x
      value
      units
      region
    }
    nextToken
  }
}
`;


/**
 * Converts the currently displayed dataset into a csv file and downloads it.
 * 
 * @param {object} props - The component props.
 * @param {string} props.dataset - Currently selected dataset.
 * @param {object[]} props.scenarios - Array containing currently selected scenarios.
 * @param {string} props.parameter - Name of the currently selected data variable.
 * @param {object[]} props.datasetData - Dataset including all user uploaded data.
 * @returns {ReactElement} The rendered component.
 */
export default function DashboardDataDownload({ dataset, scenarios, parameter, datasetData }) {
  const fetchData = async (query, variables) => {
    let nextToken = null;
    let allItems = [];
    let retries = 5;
    let delay = 500; // initial delay of 1/2 second

    let timeout = (resolve) => setTimeout(resolve, delay);
    do {
      try {
        const response = await API.graphql(graphqlOperation(query, { ...variables, nextToken }));
        const items = response.data[Object.keys(response.data)[0]].items;
        allItems.push(...items);
        nextToken = response.data[Object.keys(response.data)[0]].nextToken;
      } catch (error) {
        if (error.errors && error.errors.some(e => e.errorType === 'DynamoDB:ProvisionedThroughputExceededException')) {
          if (retries === 0) throw new Error('Retries exhausted');
          await new Promise(resolve => timeout(resolve));
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

  const fetchDownloadableData = useCallback(async () => {
    if (dataset && scenarios !== "i" && scenarios.length > 1) {
      console.log(dataset, scenarios[0], parameter);
      const queries = [];
      queries.push([dataDownloadQuery, { id: dataset + "|" + scenarios[0].title + "|" + parameter}]);
      queries.push([dataDownloadQuery, { id: dataset + "|" + scenarios[1].title + "|" + parameter}]);
      const result = await fetchParallel(queries);
      console.log(result);
      const csv = Papa.unparse(result);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, dataset + '_data.csv');
    }
  }, [dataset, scenarios, parameter, fetchParallel]);

  const fetchUserData = () => {
    if(datasetData && Object.keys(datasetData).includes(dataset)) {
      const csv = Papa.unparse(datasetData[dataset].aggClass1_regions);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, dataset + '_data.csv');
    }
  };

  const downloadData = () => {
    if(datasets.some(e => e.dataset === dataset))
      fetchDownloadableData();
    else
    fetchUserData();
  };

  return (
    <div
      onClick={() => downloadData()}
      className="guage-button"
      title="Download Selected Data"
      style={{cursor: "pointer"}}>
      <MdFileDownload />
    </div>
  );
}