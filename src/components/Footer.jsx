import React from "react";
import { FaExclamation } from "react-icons/fa";

/**
 * Footer component. Displayed at the bottom of every page to
 * communicate the citation disclaimer.
 * 
 * @returns {ReactElement} The rendered component.
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <FaExclamation className="icon" />
        <p className="message">This is a beta version using example data and not for citation.</p>
      </div>
    </footer>
  );
}

export default Footer;
