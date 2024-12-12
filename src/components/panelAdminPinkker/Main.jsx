import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { GetWithdrawalRequest } from "../../services/backGo/solicitudApanelPinkker";
import UpdateCategorie from "./UpdateCategorie";
import WithdrawalRequest from "./WithdrawalRequest";
import FindUsersPanel from "./FindUsersPanel";
import Advertisements from "./Advertisements";
import Emotes from "./Emotes";
import Ingresos from "./Ingresos";
import UtilsPinkkerImgs from "./UtilsPinkkerImgs";

export default function Main() {
  const [code, setCode] = useState("");
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
      } catch (err) {}
    }
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case "categorias":
        return (
          <div style={{ width: "700px" }}>
            <UpdateCategorie />
          </div>
        );

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
      case "Emotes":
        return (
          <div
            style={{
              width: "100%",
            }}
          >
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
            <Emotes Code={code} />
          </div>
        );
      case "Ingresos":
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
            <Ingresos Code={code} />
          </div>
        );

      case "Utils imgs":
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
            <UtilsPinkkerImgs Code={code} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <div className="containerPanelAdmin">
        <div className="button-container">
          <button onClick={() => setActivePanel("categorias")}>
            Categorías
          </button>
          <button onClick={() => setActivePanel("retiros")}>Retiros</button>
          <button onClick={() => setActivePanel("usuarios")}>Usuarios</button>
          <button onClick={() => setActivePanel("Ads")}>Ads</button>
          <button onClick={() => setActivePanel("Emotes")}>Emotes</button>
          <button onClick={() => setActivePanel("Ingresos")}>Ingresos</button>
            <button onClick={() => setActivePanel("Utils imgs")}>Utils imgs</button>
        </div>
        <div className="categories-container">{renderActivePanel()}</div>
      </div>
    </div>
  );
}
