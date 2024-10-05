// ChatSettings.js
import React, { useEffect } from "react";
// import "./ChatSettings.css"; // Asegúrate de tener estilos para este componente
import Notificaciones from "../Notificaciones/Notificaciones";
import { Grid, Typography } from "@mui/material";
import Message from "../message/Message";
const LayoutMessageNotis = ({
  messagesOpen,
  openMessage,
  PinkerNotifications,
}) => {
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    console.log(messagesOpen);
  }, []);

  return (
    <div>
      <Grid
        style={{
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          // border: "1px solid #343843",
          transition: "width 1s ease-in-out",
          padding: "1.70rem",
        }}
      >
        <Typography
          style={{
            color: "white",
            fontWeight: 600,
            textAlign: "center",
            fontSize: "18px",
            width: "100%",
          }}
        >
          {openMessage ? "Mensajes" : "Notificaciones"}
        </Typography>
      </Grid>
      <div
        style={{
          transition: "width 1s ease-in-out",
        }}
      >
        {openMessage && messagesOpen ? (
          <Message messagesOpen1={messagesOpen} />
        ) : (
          <Notificaciones PinkerNotifications={PinkerNotifications} />
        )}
      </div>
    </div>
  );
};

export default LayoutMessageNotis;
