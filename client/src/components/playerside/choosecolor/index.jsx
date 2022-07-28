import React, { useState } from 'react';
import { BiEraser, BiRefresh, BiUndo } from "react-icons/bi";
import "./styles.scss";

function ChooseColor({setLineColor, setLineWidth, undo, redo, clear}) {
    const colors = ["#000", "#fff", "#FFFF00", "#008000", "#FFC0CB", "#800080", "#0000FF", "#ADD8E6", "#F08080", "#E0FFFF", "#FFA500", "#FF0000"];
    const [showBox, setShowBox] = useState(false);
    const [color, setColor] = useState("#000");
    const [isEraser, setIsEraser] = useState(false);

    const changeLineColor = (color) => {
        setLineColor(color);
        setShowBox(false);
        setColor(color);
        setLineWidth(2);
        setIsEraser(false);
    }

    const setEraser = () => {
        if(!isEraser) {
            setLineColor("#fff");
            setLineWidth(12);
            setIsEraser(true);
        } else {
            setIsEraser(false);
            setLineColor(color);
            setLineWidth(2);
        }
    }

    return (
        <div className="choose-color">
            <div className="choose-color-tools">
                {/* <RiArrowGoBackFill /> */}
                <button onClick={() => setShowBox(true)} className="choose-color-button" style={{backgroundColor: color}}></button>
                <BiEraser color={isEraser && "#fff"} onClick={setEraser} />
                <BiUndo onClick={undo}/>
                {/* <BiRedo onClick={redo}/> */}
                <BiRefresh onClick={clear}/>
            </div>
            
            {showBox && <div className="choose-color-box">
                {colors.map((color) => (
                    <div onClick={() => changeLineColor(color)} className="choose-color-box-element" style={{"background-color": color}}></div>
                ))}
            </div>}
        </div>
    );
}

export default ChooseColor;