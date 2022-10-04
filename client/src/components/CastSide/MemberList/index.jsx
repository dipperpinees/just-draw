import React, { useEffect, useState } from 'react';
import Member from '../Member';
import "./styles.scss";

function MemberList({socket}) {
    const [memberList, setMemberList] = useState([]);
    useEffect(() => {
        socket?.on('answer', (args) => {
            if(args.type) {
                setMemberList(args.listPlayer);
            }
        })
        socket?.on("playerjoin", (args) => {
            setMemberList(args);
        })

        socket?.on('endgame', (args) => {
            setMemberList(args.listPlayer);
        })

        socket?.on('newquiz', ({listPlayer}) => {
            setMemberList(listPlayer);
        })

        socket?.on('status', ({type, listPlayer}) => {
            if(type === 'memberleave') {
                setMemberList(listPlayer);
            }
        })
        // socket?.on('newquiz', ({listPlayer}) => {
        //     setMemberList(listPlayer);
        // })    

        // socket.on('')
    }, [socket])

    return (
        <ul className="member-list">
            {memberList?.map((member, index) => (
                <li key={index}> <Member name={member.name} score={member.score} avatar={member.avatar} isAnswer={member.isAnswer} isPaint={member.isPaint}/> </li>
            ))}
        </ul>
    );
}

export default MemberList;