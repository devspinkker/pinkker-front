import React, { useState } from "react";
import "./ChatSettings.css";
import {
  DeleteAllMessages,
  UpdateChatBlockStatus,
  UpdateUserStatus,
} from "../../../services/backGo/Chats";

const ChatSettings = ({ chat, closeSettings, onStatusChange }) => {
  const token = window.localStorage.getItem("token");
  const id = window.localStorage.getItem("_id");
  const [bloqued, SetBloqued] = useState(
    id === chat?.user1
      ? chat.Blocked?.BlockedByUser1
      : chat.Blocked?.BlockedByUser2
  );
  const currentUserInfo = chat?.usersInfo?.find((user) => user.ID === id);

  const UserInfo = chat.usersInfo.find((user) => user.ID !== id);

  // Determina el estado que corresponde al usuario actual
  const currentUserStatus =
    currentUserInfo.ID === chat?.user1 ? chat?.StatusUser1 : chat?.StatusUser2;

  const handleUpdateStatus = (status) => {
    UpdateUserStatus(token, status, chat.chatID)
      .then((response) => {
        console.log("Estado actualizado:", response);
        onStatusChange(status, chat.chatID);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
      });
  };

  const handleDeleteUser = async () => {
    const res = await DeleteAllMessages(token, UserInfo?.ID);

    console.log("Usuario eliminado");
  };
  const handleblock = async () => {
    const res = await UpdateChatBlockStatus(token, chat?.chatID, !bloqued);
    SetBloqued(!bloqued);
    console.log("Usuario bloqueado");
  };
  return (
    <div className="chat-settings-container">
      <div className="chat-settings">
        <div className="crp2z">
          <h2>Configuración del Chat</h2>
          <i
            onClick={closeSettings}
            style={{
              marginRight: "10px",
              cursor: "pointer",
              color: "#ededed",
              padding: "7px",
              borderRadius: "3px",
            }}
            className="fas fa-times gray-button"
          />
        </div>
        <div className="user-info">
          <img src={UserInfo.Avatar} alt="Avatar" className="avatar" />
          <p>
            <strong>{UserInfo.NameUser}</strong>
          </p>
        </div>

        <div className="settings-options">
          {currentUserStatus === "primary" ? (
            <span
              className="settings-option"
              onClick={() => handleUpdateStatus("secondary")}
            >
              Mover a General
            </span>
          ) : (
            <span
              className="settings-option"
              onClick={() => handleUpdateStatus("primary")}
            >
              Mover a Principal
            </span>
          )}

          <span className="settings-option danger" onClick={handleblock}>
            {!bloqued ? "Bloquear" : "desbloquear"} chat
          </span>
          <span className="settings-option danger" onClick={handleDeleteUser}>
            Eliminar Chat
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
