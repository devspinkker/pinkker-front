import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { GetCodePanelPinkker } from "../../services/backGo/solicitudApanelPinkker";
import UpdateCategorie from "./UpdateCategorie";

export default function Main() {
  const [code, setCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [activePanel, setActivePanel] = useState(null); // Estado para rastrear el panel activo

  const token = window.localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {};

    fetchData();
  }, []);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await GetCodePanelPinkker(token, code);
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        setError("Invalid code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case "categorias":
        return <UpdateCategorie />;
      case "retiros":
        return <div>Retiros Component</div>; // Aquí iría el componente para "Retiros"
      case "usuarios":
        return <div>Usuarios Component</div>; // Aquí iría el componente para "Usuarios"
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
        </div>
        <div className="categories-container">{renderActivePanel()}</div>
      </div>
    </div>
  );
}
