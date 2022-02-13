import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import ChooseColor from '../playerside/choosecolor';

function TestPaint(props) {
    const [color, setColor] = useState("#000");
    const [lineWidth, setLineWidth] = useState(2);
    const paintCanvas = useRef(null);

    const setStokeWidth = (width) => {
      setLineWidth(width)
    }

    const castImage = () => {
        // paintCanvas.current
        // .exportImage("png")
        // .then(data => {
        //   console.log(data);
        // })
        console.log(paintCanvas.current.getDataURL());
      }

    return (
        <div>
            <ChooseColor
            setLineColor={setColor} 
            setLineWidth={setStokeWidth} 
            undo={() => {
                paintCanvas.current.undo(); 
                castImage()}} 
            redo={() => {
                paintCanvas.current.redo();  
                castImage()}}
            clear={() => {
                paintCanvas.current.resetCanvas(); 
                castImage()}}/>
            <div className="paint" onTouchEnd={castImage} onMouseUp={castImage}>
                <CanvasDraw 
                    ref={paintCanvas} 
                    canvasWidth={360} 
                    canvasHeight={360} 
                    brushColor={color} 
                    brushRadius={lineWidth}
                    lazyRadius={0}
                />
            </div>
        </div>
    );
}

export default TestPaint;