import React, { useEffect } from "react";
import Gauge from "justgage";

/**
 * A justgage guage for testing.
 * 
 * @param {object} props - The component props.
 * @param {string} props.guageText - Text to be displayed below the guage.
 * @param {number} props.guageValue - Value to be displayed within the guage.
 * @returns {ReactElement} The rendered component.
 */
const CustomGuage = ({ guageText, guageValue }) => {
  const Text = guageText;
  const Value = guageValue;
  useEffect(() => {
    var prevGuage = new Gauge({ id: Text });
    prevGuage.destroy();
    new Gauge({
      id: Text,
      value: Value,
      hideValue: false,
      hideMinMax: true,
      min: -100,
      max: 100,
      differential: true,
      symbol: "%",
      pointer: false,
      startAnimationTime: 120,
      startAnimationType: ">",
      refreshAnimationTime: 120,
      refreshAnimationType: "bounce",
      showInnerShadow: true,
      shadowSize: 7,
      shadowVerticalOffset: 5,
      shadowOpacity: 0.9,
      relativeGaugeSize: true,
      valueMinFontSize: 26,
      gaugeWidthScale: 0.6,
      counter: true,
      valueFontColor: "#444444",
      gaugeColor: "#888888",
      valueFontFamily: "Geneva",
      formatNumber: true,
      levelColors: [
        "#f27e35",
        "#91d145"
      ],
    });
    // setInterval(() => {
    // const refreshValue = generateRandomValue(value, type);
    // gauge.refresh(refreshValue);
    // }, GAUGE_CONFIG[type].interval);
  }, [Value, Text]);
  return (
    <>
      <div id={Text} />
    </>
  );
};

export default CustomGuage;