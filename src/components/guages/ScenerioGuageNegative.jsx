import React, { useEffect } from "react";
import Gauge from "justgage";


/**
 * A justgage object for a negative guage displayed in the dashboard guage bar.
 * 
 * @param {object} props - The component props.
 * @param {string} props.guageText - Title of the guage.
 * @param {number} props.guageValue - Guage number value.
 * @returns {ReactElement} The rendered component.
 */
const ScenerioGuageNegative = ({ guageText, guageValue }) => {
    const Text = guageText;
    const Value = guageValue;
    useEffect(() => {
        var prevGuage = new Gauge({id:Text});
        prevGuage.destroy();
        new Gauge({
            id: Text,
            value: (Math.max(0,Value+100)),
            hideValue: false,
            hideMinMax: true,
            min: 0,
            max: 100,
            reverse: false,
            symbol: "%",
            pointer: false,
            textRenderer: function (value) {
                return (Value + "%");
            },
            startAnimationTime: 120,
            startAnimationType: "<",
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
            valueFontColor: "#DADADA",
            valueFontFamily: "Geneva",
            gaugeColor: "#f27e35",
            formatNumber: true,
            levelColors: [
                "#edebeb"
            ],
        });
        // setInterval(() => {
        // const refreshValue = generateRandomValue(value, type);
        // gauge.refresh(refreshValue);
        // }, GAUGE_CONFIG[type].interval);
    }, [Value, Text]);
    return (
        <div id={Text} />
    );
};

export default ScenerioGuageNegative;