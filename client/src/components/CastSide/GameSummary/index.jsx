import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Member from '../Member';
import "./styles.scss";

function GameSummary({summaryList, setScreen}) {
    const [showDetail, setShowDetail] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="game-summary">
            <div className="game-summary-top">

                <div className="game-summary-top-2">
                    <span>{summaryList[1]?.name}</span>
                    <img src={require("../../../assets/img/top2.png")} alt="top2" />
                </div>

                <div className="game-summary-top-1">
                    <span>{summaryList[0]?.name}</span>
                    <img src={require("../../../assets/img/top1.png")} alt="top1" />
                </div>

                {summaryList.length > 2 && <div className="game-summary-top-3">
                    <span>{summaryList[2]?.name}</span>
                    <img src={require("../../../assets/img/top3.png")} alt="top3" />
                </div>}
            </div>
            {showDetail && <div className="game-summary-detail">
                <ul>
                    {summaryList?.map((member, index) => (
                        <li key={index}> <Member name={member.name} score={member.score} avatar={member.avatar}/> </li>
                    ))} 
                </ul>
                <button onClick={() => setShowDetail(false)}>Trở về</button>
            </div>}
            <div className="game-summary-button">
                <button onClick={() => setScreen("waiting")}>Trở về</button>
                <button onClick={() => setShowDetail(true)}>Chi tiết</button>
            </div>
        </div>
    );
}

export default GameSummary;