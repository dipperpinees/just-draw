import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Modal from '../../../components/playerside/modal';
import Paint from '../../../components/playerside/paint';
import { compareQuiz } from '../../../helper/handleQuiz';
import "./styles.scss";

let socket;

function PlayerScreen(props) {
    const [searchParams] = useSearchParams();
    const [isPaint, setIsPaint] = useState(false);
    const [isGuess, setIsGuess] = useState(false);
    const [waitMessage, setWaitMessage] = useState("Đợi trò chơi bắt đầu");
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
                alert("Phòng không tồn tại");
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
            setWaitMessage("Đợi trò chơi bắt đầu");
            setIsPaint(false);
            setIsGuess(false);
        })   
        
        socket?.on("status", ({type}) => {
            if(type === 'error') {
                alert("Chủ phòng đã rời phòng");
                navigate("/join");
            }
        })
    }, [searchParams, navigate])

    const handleSendAnswer = () => {
        if(compareQuiz(answer, quiz)) {
            socket.emit("answer", {isTrue: true, roomId: roomId, answer: answer});
            setIsGuess(false);
            setWaitMessage("Bạn đã trả lời đúng, đợi màn chơi mới");
        } else {
            // alert("Đáp án sai");
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
            <h5>Vẽ từ bên dưới đây</h5>
            <h2>{quiz}</h2>
            <Paint makeImage={(data) => socket.emit("paint", {base64: data, roomId: roomId})}/>
            <div>
                {/* <h5>Hiep Nguyen</h5> */}
            </div>
        </div>}

        {isGuess && <div className="player-screen" style={{alignItems: "center"}}>
            <h5>Đoán từ bạn thấy trên màn hình</h5> 
            <input className="player-screen-input" type="text" onChange={(e) => setAnswer(e.target.value)}/>
            <button className="player-screen-submit" onClick={handleSendAnswer}>OK</button>
        </div>} 

        {!isGuess && !isPaint && <div className="player-screen" style={{alignItems: "center"}}> 
            {waitMessage === "Đợi trò chơi bắt đầu" && <button className="player-screen-leave" onClick={handleLeaveRoom}> Rời phòng </button>}
            {waitMessage} 
        </div>}

        {showModal && <Modal message="Đáp án sai" onClose={() => setShowModal(false)}/>}
    </>
    );
}

export default PlayerScreen;