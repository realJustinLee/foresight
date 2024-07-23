import React from "react";
import DatePicker from 'react-datepicker';
import { setStartDate, setEndDate } from "../Store";
import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/DashboardDate.css';
import { updateHash } from "../sharing/DashboardUrl";
import { isValidDate, getFirstDate, getLastDate } from "../data/DataManager";

/**
 * The datepicker component displayed at the top of the Dashboard.
 * 
 * @param {object} props - The component props.
 * @param {boolean} props.isOrNotStart - Whether the datepicker is picking 
 * the start or end date. True if start.
 * @param {(countryList: number) => any} props.updateStart - Function setting 
 * the start year.
 * @param {(countryList: number) => any} props.updateEnd - Function setting 
 * the end year.
 * @param {number} props.start - State of the currently selected start date. 
 * @param {number} props.end - State of the currently selected end date.
 * @param {object[]} props.data - Data containing all valid dates for the 
 * current selection.
 * @returns {ReactElement} The rendered component.
 */
function DashboardDate({ isOrNotStart, updateStart, updateEnd, start, end, data }) {
    const isStart = isOrNotStart
    function dateHandler(date, isStart) {
        date = checkStartDate(date, isStart);
        var selectedYear = 1;
        if (date != null)
            selectedYear = date.getFullYear();
        if (isStart === 0) {
            updateStart(selectedYear);
            updateHash("start", selectedYear);
        }
        else {
            updateEnd(selectedYear);
            updateHash("end", selectedYear);
        }
    }

    function getYear(isStart) {
        let tempDate = new Date().setFullYear(end);
        if (isStart === 0)
            tempDate = new Date().setFullYear(start);
        return tempDate;
    }

    const getBounds = (date) => {
        var selectedYear = 1;
        if (date != null)
            selectedYear = date.getFullYear();
        if (isStart === 0)
            return selectedYear < end && selectedYear > 0 && isValidDate(data, selectedYear);
        return selectedYear > start && selectedYear > 0 && isValidDate(data, selectedYear);
    }

    const checkStartDate = (date, isStart) => {
        if (!isValidDate(data, date.getFullYear())) {
            if (isStart)
                return getFirstDate(data);
            return getLastDate(data);
        }
        return date;
    }
    return (
        (data === "i" || data.length === 0) ? (
            <div> "Loading..." </div>
        ) : (
            <DatePicker
                selected={getYear(isStart)}
                onChange={(date) => dateHandler(date, isStart)}
                showYearPicker
                dateFormat="yyyy"
                filterDate={getBounds}
            />
        )
    );
}

/**
 * Maps the state from the Redux store to the component props.
 * 
 * @param {object} state - The current state.
 * @returns {object} The mapped props.
 */
function mapStateToProps(state) {
    return {
        start: state.startDate,
        end: state.endDate,
    };
}

/**
 * Maps the dispatch functions to the component props.
 * 
 * @param {Function} dispatch - The dispatch function.
 * @returns {object} The mapped props.
 */
function mapDispatchToProps(dispatch) {
    return {
        updateStart: (start) => dispatch(setStartDate(start)),
        updateEnd: (end) => dispatch(setEndDate(end)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDate);
