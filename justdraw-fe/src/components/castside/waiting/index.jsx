import React from 'react';
import { Link } from 'react-router-dom';
import "./styles.scss";

function WaitingScreen({roomCode, category, setCategory, time, setTime, setScreen}) {
    
    return (           
        <div className="waiting-settings">
            <h3>Mã phòng: {roomCode}</h3>
            <div className="waiting-settings-categories">
                <div className={category === "random" && "waiting-settings-categories-choose"} onClick={() => setCategory("random")}>
                    <img src={require("../../../assets/img/dices.png")} alt="animal" />
                    <h5>Ngẫu nhiên</h5>
                </div>
                <div className={category === "animal" && "waiting-settings-categories-choose"} onClick={() => setCategory("animal")}>
                    <img src={require("../../../assets/img/dog.png")} alt="animal" />
                    <h5>Động vật</h5>
                </div>
                <div className={category === "newyear" && "waiting-settings-categories-choose"} onClick={() => setCategory("newyear")}>
                    <img src={require("../../../assets/img/new-year.png")} alt="newyear" />
                    <h5>Năm mới</h5>
                </div>
                <div className={category === "object" && "waiting-settings-categories-choose"} onClick={() => setCategory("object")}>
                    <img src={require("../../../assets/img/3d.png")} alt="object" />
                    <h5>Đồ vật</h5>
                </div>
                <div className={category === "fish" && "waiting-settings-categories-choose"} onClick={() => setCategory("fish")}>
                    <img src={require("../../../assets/img/fish.png")} alt="fish" />
                    <h5>Loài cá</h5>
                </div>
                <div className={category === "plant" && "waiting-settings-categories-choose"} onClick={() => setCategory("plant")}>
                    <img src={require("../../../assets/img/plant.png")} alt="plant" />
                    <h5>Cây cối</h5>
                </div>
                {/* <div className={category === "sport" && "waiting-settings-categories-choose"} onClick={() => setCategory("sport")}>
                    <img src={require("../../../assets/img/sport.png")} alt="sport" />
                    <h5>Thể thao</h5>
                </div> */}
                {/* <div className={category === "christmas" && "waiting-settings-categories-choose"} onClick={() => setCategory("christmas")}>
                    <img src={require("../../../assets/img/christmas-tree.png")} alt="chrismas" />
                    <h5>Giáng sinh</h5>
                </div> */}
                <div className={category === "drink" && "waiting-settings-categories-choose"} onClick={() => setCategory("drink")}>
                    <img src={require("../../../assets/img/drink.png")} alt="chrismas" />
                    <h5>Đồ uống</h5>
                </div>
            </div>
            <div className="waiting-settings-time">
                <div className={time === 60 && "waiting-settings-time-choose"} onClick={() => setTime(60)}>60s</div>
                <div className={time === 80 && "waiting-settings-time-choose"} onClick={() => setTime(80)}>80s</div>
                <div className={time === 100 && "waiting-settings-time-choose"} onClick={() => setTime(100)}>100s</div>
                <div className={time === 120 && "waiting-settings-time-choose"} onClick={() => setTime(120)}>120s</div>
                <div className={time === 160 && "waiting-settings-time-choose"} onClick={() => setTime(160)}>160s</div>
                <div className={time === 180 && "waiting-settings-time-choose"} onClick={() => setTime(180)}>180s</div>
            </div>
            <div onClick={() => setScreen("draw")} className="waiting-settings-start">
                Bắt đầu
            </div>
        </div>
    );
}

export default WaitingScreen;