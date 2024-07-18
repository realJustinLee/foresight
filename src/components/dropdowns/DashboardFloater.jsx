import React, { useState, useEffect } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { setdashboardSelection, setDashDate, setDashReg, setDashSubs } from "../Store";
import { connect } from 'react-redux';
import { findUnitsByTitle } from "../../assets/data/DataManager";
import { DropdownButton } from "react-bootstrap";
import { getIconParam } from "../../assets/data/VariableCategories";
import { updateHash } from "../sharing/DashboardUrl";

function DashboardFloater({ updateGuage, selection, openGuages, year, region, subsector, dashDate, dashReg, dashSubs, dates, subcats, regions }) {
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
    //console.log(regions);
    function resetParams() {
        dashDate(2020);
        dashReg("Global");
        dashSubs("Aggregate of Subsectors");
        updateHash("year", 2020);
        updateHash("reg", "Global");
        updateHash("sub", "Aggregate of Subsectors");
    }

    function updateScenerio(scenerio) {
        resetParams();
        updateGuage(scenerio);
    }

    const links = openGuages.map((guage) => (
        <div key={guage ? guage.title : "Error"}>
            <Dropdown.Item as="button" active={guage ? (selection === guage.title ? true : false) : false}
                onClick={() => guage ? updateScenerio(guage ? guage.title : "Error") : ""}>
                {guage ? guage.units : "Error"}
            </Dropdown.Item>
        </div >
    ))

    let uniqueDates = dates != "i" ? new Set(dates.map(obj => obj.x)) : "i";
    let uniqueRegions = regions != "i" ? new Set(regions) : "i";
    let uniqueSubcats = subcats != "i" ? new Set(subcats) : "i";
    if (uniqueRegions != "i")
        uniqueRegions.add("Global");
    if (uniqueSubcats != "i")
        uniqueSubcats.add("Aggregate of Subsectors");
    //console.log(uniqueDates, uniqueRegions, uniqueSubcats);

    const date_links = (uniqueDates && uniqueDates !== "i") ? Array.from(uniqueDates).map((date) => (
        <div key={date}>
            <Dropdown.Item as="button" active={year === date ? true : false}
                onClick={() => dashDate(date)}>
                {date}
            </Dropdown.Item>
        </div >
    )) : <div></div>

    const region_links = uniqueRegions !== "i" ? Array.from(uniqueRegions).map((listedRegion) => (
        (listedRegion && listedRegion !== "global") ? (<div key={listedRegion}>
            <Dropdown.Item as="button" active={region === listedRegion ? true : false}
                onClick={() => dashReg(listedRegion)}>
                {listedRegion}
            </Dropdown.Item>
        </div >) : <div></div>
    )) : <div></div>

    //console.log(uniqueSubcats)
    const subcat_links = uniqueSubcats !== "i" ? Array.from(uniqueSubcats).map((listedSubcat) => (
        (listedSubcat && listedSubcat !== "class1") ? (<div key={listedSubcat}>
            <Dropdown.Item as="button" active={subsector === listedSubcat ? true : false}
                onClick={() => dashSubs(listedSubcat)}>
                {listedSubcat.charAt(0).toUpperCase() + listedSubcat.slice(1).trim()}
            </Dropdown.Item>
        </div >) : <div></div>
    )) : <div></div>
    return (
        <>
            <div title="Change selected data variable">
                SELECTED:    {findUnitsByTitle(openGuages, selection).toUpperCase()}   {<div className='floater-icon'>{getIconParam(selection, openGuages)}</div>}
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
            {(width >= 875) ? (
                <div title="Change selected year, region, and subsector">
                    <DropdownButton variant="outline-light" className="dashboard-scenerio-button dashboard-floater-button" title={"Year: " + year}>
                        {date_links}
                    </DropdownButton>
                    <DropdownButton variant="outline-light" className="dashboard-scenerio-button dashboard-floater-button" title={"Region: " + region}>
                        {region_links}
                    </DropdownButton>
                    <DropdownButton variant="outline-light" className="dashboard-scenerio-button dashboard-floater-button" title={"Subsector: " + subsector.trim()}>
                        {subcat_links}
                    </DropdownButton>
                    <Button
                        title="Reset all data selections"
                        className="floater-button"
                        variant="danger"
                        onClick={() => resetParams()}>
                        Reset
                    </Button>
                </div>
            ) : (
                <>
                    <div title="Change selected year">
                        <DropdownButton variant="outline-light" className="dashboard-scenerio-button dashboard-floater-button" title={"Year: " + year}>
                            {date_links}
                        </DropdownButton>
                    </div>
                    <div title="Change selected region">
                        <DropdownButton variant="outline-light" className="dashboard-scenerio-button dashboard-floater-button" title={"Region: " + region}>
                            {region_links}
                        </DropdownButton>
                    </div>
                    <div title="Change selected subsector">
                        <DropdownButton variant="outline-light" className="dashboard-scenerio-button dashboard-floater-button" title={"Subsector: " + subsector.trim()}>
                            {subcat_links}
                        </DropdownButton>
                    </div>
                    <Button
                        title="Reset all data selections"
                        className="floater-button reset-button"
                        variant="danger"
                        onClick={() => resetParams()}>
                        Reset
                    </Button>
                </>
            )}
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