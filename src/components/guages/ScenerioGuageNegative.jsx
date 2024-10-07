import React, {useEffect} from "react";
import Gauge from "justgage";

let gage = undefined;

const ScenerioGuageNegative = ({guageText, guageValue}) => {
    useEffect(() => {
        if (gage) {
            gage.refresh((Math.max(0, guageValue + 100)))
            gage.update({
                textRenderer: () => {
                    return (guageValue + "%");
                }
            });
        } else {
            gage = new Gauge({
                id: Text,
                value: (Math.max(0, guageValue + 100)),
                hideValue: false,
                hideMinMax: true,
                min: 0,
                max: 100,
                reverse: false,
                symbol: "%",
                pointer: false,
                textRenderer: () => {
                    return (guageValue + "%");
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

export default ScenerioGuageNegative;