import React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";

/**
 * An unused react compare slider comparing two images.
 * 
 * @param {object} props - The component props.
 * @param {string} props.firstImage - Path to the first image.
 * @param {string} props.secondImage - Path to the second image.
 * @param {string} props.href - Link for image citation.
 * @param {string} props.linkText - Text for the image citation.
 * @returns {ReactElement} The rendered component.
 */
function Imageslider({ firstImage, secondImage, href, linkText }) {
  return (
    <div className="slider">
      <div className="slider-container">
        <div className="image-container">
          <ReactCompareSlider
            handle={<ReactCompareSliderHandle />}
            itemOne={<ReactCompareSliderImage src={firstImage} alt="First Image" />}
            itemTwo={<ReactCompareSliderImage src={secondImage} alt="Second Image" />}
            style={{
              height: '100%',
              width: '100%'
            }}
          />
          <div className="image-citation">
            Images from{" "}
            <a href={href} target="_blank" rel="noreferrer">
              {linkText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Imageslider;
