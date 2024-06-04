import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { GetWithdrawalRequest } from "../../services/backGo/solicitudApanelPinkker";
import UpdateCategorie from "./UpdateCategorie";
import WithdrawalRequest from "./WithdrawalRequest";
import FindUsersPanel from "./FindUsersPanel";
import Advertisements from "./Advertisements";

export default function Main() {
  const [code, setCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [activePanel, setActivePanel] = useState(null); // Estado para rastrear el panel activo
  const [withdrawalRequestInfo, setWithdrawalRequestInfo] = useState(null);

  const token = window.localStorage.getItem("token");
  const handleCodeSubmit = async (e) => {
    e.preventDefault();

    if (activePanel === "retiros" && code !== "" && token) {
      try {
        const withdrawalRequestData = await GetWithdrawalRequest(code, token);
        if (withdrawalRequestData.message == "ok") {
          setWithdrawalRequestInfo(withdrawalRequestData.data);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case "categorias":
        return <UpdateCategorie />;
      case "retiros":
        return (
          <div style={{ width: "700px" }}>
            <form
              className="renderActivePanel-main"
              onSubmit={handleCodeSubmit}
            >
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingrese el código"
              />
              <button type="submit">Enviar</button>
            </form>
            {withdrawalRequestInfo && (
              <WithdrawalRequest
                withdrawalRequestInfo={withdrawalRequestInfo}
                Code={code}
              />
            )}
          </div>
        );
      case "usuarios":
        return (
          <div>
            <form
              className="renderActivePanel-main"
              onSubmit={handleCodeSubmit}
            >
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingrese el código"
              />
            </form>
            <FindUsersPanel Code={code} />
          </div>
        );
      case "Ads":
        return (
          <div>
            <form
              className="renderActivePanel-main"
              onSubmit={handleCodeSubmit}
            >
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingrese el código"
              />
            </form>
            <Advertisements Code={code} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <div>
        <div className="button-container">
          <button onClick={() => setActivePanel("categorias")}>
            Categorías
          </button>
          <button onClick={() => setActivePanel("retiros")}>Retiros</button>
          <button onClick={() => setActivePanel("usuarios")}>Usuarios</button>
          <button onClick={() => setActivePanel("Ads")}>Ads</button>
        </div>
        <div className="categories-container">{renderActivePanel()}</div>
      </div>
    </div>
  );
}
