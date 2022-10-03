import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Modal from '../../../components/PlayerSide/Modal';
import Paint from '../../../components/PlayerSide/Paint';
import { compareQuiz } from '../../../helper/handleQuiz';
import "./styles.scss";

let socket;

function PlayerScreen(props) {
    const [searchParams] = useSearchParams();
    const [isPaint, setIsPaint] = useState(false);
    const [isGuess, setIsGuess] = useState(false);
    const [waitMessage, setWaitMessage] = useState("Wait for the new game");
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [quiz, setQuiz] = useState("");
    const [answer, setAnswer] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        socket = io(process.env.REACT_APP_API_ENDPOINT, {
            query: {type: "join",avatar: searchParams.get("avatar"), name: searchParams.get("name"), roomId: searchParams.get("roomId")}
        });

        socket.on("connect", (socket) => {
            console.log('connected socket io 1')
            
        });

        socket.on("join", (args) => {
            if(args === 'error') {
                alert("This room does not exist");
                navigate("/join");
            } else {
                const {roomId} = args;
                setRoomId(roomId);
            }
            
        })

        socket.on("newquiz", ({paintId, quiz}) => {
            setQuiz(quiz);
            if(paintId === socket.id) {
                setIsPaint(true);
            } else {
                setIsGuess(true);
            }
        })

        socket.on("endquiz", () => {
            setWaitMessage("Wait for the new game");
            setIsPaint(false);
            setIsGuess(false);
        })   
        
        socket?.on("status", ({type}) => {
            if(type === 'error') {
                alert("The owner of the room has left the room");
                navigate("/join");
            }
        })
    }, [searchParams, navigate])

    const handleSendAnswer = () => {
        if(compareQuiz(answer, quiz)) {
            socket.emit("answer", {isTrue: true, roomId: roomId, answer: answer});
            setIsGuess(false);
            setWaitMessage("You answered correctly, wait for the new game");
        } else {
            setShowModal(true);
            socket.emit("answer", {isTrue: false, roomId: roomId, answer: answer});
        }
    }

    const handleLeaveRoom = () => {
        socket.emit('leave', true);
        navigate("/join");
    }

    return (
    <>
        {isPaint && <div className="player-screen">
            <h5>Draw the words below</h5>
            <h2>{quiz}</h2>
            <Paint makeImage={(data) => socket.emit("paint", {base64: data, roomId: roomId})}/>
        </div>}

        {isGuess && <div className="player-screen" style={{alignItems: "center"}}>
            <h5>Guess the word you see on the screen</h5> 
            <input className="player-screen-input" type="text" onChange={(e) => setAnswer(e.target.value)}/>
            <button className="player-screen-submit" onClick={handleSendAnswer}>OK</button>
        </div>} 

        {!isGuess && !isPaint && <div className="player-screen" style={{alignItems: "center"}}> 
            {waitMessage === "Wait for the new game" && <button className="player-screen-leave" onClick={handleLeaveRoom}> Leave room </button>}
            {waitMessage} 
        </div>}

        {showModal && <Modal message="Wrong answer" onClose={() => setShowModal(false)}/>}
    </>
    );
}

export default PlayerScreen;
