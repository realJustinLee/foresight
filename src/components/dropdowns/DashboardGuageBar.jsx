import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setdashboardSelection } from "../Store";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { setDashDate, setDashReg, setDashSubs, setScenerios } from "../Store";
import ScenerioGuage from "../guages/ScenerioGuage"
import ScenerioGuageNegative from "../guages/ScenerioGuageNegative"
import Dropdown from 'react-bootstrap/Dropdown';
import { getIcon } from "../Dashboard";
import { getGuage } from '../../assets/data/DataManager';
import { updateListHash } from '../sharing/DashboardUrl';

function DashboardGuageBar({ Scenarios, OpenScenarios, /*Parameters,*/ OpenParameters, SelectedParameter, startDate, endDate, data, updateSelection, updateScenerios, dashDate, dashReg, dashSubs, reset }) {
  const [OpenedScenarios, setValueScenario] = useState(OpenScenarios);
  const [OpenedParameters, setValueParameter] = useState(OpenParameters);


  // Maps the dropdown menu. Takes in the vector of all scenerios and creates 
  // a Dropdown.Item for each.
  const scenarioDropdownList = (index) => Scenarios.map((scenerio) => (
    <div key={scenerio.title}>
      <Dropdown.Item as="button" onClick={() => handleScenerioChange(index, scenerio.title)}>
        {scenerio.title}
      </Dropdown.Item>
    </div>
  ))


  // Handles when a dropdown selection changes the scenario. The function
  // should be given the index of the row in which the scenario is being
  // changed (Starting at 0 from top to bottom) as well as the string of
  // the new scenario.
  const handleScenerioChange = (index, scenario) => {
    reset();
    updateListHash("scenarios", index, scenario);
    OpenedScenarios.at(index).title = scenario;
    let newScenarios = [...OpenedScenarios];
    setValueScenario(newScenarios);
    updateScenerios(index, scenario, newScenarios);
  }


  // This function gets data from the dataset for the guagues. It will return the result
  // for the percent change between a start and end date from a dataset given by data for a
  // scenario. This dataset should be aggregated by region and subcategory. 
  // If the value is found it is returned. Otherwise the function returns -1.
  const getDataValue = (scenario, fieldTitle) => {
    return getGuage(data, scenario, fieldTitle, startDate, endDate);
  };


  // This function creates guages. Positive guages are created with ScenerioGuage and
  // negative values are created with ScenerioGuageNegative. Each guage asks for three
  // values, the guage if which is [GUAGE_TITLE][ROW_NUMBER] with no spaces, the text
  // to display below the guage which is given by the guage title, and the value of the
  // guage, given by the number, num.
  const guageNumber = (number, guageTitle, guageUnit, index) => {
    let displayTitle = guageUnit;
    if (displayTitle.length > 10)
      displayTitle = displayTitle.substring(0, 10) + "...";
    return (number < 0) ? (
      <>
        <ScenerioGuageNegative
          guageText={'' + guageTitle + index}
          guageValue={number}
        />
        <div className="guageText"> {getIcon(guageTitle, OpenParameters)}  {displayTitle}</div>
      </>
    ) : (
      <>
        <ScenerioGuage
          guageText={'' + guageTitle + index}
          guageValue={number}
        />
        <div className="guageText"> {getIcon(guageTitle, OpenParameters)}  {displayTitle}</div>
      </>
    )
  }


  // This returns the CSS for the guage column. If the parameter is currently selected,
  // the row will be a lighter gray.
  const getGuageCSS = (param) => param === SelectedParameter ? "guage-row-open" : "guage-row-closed";


  // This function resets and updates each selected parameter apon a new parameter being
  // chosen. 
  function resetAndUpdate(title) {
    dashDate(2020);
    dashReg("Global");
    dashSubs("Aggregate of Subsectors");
    updateSelection(title);
  }


  // Creates the first column of scenario selectors. Reads from the array of currently opened scenarios
  // from the store.
  const scenarioSelectionCol = () => {
    return (
      OpenedScenarios.map((scenario, index) => (
        <Dropdown as={ButtonGroup} key={index} className={"dashboard-scenerio-selector"}>
          <Button variant="outline-light">{scenario.title}</Button>
          <Dropdown.Toggle
            split
            variant="outline-warning"
            id="dropdown-split-basic"
          />
          <Dropdown.Menu>
            {scenarioDropdownList(index)}
          </Dropdown.Menu>
        </Dropdown>
      ))
    )
  };


  // Returns the HTML for each column of the guage dashboard. As the user can add more scenarios, the columns
  // have been changed to only take up one cell. This cell will then contain each guage layered sequentially.
  const col = () => {
    return (
      OpenedParameters.map((param, index) => (
        <div className={getGuageCSS(param.title)} key={index} onClick={() => resetAndUpdate(param.title)}>
          {row(param.title, param.units)}
        </div>
      ))
    )
  };


  // Returns the HTML for each row of the guage dashboard. With the new guage format,
  // each column now has its seperate grid for rows.
  const row = (param, units) => {
    return (
      OpenedScenarios.map((scenario, index) => (
        <div title={units} key={index}>
          {guageNumber(getDataValue(scenario.title, param), param, units, index)}
        </div>
      ))
    )
  };


  // If the dataset hasn't loaded yet, we give the user the "Loading Dataset..." message.
  return (
    <div className="dashboard-guage-grid">
      <div className="dashboard-guage-grid-columns">
        {scenarioSelectionCol()}
      </div>
      {(data === 'i' || data.length === 0) ? (
        "Loading Dataset..."
      ) : (col())}
    </div>
  );
}


function mapStateToProps(state) {
  return {
    OpenScenarios: state.scenerios,
    OpenParameters: state.guages,
    SelectedParameter: state.dashboardSelection,
    startDate: state.startDate,
    endDate: state.endDate,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    updateSelection: (openGuage) => dispatch(setdashboardSelection(openGuage)),
    updateScenerios: (newIndex, newTitle, openScenerio) => dispatch(setScenerios(newIndex, newTitle, openScenerio)),
    dashDate: (date) => dispatch(setDashDate(date)),
    dashReg: (reg) => dispatch(setDashReg(reg)),
    dashSubs: (sub) => dispatch(setDashSubs(sub))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardGuageBar);