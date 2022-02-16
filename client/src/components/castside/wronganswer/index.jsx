import React, { useEffect, useState } from 'react';
import "./styles.scss";

function WrongAnswer({socket}) {
    const [wrongAnswer, setWrongAnswer] = useState();

    useEffect(() => {
        socket?.on('answer', ({type, name, answer}) => {
            if(!type) {
                setWrongAnswer(`${name}: ${answer}`)
            }
        })
    }, [])

    return (
        <span className="wrong">
            {wrongAnswer}
        </span>
    );
}

export default WrongAnswer;