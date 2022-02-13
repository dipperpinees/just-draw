import React, { useEffect, useState } from 'react';
import "./styles.scss";

function DrawBox({socket}) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        socket?.on("paint", (args) => {
            setImage(args);
        })

        return () => {
            socket.off('paint');
        }
    }, [])

    return (
        <div className="drawbox">
           {image && <img src={image} alt="draw"/> }
        </div>
    );
}

export default DrawBox;