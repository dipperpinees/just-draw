import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import ChooseColor from '../choosecolor';
import "./styles.scss";

function Paint({makeImage}) {
    const [color, setColor] = useState("#000");
    const [lineWidth, setLineWidth] = useState(2);
    const paintCanvas = useRef(null);
    const setStokeWidth = (width) => {
      setLineWidth(width)
    }

    const castImage = async () => {
        // paintCanvas.current
        // .exportImage("png")
        // .then(data => {
        //   makeImage(data)
        // })
        const image = await paintCanvas.current.getDataURL();
        makeImage(image);
      }

    return (          
        <div>
          <ChooseColor
            setLineColor={setColor} 
            setLineWidth={setStokeWidth} 
            undo={() => {
                paintCanvas.current.undo(); 
                castImage()}} 
            // redo={() => {
            //     paintCanvas.current.redo();  
            //     castImage()}}
            clear={() => {
                paintCanvas.current.eraseAll(); 
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

export default Paint;