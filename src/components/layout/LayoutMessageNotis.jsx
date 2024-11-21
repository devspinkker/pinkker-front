// ChatSettings.js
import React, { useEffect } from "react";
// import "./ChatSettings.css"; // Asegúrate de tener estilos para este componente
import Notificaciones from "../Notificaciones/Notificaciones";
import { Grid, Typography } from "@mui/material";
import Message from "../message/Message";
import { IoIosCloseCircle, IoMdClose } from "react-icons/io";
const LayoutMessageNotis = ({
  messagesOpen,
  openMessage,
  PinkerNotifications,
  setOpenMessage,
  setOpenNotification,
  openNotification
}) => {
  const token = window.localStorage.getItem("token");

  useEffect(() => {

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
        <IoMdClose
          onClick={() => openMessage ? setOpenMessage(false) : setOpenNotification(false)}
          style={{ color: "white", cursor: "pointer" }}
        />
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
