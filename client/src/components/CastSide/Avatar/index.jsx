import React from 'react';
import "./styles.scss";

function Avatar({src, width, height, type}) {
    const radius = type === "circle" ? "50%" : "20%";
    return (
        <div className="avatar" style={{width: width, height: height, borderRadius: radius}}>
            <img src={src} alt="avatar" />
        </div>
    );
}

export default Avatar;