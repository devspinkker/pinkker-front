import React from "react";
import "./WithdrawalRequest.css";
import {
  PanelAdminPinkkerbanStreamer,
  PanelAdminPinkkerRemoveBanStreamer,
} from "../../services/backGo/user";

export default function UserStreamInfoPanel({ Code, userInfo, streamInfo }) {
  const handleBanStreamerClick = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const res = await PanelAdminPinkkerbanStreamer(
          Code,
          userInfo.id,
          token
        );
      } catch (error) {
        console.error("Error banning streamer:", error);
      }
    }
  };

  const handleRemoveBanStreamerClick = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const res = await PanelAdminPinkkerRemoveBanStreamer(
          Code,
          userInfo.id,
          token
        );
      } catch (error) {
        console.error("Error unbanning streamer:", error);
      }
    }
  };

  return (
    <div className="userStreamInfo">
      <h3>Información del Usuario</h3>
      <p>
        <strong>Pixeles:</strong> {userInfo.Pixeles}
      </p>
      <p>
        <strong>Nombre de Usuario:</strong> {userInfo.NameUser}
      </p>
      <p>
        <strong>Subscribers:</strong> {userInfo.Subscribers?.length}
      </p>
      <p>
        <strong>Followers:</strong> {Object.keys(userInfo?.Followers).length}
      </p>
      <p>
        <strong>Email:</strong> {userInfo?.Email}
      </p>
      <img src={userInfo.Avatar} alt="Avatar del Usuario" className="avatar" />

      {userInfo.Banned ? (
        <button className="banButton" onClick={handleRemoveBanStreamerClick}>
          Quitar Ban
        </button>
      ) : (
        <button className="banButton" onClick={handleBanStreamerClick}>
          Ban Streamer
        </button>
      )}

      <h3>Información del Stream</h3>
      <p>
        <strong>Título del Stream:</strong> {streamInfo.stream_title}
      </p>
      <p>
        <strong>Categoría:</strong> {streamInfo.stream_category}
      </p>
      <p>
        <strong>Idioma:</strong> {streamInfo.stream_idiom}
      </p>
      <p>
        <strong>Fecha de Inicio:</strong>{" "}
        {new Date(streamInfo.start_date).toLocaleString()}
      </p>
    </div>
  );
}
