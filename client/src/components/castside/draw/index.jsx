import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { handleWordQuiz } from '../../../helper/handleQuiz';
import DrawBox from '../drawbox';
import GameSummary from '../gamesummary';
import WrongAnswer from '../wronganswer';
import "./styles.scss";


function Draw({roomCode, socket, time, category, setScreen, drawAudio, endAudio}) {
    const [show, setShow] = useState('start')
    const [quiz, setQuiz] = useState('');
    const [paintName, setPaintName] = useState('');
    const [summaryList, setSummaryList] = useState([]);

    useEffect(() => {
        socket?.on('newquiz', ({word, paintName}) => {
            setShow('intro');
            setPaintName(paintName);
            setQuiz(word);
            drawAudio.currentTime = 0;
            drawAudio.pause();
            drawAudio.play();
        })
        socket?.on('endquiz', () => {
            setShow('summary');
            drawAudio.pause();
            drawAudio.currentTime = 0;
        })
        socket?.on('endgame', (args) => {
            setShow('endgame');
            setSummaryList(args.summaryList);
            drawAudio.pause();
            endAudio.play();
        })

        return () => {
            socket.on('newquiz', () => {});
            socket.on('endquiz', () => {});
            socket.on('endgame', () => {});
        }
    }, [socket, drawAudio, endAudio])

    return (
        <div className="draw">
            {show === 'start' && 
                <Countdown 
                date={Date.now() + 5000}
                intervalDelay={0}
                precision={3}
                renderer={props => <div className="draw-countdown">{Math.round(props.total/1000)}</div>}
                onComplete={() => {
                    socket.emit("newquiz", {roomId: roomCode, category: category});
                }}
            />
            }
            {show === 'intro' && 
                <Countdown
                date={Date.now() + 3000}
                intervalDelay={0}
                precision={3}
                renderer={() => <div className="draw-intro">
                    Đoán từ sau: <br/>
                    <h3>{handleWordQuiz(quiz)}</h3>
                    Người vẽ: {paintName}
                </div>}
                onComplete={() => setShow('draw') }
            />
            }

            {show === 'draw' && <div className="draw-content">
                    <span className="draw-content-code">{roomCode}</span>
                    <div>
                        <span>Guess this word</span>
                        <h4>{handleWordQuiz(quiz)}</h4>
                    </div>
                    <div>
                        <DrawBox socket={socket}/>
                        <WrongAnswer socket={socket}/>
                    </div>
                    <Countdown
                        date={Date.now() + time*1000}
                        intervalDelay={0}
                        precision={3}
                        renderer={props => <span className="draw-content-countdown">{Math.round(props.total/1000)}</span>}
                        onComplete={() => {
                            socket.emit("endquiz", {roomId: roomCode});
                        }}
                    />
                </div>}
            {show === 'summary' && <Countdown
                        date={Date.now() + 8*1000}
                        intervalDelay={0}
                        precision={3}
                        renderer={props => 
                            <div className="draw-summary">
                                <p>Đáp án</p>
                                <h2>{quiz}</h2>
                                <button onClick={ () => {
                                    socket.emit("newquiz", {roomId: roomCode});
                                    setShow(null);
                                }}>Tiếp tục</button>
                            </div>
                        }
                        onComplete={() => {
                            socket.emit("newquiz", {roomId: roomCode});
                        }}
            />}
            {show === 'endgame' && <GameSummary summaryList={summaryList} setScreen={setScreen}/>}
            
        </div>
    );
}

export default Draw;