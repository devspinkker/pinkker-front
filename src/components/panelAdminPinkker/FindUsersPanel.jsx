import React, { useState } from "react";
import { PanelAdminPinkkerInfoUser } from "../../services/backGo/user";
import UserStreamInfoPanel from "./UserStreamInfoPanel";

export default function FindUsersPanel({ Code }) {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");

    if (token) {
      try {
        const res = await PanelAdminPinkkerInfoUser(Code, "", token, username);
        if (res?.message) {
          setUserInfo(res.user);
          setStreamInfo(res.stream);
        }
      } catch (error) {
        console.error("Error al buscar usuario:", error);
      }
    }
  };

  return (
    <div className="FindUsersPanelFindUsersPanel">
      <div className="FindUsersPanelFindUsersPanelForm">
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="usernameInput">Nombre de Usuario:</label>
          <input
            type="text"
            id="usernameInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {userInfo && streamInfo && (
        <UserStreamInfoPanel
          Code={Code}
          userInfo={userInfo}
          streamInfo={streamInfo}
        />
      )}
    </div>
  );
}
