import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import SidebarDashboard from "./SidebarDashboard.jsx";
import Sankey from "./charts/Sankey";
import MapPoint from "./maps/MapPoint";
import ScenerioGuage from "./guages/ScenerioGuage.jsx";

const countryData = [
  {
    name: "Canada",
    lat: 56.1304,
    lon: -106.3468,
  },
  {
    name: "India",
    lat: 20.5937,
    lon: 78.9629,
  },
  {
    name: "USA",
    lat: 37.0902,
    lon: -95.7129,
  },
  {
    name: "EU",
    lat: 51.1657,
    lon: 10.4515,
  },
  {
    name: "Brazil",
    lat: -14.235,
    lon: -51.9253,
  },
];

/**
 * Test component. A subdashboard that will be accessed through the 
 * dashboard sidebar. Currently in development but will be renamed
 * in alter versions.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.open - State indicating if the sidebar is open.
 * @returns {ReactElement} The rendered component.
 */
function Test({ open }) {
  return (
    <div className="body-page">
      <SidebarDashboard />
      <div className={open ? "dashboard" : "dashboardClosed"}>
        <Container fluid>
          <Row className="row">
            <ScenerioGuage
              guageText={'chart_test'}
              guageValue={60}
            />
          </Row>
          <Row className="row">
            <Col>
              <MapPoint width={"60vw"} height={"50vh"} data={countryData} />
            </Col>
          </Row>
          <Row className="row">
            <Col>
              <Sankey width={"60vw"} height={"50vh"} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

/**
 * Maps the state from the Redux store to the component props.
 * 
 * @param {Object} state - The current state.
 * @returns {Object} The mapped props.
 */
function mapStateToProps(state) {
  return {
    open: state.open,
  };
}

export default connect(mapStateToProps)(Test);
