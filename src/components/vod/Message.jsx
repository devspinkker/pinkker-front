import React from "react";

import "./Message.css";

import Emblem from "../emblem/Emblem";

export default function Message({ message }) {
  function getIcon() {
    if (message.isMod) {
      return (
        <Emblem
          chat={true}
          name="Moderador"
          img={"/images/emblem/moderador.jpg"}
        />
      );
    }

    if (message.isVip) {
      return <Emblem chat={true} name="VIP" img={"/images/emblem/vip.jpg"} />;
    }
  }

  return (
    <div className="vod-chat-message">
      <div>
        <p
          style={{
            color: "darkgray",
            fontSize: "12px",
            fontWeight: "600",
            marginRight: "5px",
          }}
        >
          00:15
        </p>
      </div>
      <div>
        <p
          style={{
            color: message.color,
            fontSize: "14px",
            fontWeight: "600",
            marginRight: "5px",
          }}
        >
          {getIcon()} {message.name}:
        </p>
      </div>
      <div>
        <p style={{ color: "#ededed", fontSize: "14px", fontWeight: "600" }}>
          {message.message}
        </p>
      </div>
    </div>
  );
}
