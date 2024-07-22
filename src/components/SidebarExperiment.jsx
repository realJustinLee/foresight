import React from "react";
import { connect } from 'react-redux';
// In Sidenav.js
import { NavLink } from "react-router-dom";
import { AiFillCaretLeft,AiFillCaretRight } from "react-icons/ai";
import { FaMapMarkedAlt, FaGlobeAmericas} from "react-icons/fa";
import { BsBarChartFill } from "react-icons/bs"

/**
 * SidebarExperiment component. Is displayed on the left side of the experiments
 * page giving access to the subpages with specific types of visualizations.
 * Currently unused.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.open - State indicating if the sidebar is open.
 * @param {(dataset: any) => any} props.toggleOpen - Toggle whether the sidebar is open.
 * @returns {ReactElement} The rendered component.
 */
function SidebarExperiment({open, toggleOpen}) {

  return (
      <div className={open ? "sidenav" : "sidenavClosed"}>
        <button className={"menuBtn"} onClick={toggleOpen}>
          {open ? (
            <AiFillCaretLeft />
          ) : (
            <AiFillCaretRight />
          )}
        </button>
        <NavLink className="sideitem" to="/charts">
          <BsBarChartFill />
          <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Charts"}</span>
        </NavLink>
        <NavLink className="sideitem" to="/maps">
          <FaMapMarkedAlt />
          <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Maps"}</span>
        </NavLink>
        <NavLink className="sideitem" to="/globes">
          <FaGlobeAmericas/>
          <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Globes"}</span>
        </NavLink>
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

/**
 * Maps the dispatch functions to the component props.
 * 
 * @param {Function} dispatch - The dispatch function.
 * @returns {Object} The mapped props.
 */
function mapDispatchToProps(dispatch) {
  return {
    toggleOpen: () => dispatch({ type: 'toggleOpen' })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarExperiment);
