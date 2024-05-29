import React, { useState, useEffect } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { setdashboardSelection, setDashDate, setDashReg, setDashSubs } from "../Store";
import { connect } from 'react-redux';
import { getIcon } from "../Dashboard";
import { findUnitsByTitle } from "../../assets/data/DataManager";

function DashboardFloater({ updateGuage, selection, openGuages, year, region, subsector, dashDate, dashReg, dashSubs }) {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function resetParams() {
        dashDate(2020);
        dashReg("Global");
        dashSubs("Aggregate of Subsectors");
    }

    function updateScenerio(scenerio) {
        resetParams();
        updateGuage(scenerio);
    }

    const links = openGuages.map((guage) => (
        <div key={guage.title}>
            <Dropdown.Item as="button" active={selection === guage.title ? true : false}
                onClick={() => updateScenerio(guage.title)}>
                {guage.units}
            </Dropdown.Item>
        </div >
    ))

    return (
        <>
            <div>
                SELECTED:    { findUnitsByTitle(openGuages, selection).toUpperCase()}   {getIcon(selection)}
                <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                        split
                        variant="outline-warning"
                        id="dropdown-split-basic"
                    />
                    <Dropdown.Menu>
                        {links}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            {(width >= 740) ? (
                <div>
                    Year: {year}     Region: {region}     Subsector: {subsector.charAt(0).toUpperCase() + subsector.slice(1)}
                    <Button
                        className="floater-button"
                        variant="danger"
                        onClick={() => resetParams()}>
                        Reset
                    </Button>
                </div>
            ) : ((width >= 660) ? (
                <>
                    <div>
                        Year: {year}     Region: {region}     Subsector: {subsector.charAt(0).toUpperCase() + subsector.slice(1)}
                    </div>
                    <Button
                        className="floater-button reset-button"
                        variant="danger"
                        onClick={() => resetParams()}>
                        Reset
                    </Button>
                </>
            ) : (
                <>
                    <div>
                        Year: {year}
                    </div>
                    <div>
                        Region: {region}
                    </div>
                    <div>
                        Subsector: {subsector.charAt(0).toUpperCase() + subsector.slice(1)}
                    </div>
                    <Button
                        className="floater-button reset-button"
                        variant="danger"
                        onClick={() => resetParams()}>
                        Reset
                    </Button>
                </>
            ))}
        </>
    );
}
function mapDispatchToProps(dispatch) {
    return {
        updateGuage: (newSelectedGuage) => dispatch(setdashboardSelection(newSelectedGuage)),
        dashDate: (date) => dispatch(setDashDate(date)),
        dashReg: (date) => dispatch(setDashReg(date)),
        dashSubs: (date) => dispatch(setDashSubs(date))
    };
}

function mapStateToProps(state) {
    return {
        selection: state.dashboardSelection,
        openGuages: state.guages,
        year: state.dashboardYear,
        region: state.dashboardRegion,
        subsector: state.dashboardSubsector,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardFloater);