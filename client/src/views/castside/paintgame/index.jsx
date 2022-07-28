import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Draw from '../../../components/castside/draw';
import MemberList from '../../../components/castside/memberlist';
import WaitingScreen from '../../../components/castside/waiting';
import "./styles.scss";
import sound from '../../../assets/sound/draw.mp3';
import sound2 from '../../../assets/sound/endgame.mp3';

let socket;

function PaintGame(props) {
    const [roomCode, setRoomCode] = useState("");
    const [category, setCategory] = useState("random");
    const [time, setTime] = useState(120);
    const [screen, setScreen] = useState("waiting");
    const [drawAudio] = useState(new Audio(sound));
    const [endAudio] = useState(new Audio(sound2));

    useEffect(() => {
        socket = io(process.env.REACT_APP_API_ENDPOINT, {
            query: {type: "create"}
        })

        socket.on("connect", (socket) => {
            console.log('connected socket io 2')
        });

        socket.on('create', (args) => {
            setRoomCode(args);
        })
    }, [])

    return (
    <div className="paintgame">
        <MemberList socket={socket}/>
        {screen === 'waiting' && <WaitingScreen socket={socket} roomCode={roomCode} time={time} setTime={setTime} category={category} setCategory={setCategory} setScreen={(value) => setScreen(value)}/>}
        {screen === 'draw' && <Draw socket={socket} roomCode={roomCode} time={time} category={category} setScreen={(value) => setScreen(value)} drawAudio={drawAudio} endAudio={endAudio}/>}
    </div>
    );
}

export default PaintGame;