import React from "react";

import Message from "../../../channel/chat/Message";
import "./Messages.css";

const Messages = ({ messages, name, room }) => {
  return (
    <div className="stream-messages">
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} room={room} />
        </div>
      ))}
    </div>
  );
};

export default Messages;