import React, {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import SidebarDashboard from "./SidebarDashboard.jsx";
import DataQuerries from "../assets/data/DataQuerries.jsx";
import { connect } from "react-redux";
import DateDropdown from "./dropdowns/DashboardDate";
import DashboardGraphs from "./DashboardGraphs.jsx";
import { MdError, MdElectricBolt, MdGroups, MdFilterHdr, MdOutlineWindPower  } from "react-icons/md";
import { GiCorn, GiFactory, GiWaterDrop, GiCow } from "react-icons/gi";
import { TbCoins } from "react-icons/tb";
import { FaTruckMoving } from "react-icons/fa";
import { setdashboardSelection, setStartDate, setEndDate} from "./Store";
import './css/Dashboard.css';
import scenarios from "../assets/data/Scenarios.jsx";
import DashboardFloater from "./dropdowns/DashboardFloater.jsx";
import DashboardGuageBar from "./dropdowns/DashboardGuageBar.jsx";
import DashboardUrl from "./sharing/DashboardUrl.jsx";

//Gets the icon of each category by name. Shows up next to the guages and the selection.
export const getIcon = (selection, openGuages) => {
  const found = openGuages.find(gauge => gauge.title === selection);
  const guageCategory = found ? found.group : "error"

  switch (guageCategory) {
    case "socioeconomics":
      return <TbCoins />;
    case "population":
      return <MdGroups />;
    case "transport":
      return <FaTruckMoving />;
    case "water":
      return <GiWaterDrop />;
    case "agriculture":
      return <GiCorn />;
    case "livestock":
      return <GiCow />;
    case "land":
      return <MdFilterHdr />
    case "emissions":
      return <GiFactory />;
    case "electricity":
      return <MdElectricBolt />;
    case "energy":
      return <MdOutlineWindPower />;
    default:
      return <MdError />;
  }
}

function Dashboard({ open }) {  
  const [guageData, setGuageData] = useState("i");
  const [datesData, setDatesData] = useState("i");
  const [lineData, setLineData] = useState("i");
  const [choroplethData, setChoroplethData] = useState("i");
  const [barData, setBarData] = useState("i");
  const [aggSub, setAggSub] = useState("i");
  const [regionList, setRegionList] = useState("i");
  const [subcategoriesList, setSubcategoriesList] = useState("i");

  const [choroplethColorPalette, setChoroplethColorPalette] = useState("pal_green");
  const [choroplethInterpolation, setInterpolation] = useState("VALUE - LOG");

  const resetData = () => {
    setGuageData("i");
    setDatesData("i");
    setLineData("i");
    setChoroplethData("i");
    setBarData("i");
    setAggSub("i");
    setRegionList("i");
    setSubcategoriesList("i");
  }

//<DashboardScenerioRows
//Scenarios={scenarios}
///>
  return (
    <div className="body-page-dark">
      <SidebarDashboard></SidebarDashboard>
      <DashboardUrl
        dataDate = {datesData}
        guageData = {guageData}
        regionList = {regionList}
        subcategoriesList = {subcategoriesList}
        Scenarios={scenarios}
      />
      <DataQuerries 
        setGuage = {setGuageData}
        setDates = {setDatesData}
        setLine = {setLineData}
        setChoropleth = {setChoroplethData}
        setBar = {setBarData}
        setAggSub = {setAggSub}
        setRegions = {setRegionList}
        setSubcategories = {setSubcategoriesList}
      />
      <div className={open ? "dashboard" : "dashboardClosed"}>
        <Container fluid>
          <Row className="date-select-row">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
              % Change from :
            </Col>
            <Col>
              <DateDropdown
                data={datesData}
                year={2015}
                isOrNotStart={0}
              />
            </Col>
            <Col className="date-select-text" xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
              to
            </Col>
            <Col>
              <DateDropdown
                data={datesData}
                year={2100}
                isOrNotStart={1}
              />
            </Col>
          </Row>
          <DashboardGuageBar
            data={guageData}
            Scenarios={scenarios}
            reset={resetData}
          />
          <Row className="selection-divider">
            <DashboardFloater />
          </Row>
          <Row>
            <DashboardGraphs 
              lineData={lineData}
              choroplethData={choroplethData}
              barData={barData}
              aggSub={aggSub}
              guageData={guageData}
              choroplethColorPalette={choroplethColorPalette}
              setChoroplethColorPalette={setChoroplethColorPalette}
              choroplethInterpolation={choroplethInterpolation}
              setInterpolation={setInterpolation}
            />
          </Row>
        </Container>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    open: state.open,
    selection: state.dashboardSelection,
    openScenerios: state.scenerios,
    openGuages: state.guages,
    parse: state.parsedData,
    curYear: state.dashboardYear,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleOpen: () => dispatch({ type: "toggleOpen" }),
    updateStart: (start) => dispatch(setStartDate(start)),
    updateEnd: (end) => dispatch(setEndDate(end)),
    updateCurrentGuage: (guage) => dispatch(setdashboardSelection(guage)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
