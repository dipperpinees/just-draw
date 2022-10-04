import React from 'react';
import "./styles.scss";

function Modal({message, onClose}) {
    return (
        <div className='modal-container'>
            <div className='modal'>
                {message}
                <div className='modal-ok' onClick={onClose}>
                    OK
                </div>
            </div>
        </div>
    );
}

export default Modal;