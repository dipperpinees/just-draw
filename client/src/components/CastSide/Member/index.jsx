import React from 'react';
import { avatarList } from '../../../helper/avatarList';
import { handleName } from '../../../helper/handleQuiz';
import Avatar from '../Avatar';
import "./styles.scss";
import { BiPaint } from "react-icons/bi";

function Member({name, avatar, score, isAnswer, isPaint}) {
    return (
        <div className='member'>
            <div className='member-avatarname'>
                <Avatar
                    src={avatarList[avatar]}
                    width={36} height={36} type="circle" />
                <p style={{color: isAnswer ? "#58bc34" : "#000"}}>{handleName(name)}</p>
            </div>
            <div className='member-status'>
                {isPaint && <BiPaint />}
                {/* {score} */}
                <span style={{color: isAnswer ? "#58bc34" : "#000"}}>{score}</span>
            </div>
        </div>
    );
}

export default Member;