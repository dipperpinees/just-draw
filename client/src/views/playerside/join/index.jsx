import React, { useState , useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Avatar from '../../../components/castside/avatar';
import { avatarList } from '../../../helper/avatarList';
import "./styles.scss";

function Join(props) {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(4);
    const [showChooseAvatar, setShowChooseAvatar] = useState(false);
    const [searchParams] = useSearchParams();
    const roomIdRef = useRef();

    const handleJoinRoom = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log()
        navigate(`/play?name=${formData.get("name")}&roomId=${formData.get("roomid")}&avatar=${avatar}`);
    }

    useEffect(() => {
        roomIdRef.current.value = searchParams.get("roomId");
    }, [])

    return (
        <form className='join' onSubmit={handleJoinRoom}>
            <div className="avatar-group"> 
                <div onClick={() => setShowChooseAvatar(!showChooseAvatar)}>
                    <Avatar width={72} height={72} type="circle" src={avatarList[avatar]} alt="avatar"/>
                </div>
                {showChooseAvatar && <div className='avatar-group-dropdown'>
                    {avatarList.map((avatar, index) => (
                        <div key={index} onClick={() => {setAvatar(index); setShowChooseAvatar(false)}}> 
                            <Avatar  width={36} height={36} type="circle" src={avatar} alt="avatar"/>
                        </div>
                    ))}
                </div>}
            </div>
            <input type="text" ref={roomIdRef} name="roomid" required  placeholder='Room Id'/>
            <input type="text" name="name" required placeholder='Name'/>
            <button type="submit">Tham gia</button>
        </form>
    );
}

export default Join;