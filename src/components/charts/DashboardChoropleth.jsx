import React from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import countries from "./geopolitical_regions.json";

/**
 * A container for the nivo choropleth previously used for display on the dashboard. 
 * Currently disused and superceded by the LeafletSync.
 * 
 * @param {object} props - The component props.
 * @param {object[]} props.data - Region data for the choropleth.
 * @param {number} props.min - Minimum value within the dataset.
 * @param {number} props.max - Maximum value within the dataset.
 * @returns {ReactElement} The rendered component.
 */
const DashboardChoropleth = ({ data, min, max }) => (
    <>
        
        <div className="nivo-wrapper">
            <ResponsiveChoropleth
                data={data}
                features={countries.features}
                margin={{ top: 25, right: 0, bottom: 0, left: 0 }}
                colors="YlGn"
                domain={[min, max]}
                unknownColor="#666666"
                label="properties.name"
                valueFormat=".2s"
                projectionScale={58}
                projectionTranslation={[0.48, 0.55]}
                projectionRotation={[0, 0, 0]}
                borderWidth={0.5}
                borderColor="#152538"
                legends={[]}
            />
        </div>
    </>
)

export default DashboardChoropleth;