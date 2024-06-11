import React, { useState } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";
import Papa from "papaparse";
import './css/DataUpload.css';
import { setDatasets, setUserUploadedData } from "./Store";
import { connect } from "react-redux";

function UploadData({datasets, updateDatasets, userUploadedData, loadDataToStore}) {
  const [dataset_name, setInput1] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  //Uploading Data
  const submitData = () => {
    // Update Datasets
    let datasetList = [... datasets];
    datasetList.push(dataset_name)
    updateDatasets(datasetList)
    
    // Get ready to write data
    let newData = {};

    // Debug Data
    //console.log("Got Data:", file);
    // List of Scenarios
    const uniqueScenarios = [...new Set(file.map(item => item.scenario).filter(item => item !== undefined))];
    newData.scenarios = uniqueScenarios;
    //console.log('Unique Scenarios:', uniqueScenarios);

    // List of Regions
    const uniqueRegions = [...new Set(file.map(item => item.region).filter(item => item !== undefined))];
    newData.regions = uniqueRegions;
    //console.log('Unique Regions:', uniqueRegions);

    // List of Parameters
    const uniqueParams = [...new Set(file.map(item => item.param).filter(item => item !== undefined))];
    newData.parameters = uniqueParams;
    //console.log('Unique Params:', uniqueParams);

    // 4. aggClass1_global
    const aggClass1_global = Object.values(file.reduce((acc, item) => {
      const key = item.scenario + '-' + item.param + '-' + item.x + '-' + item.class;
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].region = "global"
        acc[key].value = parseFloat(acc[key].value) + parseFloat(item.value);
      }
      return acc;
    }, {}));
    //console.log('Aggregate by Scenario, Param, X, Class:', aggClass1_global);
    newData.aggClass1_global = aggClass1_global;

    // 5. aggParam_global
    const aggParam_regions = Object.values(file.reduce((acc, item) => {
      const key = item.scenario + '-' + item.param + '-' + item.x + '-' + item.region;
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].value = parseFloat(acc[key].value) + parseFloat(item.value);
      }
      return acc;
    }, {}));
    //console.log('Aggregate by Scenario, Param, X, Region:', aggParam_global);
    newData.aggParam_regions = aggParam_regions;

    // 6. aggParam_region
    const aggParam_global = Object.values(file.reduce((acc, item) => {
      const key = item.scenario + '-' + item.param + '-' + item.x;
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].region = "global"
        acc[key].value = parseFloat(acc[key].value) + parseFloat(item.value);
      }
      return acc;
    }, {}));
    //console.log('Aggregate by Scenario, Param, X:', aggregateByScenarioParamX);
    newData.aggParam_global = aggParam_global;
    console.log(newData)

    // 7. aggClass1_region
    newData.aggClass1_regions = file;
    let newDataArray = structuredClone(userUploadedData);
    newDataArray[dataset_name] = newData;
    loadDataToStore(newDataArray);
  }

  const handleInputChange = (e, setInput) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9-]*$/;
    if (regex.test(value) && !datasets.includes(value)) {
      setInput(value);
    }
  };

  const handleFileChange = (e) => {
    setInput1(e.target.files[0].name.replace(".csv", ""));
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      Papa.parse(uploadedFile, {
        header: true,
        complete: (result) => {
          let error = validateCSV(result.data);
          if (error === "") {
            setFile(result.data.slice(0, -1));
            setFileError('');
          } else {
            setFile(null);
            setFileError("Invalid CSV format. Please ensure the file has the column " + error + ".");
          }
        },
        error: (error) => {
          setFile(null);
          setFileError('Error parsing CSV file: ' + error.message);
        }
      });
    }
  };

  const validateCSV = (data) => {
    let error = []
    const requiredColumns = ['scenario', 'param', 'x', 'value', 'region', 'class', 'units'];
    if (data.length === 0) return requiredColumns.toString();
    const keys = Object.keys(data[0]);
    requiredColumns.forEach((requirement) => {
      if (!keys.includes(requirement)) {
        error.push(requirement);
      }
    })
    return error.toString();
  };

  return (
    <div className="body-page-dark page-text-dark data-upload-page">
      <Container>
        <Row>
          <h1 className="page-title page-text-dark">Upload Data</h1>
          <hr className="about-home-hr" />
          <div className="page-subtitle page-text-dark">
            Upload your Data to the Foresight Dashboard.
          </div>
        </Row>
        <hr className="about-home-hr lower-hr" />
        <Row className="data-black-info-box title-info-gap">
          <div className="page-text">
            <div className="data-text-thick">
              Data Requirements:
            </div>
            <ul className="text-left">
              <li>Must be in CSV format.</li>
              <li>
                Must have the following columns in the given format:
                <ul>
                  <li>Scenario (String)</li>
                  <li>Param (String) - Data Variable</li>
                  <li>X (Integer) - Date</li>
                  <li>Value (Integer or Float)</li>
                  <li>Region (String)</li>
                  <li>Class (String)</li>
                  <li>Units (String)</li>
                </ul>
              </li>
              <li>All values must be in the proper units with no NaN values.</li>
            </ul>
          </div>
        </Row>
        <Row className="title-info-gap">
          <Form>
            <Form.Group>
              <Form.Label>Upload CSV</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              {fileError && <p className="text-danger">{fileError}</p>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Dataset Name</Form.Label>
              <Form.Control
                type="text"
                value={dataset_name}
                onChange={(e) => handleInputChange(e, setInput1)}
                placeholder="Only Letters, Numbers, and Dashes allowed"
                disabled={!file}
              />
            </Form.Group>
            <Button onClick={() => submitData()} disabled={!dataset_name}>Submit</Button>
          </Form>
        </Row>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    datasets: state.datasets,
    userUploadedData: state.userUploadedData,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateDatasets: (datasets) => dispatch(setDatasets(datasets)),
    loadDataToStore: (data) => dispatch(setUserUploadedData(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadData);