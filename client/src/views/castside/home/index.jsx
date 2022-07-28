import React from 'react';
import { Link } from 'react-router-dom';
import "./styles.scss";

function Home(props) {

    return (
        <div className="home">
            <Link className="home-button" to="room">Tạo phòng</Link>
            <Link className="home-button" to="join">Tham gia</Link>
        </div>
    );
}

export default Home;