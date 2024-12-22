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
  openNotification,
  NewChatMessageForChannel,
  user
}) => {
  const token = window.localStorage.getItem("token");



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
            fontSize: "24px",
            width: "100%",
          }}
        >
          {openMessage ? "Mensajes" : "Notificaciones"}
        </Typography>

        <IoMdClose
          onClick={() =>
            openMessage ? setOpenMessage(false) : setOpenNotification(false)
          }
          style={{ color: "white", cursor: "pointer", fontSize: 24 }}
        />


      </Grid>
      <div
        style={{
          transition: "width 1s ease-in-out",
        }}
      >
        {openMessage && messagesOpen &&(
          <Message
            messagesOpen1={messagesOpen}
            NewChatMessageForChannel={NewChatMessageForChannel}
          />
        ) }
        {
          <div
          style={{
            display: !messagesOpen || !openMessage ? "block" : "none",
          }}
          >
              <Notificaciones PinkerNotifications={PinkerNotifications} user={user}/>

          </div>
        }
      </div>
    </div>
  );
};

export default LayoutMessageNotis;
