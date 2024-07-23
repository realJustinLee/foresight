import colorData from '../GcamColors.json';
import { getScenerio, filterSubcat } from './DataManager';

export const pal_green = ["#FFFFE5","#F7FCB9","#D9F0A3","#ADDD8E","#78C679","#41AB5D","#238443","#006837","#004529","#003300"]

/**
 * Gets the colors to display for each subcategory in the bar chart.
 * 
 * @param {object[]} data - The bar data.
 * @param {string} data - The scenario to filter by.
 * @param {string} guages - The parameter list to get the parameter category from.
 * @returns {string[]} The colors to display.
 */
export const getBarColors = (data, scenerio, guages) => {
    let category = guages ? guages : 'default';
    let counter = 0;
    let subcatList = filterSubcat(getScenerio(data, scenerio));
    let colors = [];
    //console.log("!!!!!", guages);
    subcatList.forEach((param) => colors.push(getColorJson(param, counter++, category)));
    return colors;
}

/**
 * Returns the list of JGCRIColors (https://github.com/JGCRI/jgcricolors) for a specific palette.
 * 
 * @param {string} palette - The palette name.
 * @returns {Object} The color to display.
 */
export const getColorsFromPalette = (palette) => {
    let colors = [];
    switch(palette.toLowerCase()) {
        case "pal_16":
            colors = colorData.pal_16;
            break;
        case "pal_spectral":
            colors = colorData.pal_spectral;
            break;
        case "pal_basic":
            colors = colorData.pal_basic;
            break;
        case "pal_hot":
            colors = colorData.pal_hot;
            break;
        case "pal_wet":
            colors = colorData.pal_wet;
            break;
        case "pal_green":
            colors = colorData.pal_green;
            break;
        case "pal_div_wet":
            colors = colorData.pal_div_wet;
            break;
        case "pal_div_blrd":
            colors = colorData.pal_div_BlRd;
            break;
        case "pal_div_rdbl":
            colors = colorData.pal_div_RdBl;
            break;
        case "pal_div_brgn":
            colors = colorData.pal_div_BrGn;
            break;
        case "pal_div_gnbr":
            colors = colorData.pal_div_GnBr;
            break;
        case "pal_div_rdblu":
            colors = colorData.pal_div_RdBlu;
            break;
        case "pal_div_blurd":
            colors = colorData.pal_div_BluRd;
            break;
        case "pal_all":
            colors = colorData.pal_all;
            break;
        default:
            colors = colorData.pal_16;
            break;
    }
    return colors;
}

/**
 * Returns the JGCRIColor (https://github.com/JGCRI/jgcricolors) for a given parameter.
 * 
 * @param {string} param - The parameter name.
 * @param {boolean} counter - Which color 0-15 in the backup pal_16 color palette to use.
 * @param {boolean} category - Which categorical type to get color from for data with no subcategories.
 * @returns {string} The color to display.
 */
const getColorJson = (param, counter, category) => {
    param = param.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    let color = "";
    if(param === 'class1') return colorData.class_colors[category] ? colorData.class_colors[category] : "#666666";
    Object.keys(colorData.pal_all).forEach((key) => {
        if( key === param)
            color = colorData.pal_all[key];
    });
    if (color === "") {
        color = colorData.pal_16[counter%16];
    }
    return color ;
}