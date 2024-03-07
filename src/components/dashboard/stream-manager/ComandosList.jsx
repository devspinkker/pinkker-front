import React, { useState, useEffect } from "react";
import { updataCommands, getCommands } from "../../../services/backGo/chat";

import "./ComandosList.css";
import { useNotification } from "../../Notifications/NotificationProvider";

export default function ConfigComandosChat({ user }) {
  const [commands, setCommands] = useState({});
  const [newCommand, setNewCommand] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const alert = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      const token = window.localStorage.getItem("token");

      const resCommands = await getCommands(token);
      console.log(resCommands);
      if (resCommands?.message === "ok" && resCommands?.data?.Commands) {
        setCommands(resCommands.data.Commands);
      } else {
        setCommands({});
      }
    };
    fetchData();
  }, []);

  const handleChangeCommand = (e) => {
    setNewCommand(e.target.value);
  };

  const handleChangeMessage = (e, command) => {
    const updatedCommands = { ...commands, [command]: e.target.value };
    setCommands(updatedCommands);
  };

  const handleAddCommand = async () => {
    if (!newCommand || !newMessage) return;
    const formattedCommand = `!${newCommand}`; // Agrega el signo de exclamación al principio del nuevo comando
    const updatedCommands = { ...commands, [formattedCommand]: newMessage };
    setCommands(updatedCommands);
    const token = window.localStorage.getItem("token");
    const res = await updataCommands(token, updatedCommands);
    console.log(res);

    if (res?.message !== "ok") {
      alert({ type: "ERROR" });
    }
    console.log(res);

    alert({ type: "SUCCESS" });
    setNewCommand("");
    setNewMessage("");
  };
  const handleUpdate = async () => {
    const token = window.localStorage.getItem("token");
    const res = await updataCommands(token, commands);
    if (res?.message !== "ok") {
      console.log(res);
    }
  };

  const handleDeleteCommand = (command) => {
    const updatedCommands = { ...commands };
    delete updatedCommands[command];
    setCommands(updatedCommands);
    handleUpdate();
  };

  return (
    <div className="socialnetwork-body">
      <div className="socialnetwork-body-container">
        <div>
          {Object.entries(commands).map(([command, message]) => (
            <div className="content-commands" key={command}>
              <label className="comandos-conteiner">{command}</label>
              <div className="comandos-conteiner-txt">
                <input
                  value={message}
                  onChange={(e) => handleChangeMessage(e, command)}
                  className="user-red"
                  type="text"
                />
              </div>
              <button
                className="user-red-delete-comando"
                onClick={() => handleDeleteCommand(command)}
              >
                borrar
              </button>
            </div>
          ))}
        </div>
        <div className="comando-input">
          <input
            type="text"
            value={newCommand}
            onChange={handleChangeCommand}
            placeholder="Nuevo comando"
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mensaje"
          />
          <button onClick={handleAddCommand}>Agregar</button>
        </div>
        {/* <div className="button-content-social">
          <button
            onClick={handleUpdate}
            className="variant-highlight size-md base-button w-[111px]"
            type="button"
          >
            <div className="button-content">
              <div className="inner-label">Guardar Cambios</div>
            </div>
          </button>
        </div> */}
      </div>
    </div>
  );
}
