import React from 'react';

import "./Message.css";

import MessageChat from './chat/MessageChat';

export default function Message({socketMain, messagesOpen, closeMessageChat}) {

    return (
        <div className="message-body">
            {messagesOpen.map((message, index) => <MessageChat socketMain={socketMain} openedWindow={message.openedWindow} closeMessageChat={(e) => closeMessageChat(e)} index={index} to={message.streamer} />)}

        </div>
    );
}