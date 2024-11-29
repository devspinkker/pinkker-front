import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom"; // Asegúrate de importar useHistory
import "./Notificaciones.css";
import { GetRecentotificaciones } from "../../services/backGo/user";

export default function Notificaciones({ PinkerNotifications }) {
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [page, setpage] = useState(2);
  const [notifications, setNotifications] = useState(PinkerNotifications);
  const token = window.localStorage.getItem("token");


  const history = useHistory();



  async function HandleGetRecentotificaciones() {
    const res = await GetRecentotificaciones(token, page);

    if (res.message == "ok" && res?.notifications) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...res.notifications,
      ]);
    }
  }

  const truncateText = (text, length) => {
    if (text?.length > length) {
      return `${text.substring(0, length)}...`;
    }
    return text;
  };

  const toggleExpand = (index) => {
    setExpandedNotifications((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleNotificationClick = (userName) => {
    history.push(`/${userName}`);
  };

  const renderNotificationText = (notification, index) => {
    const isExpanded = expandedNotifications[index];

    switch (notification.Type) {
      case "follow":
        return `te ha comenzado a seguir.`;
      case "DonatePixels":
        return (
          <>
            te ha donado {notification.Pixeles} pixeles.{" "}
            {notification.Text && (
              <>
                {isExpanded
                  ? notification.Text
                  : truncateText(notification.Text, 20)}
                {notification.Text.length > 20 && (
                  <span
                    className="toggle-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(index);
                    }}
                  >
                    {isExpanded ? " ver menos" : " ver más"}
                  </span>
                )}
              </>
            )}
          </>
        );
      case "Suscribirse":
        return (
          <>
            se ha suscrito a tu canal.{" "}
            {notification.Text && (
              <>
                {isExpanded
                  ? notification.Text
                  : truncateText(notification.Text, 40)}
                {notification.Text.length > 40 && (
                  <span
                    className="toggle-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(index);
                    }}
                  >
                    {isExpanded ? " ver menos" : " ver más"}
                  </span>
                )}
              </>
            )}
          </>
        );
      default:
        return notification.Text
          ? isExpanded
            ? notification.Text
            : truncateText(notification.Text, 20)
          : "ha interactuado contigo.";
    }
  };

  const handleLoadMore = () => {
    setpage((prevPage) => prevPage + 1);
    HandleGetRecentotificaciones();
  };

  function calcularTiempoTranscurrido(notificacion) {

    const ahora = new Date();
    const fechaNotificacion = new Date(notificacion?.since);

    const diferenciaMs = ahora - fechaNotificacion;
    const diferenciaSegundos = Math.floor(diferenciaMs / 1000);
    const diferenciaMinutos = Math.floor(diferenciaSegundos / 60);
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    const diferenciaDias = Math.floor(diferenciaHoras / 24);

    if (diferenciaSegundos < 60) {
      return "Hace unos segundos";
    } else if (diferenciaMinutos < 60) {
      return `Hace ${diferenciaMinutos} minuto${diferenciaMinutos > 1 ? "s" : ""}`;
    } else if (diferenciaHoras < 24) {
      return `Hace ${diferenciaHoras} hora${diferenciaHoras > 1 ? "s" : ""}`;
    } else {
      return `Hace ${diferenciaDias} día${diferenciaDias > 1 ? "s" : ""}`;
    }
  }
  return (
    <div className="notifications-container">
      <ul
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="notifications-list"
      >
        {notifications.map((notification, index) => (
          <li
            className="notification-item"
            key={index}
            onClick={() => handleNotificationClick(notification.Nameuser)} // Maneja el clic aquí
          >
            <img
              className="notification-avatar"
              src={notification.Avatar}
              alt={`${notification.Nameuser}'s avatar`}
              width={50}
            />
            <div className="notification-content">
              <p className="notification-user">
                <strong>{notification.Nameuser}</strong>{" "}
                {renderNotificationText(notification, index)}
              </p>
              <p style={{ fontSize: 12 }}>
                {calcularTiempoTranscurrido(notification)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="load-more-button" onClick={handleLoadMore}>
        <i className=" fas fa-chevron-down"></i>
      </div>
    </div>
  );
}
