import React from "react";
import { connect } from 'react-redux';
// In Sidenav.js
import { NavLink } from "react-router-dom";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { MdElectricBolt } from "react-icons/md";
import { GiWaterDrop } from "react-icons/gi";
import { CiWheat } from "react-icons/ci"
import { setOpen } from "./Store";

/**
 * SidebarDashboard component. Is displayed on the left side of the dashboard
 * giving access to the subdashboards.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.open - State indicating if the sidebar is open.
 * @param {(dataset: any) => any} props.toggleOpen - Toggle whether the sidebar is open.
 * @param {(dataset: any) => any} props.setOpen - Set the current open state.
 * @returns {ReactElement} The rendered component.
 */
function SidebarDashboard({ open, toggleOpen, setOpen }) {
  if (open === 2) {
    if (window.innerWidth < 700)
      setOpen(0);
    else
      setOpen(1);
  }
  return (
    <div className={open ? "sidenav" : "sidenavClosed"}>
      <button className={"menuBtn"} onClick={toggleOpen}>
        {open ? (
          <AiFillCaretLeft />
        ) : (
          <AiFillCaretRight />
        )}
      </button>
      {
        (open) ? (
          <div className="side-info-text">
            Subpages Coming Soon!
          </div>
        ) : (<div />)
      }
      <NavLink className="sideitem" >
        <RiDashboardFill />
        <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Dashboard"}</span>
      </NavLink>
      <div className="sideitem" >
        <MdElectricBolt />
        <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Energy"}</span>
      </div>
      <div className="sideitem" >
        <GiWaterDrop />
        <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Water"}</span>
      </div>
      <div className="sideitem" >
        <CiWheat />
        <span className={`linkText ${!open ? "collapsed" : ""}`}>{"Land"}</span>
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

/**
 * Maps the dispatch functions to the component props.
 * 
 * @param {Function} dispatch - The dispatch function.
 * @returns {Object} The mapped props.
 */
function mapDispatchToProps(dispatch) {
  return {
    toggleOpen: () => dispatch({ type: 'toggleOpen' }),
    setOpen: (opened) => dispatch(setOpen(opened))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarDashboard);
