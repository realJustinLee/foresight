import React, { useState, useEffect } from "react";
import Globe from "react-globe.gl";

const N = 300;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
}));

/**
 * Gets the width and height of the current window element.
 * 
 * @returns {{width: number; height: number;}} The window width and height.
 */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

/**
 * Listens for changes in window dimensions and updates the windowDimensions parameter.
 * 
 * @returns {{width: number; height: number;}} The window width and height.
 */
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

/**
 * A simple Globe component with random markers, fixed dimensions and rotation speed for testing.
 * 
 * @returns {ReactElement} The rendered component.
 */
function World() {
  const globeElement = React.useRef();
  //const { height, width } = useWindowDimensions();

  React.useEffect(() => {
    // Auto-rotate
    globeElement.current.controls().autoRotate = true;
    globeElement.current.controls().autoRotateSpeed = 0.4;
    //globeElement.current.controls().enableZoom = false;
    globeElement.current.controls().enabled = true;
    globeElement.current.controls().enableRotate = true;
  }, []);

  return (
    <div className="body-page">
      <div className="world-page">
        <Globe
          width={500}
          height={500}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          pointsData={gData}
          pointAltitude="size"
          pointColor="color"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          ref={globeElement}
        />
      </div>
    </div>
  );
}

export default World;
