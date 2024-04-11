import React, { useState, useEffect } from "react";
import { getUserByIdTheToken } from "../../../services/backGo/user";
import { updataCommands, getCommands } from "../../../services/backGo/chat";

import "./StreamManager.css";
import ComandosList from "./ComandosList";

export default function ConfigComandosChat({
  showComandosList,
  handleToggleComandosList,
}) {
  const [userData, setUserData] = useState(null);
  const [commands, setCommands] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const id = window.localStorage.getItem("_id");
      const token = window.localStorage.getItem("token");

      const resUser = await getUserByIdTheToken(token);
      if (resUser?.message === "ok") {
        setUserData(resUser.data);
      } else {
        setUserData([]);
      }

      const resCommands = await getCommands(token);
      if (resCommands?.message === "ok") {
        setCommands(resCommands.data);
      } else {
        setCommands({});
      }
    };
    fetchData();
  }, []);

  return (
    <div className="stream-manager">
      <button onClick={handleToggleComandosList}>
        {showComandosList ? "Ocultar Comandos" : "Editar Comandos"}
      </button>
      {showComandosList && (
        <div className="ComandosList-content">
          <ComandosList commands={commands} setCommands={setCommands} />
        </div>
      )}
    </div>
  );
}
