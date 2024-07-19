import React, { useState } from "react";
import "./WithdrawalRequest.css";
import {
  PanelAdminPinkkerbanStreamer,
  PanelAdminPinkkerRemoveBanStreamer,
  PanelAdminPinkkerPartnerUser,
  PanelAdminPinkkerCreateAdmin,
  PanelAdminPinkkerChangeNameUser,
} from "../../services/backGo/user";

export default function UserStreamInfoPanel({ Code, userInfo, streamInfo }) {
  const [showPartnerPanel, setShowPartnerPanel] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [NameUserNew, setNameUserNew] = useState("");
  const [level, setLevel] = useState(0);

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
  const handlePanelAdminPinkkerPartnerUser = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const res = await PanelAdminPinkkerPartnerUser(
          Code,
          userInfo.id,
          token
        );
      } catch (error) {
        console.error("Error changing partner status:", error);
      }
    }
  };
  const handlePanelAdminPinkkerChangeNameUser = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        await PanelAdminPinkkerChangeNameUser(
          Code,
          userInfo.NameUser,
          NameUserNew,
          token
        );
      } catch (error) {
        console.error("Error changing username:", error);
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

  const handleCreatePartnerClick = () => {
    setShowPartnerPanel(true);
  };

  const handleCreatePartnerSubmit = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const res = await PanelAdminPinkkerCreateAdmin(
          Code,
          userInfo.id,
          Number(level),
          newCode,
          token
        );
        setShowPartnerPanel(false);
        setNewCode("");
        setLevel("");
      } catch (error) {
        console.error("Error creating partner:", error);
      }
    }
  };

  return (
    <div className="userStreamInfoPanel">
      <section className="userInfoSection">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "60px",
            justifyContent: "space-around",
          }}
        >
          <h3>Información del Usuario</h3>
          <img
            src={userInfo.Avatar}
            alt="Avatar del Usuario"
            className="avatar"
          />
        </div>
        <div className="userInfo">
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
            <strong>Followers:</strong>{" "}
            {/* {Object.keys(userInfo?.Followers).length} */}
          </p>
          <p>
            <strong>Email:</strong> {userInfo?.Email}
          </p>

          {userInfo.Banned ? (
            <button
              className="banButton"
              onClick={handleRemoveBanStreamerClick}
            >
              Quitar Ban
            </button>
          ) : (
            <button className="banButton" onClick={handleBanStreamerClick}>
              Ban Streamer
            </button>
          )}
          {!userInfo.Partner?.active ? (
            <button
              className="banButton"
              onClick={handlePanelAdminPinkkerPartnerUser}
            >
              Dar Partner
            </button>
          ) : (
            <button
              className="banButton"
              onClick={handlePanelAdminPinkkerPartnerUser}
            >
              Quitar Partner
            </button>
          )}
          <button className="banButton" onClick={handleCreatePartnerClick}>
            Crear Partner
          </button>
          <label className="banButton">
            Nombre de Usuario a Remover:
            <input
              type="text"
              value={NameUserNew}
              placeholder="Nombre de Usuario a Remover"
              onChange={(e) => setNameUserNew(e.target.value)}
            />
          </label>
          <button
            className="banButton"
            onClick={handlePanelAdminPinkkerChangeNameUser}
          >
            Cambiar Nombre de Usuario
          </button>
        </div>
      </section>
      <section className="streamInfoSection">
        <h3>Información del Stream</h3>
        <div className="streamInfo">
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
      </section>
      {showPartnerPanel && (
        <div className="partnerPanel">
          <h3>Crear Partner</h3>
          <label>
            Nuevo Código:
            <input
              type="text"
              value={newCode}
              placeholder="Code"
              onChange={(e) => setNewCode(e.target.value)}
            />
          </label>
          <label>
            Nivel:
            <input
              placeholder="level"
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </label>
          <button onClick={handleCreatePartnerSubmit}>Enviar</button>
          <button onClick={() => setShowPartnerPanel(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
