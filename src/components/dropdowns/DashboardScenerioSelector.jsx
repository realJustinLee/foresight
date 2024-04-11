import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { setDashDate, setDashReg, setDashSubs, setScenerios } from "../Store";
import { connect } from 'react-redux';
import ScenerioGuage from "../guages/ScenerioGuage"
import ScenerioGuageNegative from "../guages/ScenerioGuageNegative"
import Dropdown from 'react-bootstrap/Dropdown';
import { getIcon } from "../Dashboard";
import { getGuage } from '../../assets/data/DataManager';

function DashboardScenerioSelector({ curIndex, curOpen, scenerios, current, updateScenerios, guages, openGuage, update, dashDate, dashReg, dashSubs, start, end, data }) {
    const list = scenerios; //List of all possible scenerios
    const cIndex = curIndex; //Number of current row
    const cOpen = curOpen; //Currently open scenerios
    const guageLists = guages; //All open guages
    const openGuages = openGuage; //Currently selected guage category
    const updateSelect = update; //Function to update selected guage
    const [value, setValue] = useState(current); //Currently selected scenerio

    const handlePress = (scenerioTitle) => {
        setValue(scenerioTitle)
        updateScenerios(cIndex, scenerioTitle, cOpen);
    }

    function resetAndUpdate(title) {
        dashDate(2020);
        dashReg("Global");
        dashSubs("Aggregate of Subsectors");
        updateSelect(title);
    }

    //This function gets data from a current dummy set. It searches the dummy
    //set for a parameter matching the passed in scenerio and guage title.
    //If the vlaue is found it is returned. Otherwise the function returns -1.
    const getDataValue = (fieldTitle) => {
        const guageData = getGuage(data, value, fieldTitle, start, end) * 100;
        return guageData
    };

    //This function creates guages. Positive guages are created with ScenerioGuage and
    //negative values are created with ScenerioGuageNegative. Each guage asks for three
    //values, the guage if which is [GUAGE_TITLE][ROW_NUMBER] with no spaces, the text
    //to display below the guage which is given by the guage title, and the value of the
    //guage, given by the number, num.
    const guageNumber = (number, guageTitle) => {
        const num = number;
        const title = guageTitle;
        var displayTitle = guageTitle;
        if (displayTitle.length > 10)
            displayTitle = displayTitle.substring(0, 10) + "...";
        if (number < 0) {
            return (
                <>
                    <ScenerioGuageNegative
                        guageText={'' + title + cIndex}
                        guageValue={num}
                    />
                    <div className="guageText"> {getIcon(title)}  {displayTitle}</div>
                </>
            )
        }
        return (
            <>
                <ScenerioGuage
                    guageText={'' + title + cIndex}
                    guageValue={num}
                />
                <div className="guageText"> {getIcon(title)}  {displayTitle}</div>
            </>
        )
    };

    //Puts together the columns of the dashboard-grid. Triggers once per row to place the guages.
    //Takes in the current row number and title of the scenerio as parameters. Then each individual
    //guage is added using a map along the list of guages. The current selected guage is given the
    //CSS class name of guageOpen. All other guages will be styled as guageDefault. The guage is
    //created with two nested functions. The function guageNumber decides which guage to use depending
    //on if the number passed in is negative and takes in the number, row, and title of the guage for
    //guage creation. The getDataValue function retrieves the number from the current dataset.

    const getGuageCSS = (title) => {
        if (title === openGuages) {
            switch (cIndex) {
                case 0:
                    return "guageOpenTop";
                case cOpen.length - 1:
                    return "guageOpenBottom";
                default:
                    return "guageOpen";
            }
        }
        return "guageDefault";
    }

    const col = () => {
        return (
            guageLists.map((guage, index) => (
                <div className={getGuageCSS(guage.title)} key={index} onClick={() => resetAndUpdate(guage.title)}>
                    {guageNumber(getDataValue(guage.title), guage.title)}
                </div>
            ))
        )
    };

    //Maps the dropdown menu. Takes in the vector of all scenerios and creates 
    //a Dropdown.Item for each.
    const links = list.map((scenerio) => (
        <div key={scenerio.title}>
            <Dropdown.Item as="button" onClick={() => handlePress(scenerio.title)}>
                {scenerio.title}
            </Dropdown.Item>
        </div>
    ))

    return (
        <>
            <Dropdown as={ButtonGroup} className={"dashboard-scenerio-selector"}>
                <Button variant="outline-light">{value}</Button>
                <Dropdown.Toggle
                    split
                    variant="outline-warning"
                    id="dropdown-split-basic"
                />
                <Dropdown.Menu>
                    {links}
                </Dropdown.Menu>
            </Dropdown>
            {data === 'i' ? (
                "Loading Dataset..."
            ) : (col())}
        </>
    );
}

//Maps the newly selected scenerio to storage. Also takes the current index
//and the list of current open scenerios for positioning purposes.
function mapStateToProps(state) {
    return {
        start: state.startDate,
        end: state.endDate,
        data: state.parsedDataRegSub,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateScenerios: (newIndex, newTitle, openScenerio) => dispatch(setScenerios(newIndex, newTitle, openScenerio)),
        dashDate: (date) => dispatch(setDashDate(date)),
        dashReg: (reg) => dispatch(setDashReg(reg)),
        dashSubs: (sub) => dispatch(setDashSubs(sub))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScenerioSelector);