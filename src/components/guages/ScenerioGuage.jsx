import React, {useEffect} from "react";
import Gauge from "justgage";

let gage = undefined;

const ScenerioGuage = ({guageText, guageValue}) => {
    useEffect(() => {
        if (gage) {
            gage.refresh(guageValue);
        } else {
            gage = new Gauge({
                id: Text,
                value: guageValue,
                hideValue: false,
                hideMinMax: true,
                min: 0,
                max: 100,
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
                valueFontColor: "#DADADA",
                valueFontFamily: "Geneva",
                formatNumber: true,
                levelColors: [
                    "#91d145"
                ],
            });
        }
        // setInterval(() => {
        // const refreshValue = generateRandomValue(value, type);
        // gauge.refresh(refreshValue);
        // }, GAUGE_CONFIG[type].interval);
    }, [guageText, guageValue]);
    return (
        <div id={guageText}/>
    );
};

export default ScenerioGuage;