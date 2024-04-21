import React from "react";
import { handleCopy, handleMouseEnter, handleMouseLeave } from '../utils/MouseUtilFunctions.js';


const Clipboard = ({ textToCopy }) => {
    return (
        <span className="copy-container">
            <span className="copy-button" role="img" 
                onClick={() => handleCopy(textToCopy, "Copied!")} 
                onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {" 📋"}
            </span>
            <span className="copy-tooltip"></span>
        </span>
    );
};


export default Clipboard;