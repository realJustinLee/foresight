import React, { useEffect, useState } from "react";
import { ResponsiveBar } from '@nivo/bar'
import { connect } from 'react-redux';
import { getBarHorizontal } from "../../assets/data/DataManager";
import { BarTooltip } from "./NivoTooltips.tsx";
import { updateHash } from "../sharing/DashboardUrl.jsx";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const MyResponsiveBar = ({csv, color, listKeys, scenerio, setdashboardSub, countries }) => {
    //console.log("!!!!", listKeys); 
    const [scenerioName, setScenerio] = useState(scenerio);
    const [barData, setData] = useState(getBarHorizontal(countries, csv, scenerio));
    useEffect(() => {
        setScenerio(scenerio);
        //console.log("Scenario:", scenerio);
    }, [scenerio])
    useEffect(() => {
        setData(getBarHorizontal(countries, csv, scenerio));
        //console.log("BAR DATA:", barData);
    }, [countries, csv, scenerio])
    return (
        <div className="bar-wrapper">
            <div className="double-bar-text-wrapper">  {scenerioName} </div>
            <ResponsiveBar
                data={barData}
                keys={listKeys}
                indexBy="country"
                margin={{ top: 0, right: 15, bottom: 42, left: 70 }}
                layout="horizontal"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={color.length === 0 ? { scheme: 'spectral' } : color}
                //colorBy="key"
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    tickValues: 2,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                onClick={(data) => {
                    if(data["id"] !== "class1") {
                        setdashboardSub(
                            `${data["id"]}`
                        );
                        updateHash("class",  `${data["id"]}`)
                    }
                }}
                axisLeft={{
                    format: (v) => {
                        return v.length > 10 ? (
                            v.substring(0, 7) + "..."
                        ) : (
                            v
                        );
                    },
                    tickSize: 4,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                enableLabel={false}
                legends={[]}
                markers={[
                    {
                        axis: 'x',
                        value: 0,
                        lineStyle: {
                            stroke: 'white',
                        },
                    },
                ]}
                the value determine 
                role="application"
                theme={{
                    "text": {
                        "fontSize": 11,
                        "fill": "#333333",
                        "outlineWidth": 0,
                        "outlineColor": "transparent"
                    },
                    "axis": {
                        "domain": {
                            "line": {
                                "stroke": "#DADADA",
                                "strokeWidth": 1
                            }
                        },
                        "legend": {
                            "text": {
                                "fontSize": 12,
                                "fill": "#DADADA",
                                "outlineWidth": 0,
                                "outlineColor": "transparent"
                            }
                        },
                        "ticks": {
                            "line": {
                                "stroke": "#DADADA",
                                "strokeWidth": 1
                            },
                            "text": {
                                "fontSize": 11,
                                "fill": "#DADADA",
                                "outlineWidth": 0,
                                "outlineColor": "transparent"
                            }
                        }
                    },
                    "grid": {
                        "line": {
                            "stroke": "#DADADA",
                            "strokeWidth": 1
                        }
                    },
                    "legends": {
                        "title": {
                            "text": {
                                "fontSize": 11,
                                "fill": "#333333",
                                "outlineWidth": 0,
                                "outlineColor": "transparent"
                            }
                        },
                        "text": {
                            "fontSize": 11,
                            "fill": "#333333",
                            "outlineWidth": 0,
                            "outlineColor": "transparent"
                        },
                        "ticks": {
                            "line": {},
                            "text": {
                                "fontSize": 10,
                                "fill": "#333333",
                                "outlineWidth": 0,
                                "outlineColor": "transparent"
                            }
                        }
                    },
                    "annotations": {
                        "text": {
                            "fontSize": 13,
                            "fill": "#333333",
                            "outlineWidth": 2,
                            "outlineColor": "#DADADA",
                            "outlineOpacity": 1
                        },
                        "link": {
                            "stroke": "#000000",
                            "strokeWidth": 1,
                            "outlineWidth": 2,
                            "outlineColor": "#DADADA",
                            "outlineOpacity": 1
                        },
                        "outline": {
                            "stroke": "#000000",
                            "strokeWidth": 2,
                            "outlineWidth": 2,
                            "outlineColor": "#DADADA",
                            "outlineOpacity": 1
                        },
                        "symbol": {
                            "fill": "#000000",
                            "outlineWidth": 2,
                            "outlineColor": "#DADADA",
                            "outlineOpacity": 1
                        }
                    },
                    "tooltip": {
                        "container": {
                            "background": "#DADADA",
                            "fontSize": 12
                        },
                        "basic": {},
                        "chip": {},
                        "table": {},
                        "tableCell": {},
                        "tableCellValue": {}
                    }
                }}
                tooltip={BarTooltip}
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
            />
        </div>
        
    );
}

function mapStateToProps(state) {
    return {
        countries: state.barCountries,
    };
}

export default connect(mapStateToProps)(MyResponsiveBar);