import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom"; // Asegúrate de importar useHistory
import "./Notificaciones.css";
import { GetNotificacionesRecent, GetOldNotifications, follow, unfollow } from "../../services/backGo/user";

export default function Notificaciones({ PinkerNotifications }) {
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [page, setpage] = useState(1);
  const [notifications, setNotifications] = useState(PinkerNotifications);

  const token = window.localStorage.getItem("token");


  const history = useHistory();


  async function HandleGetRecentotificaciones() {
    const res = await GetNotificacionesRecent(token, page);

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

    switch (notification.type) {
      case "Follow":
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
    // HandleGetRecentotificaciones();
  };

  useEffect(() => {
    HandleGetRecentotificaciones();
  }, [])




  const [followParametro, setFollowParametro] = useState(false);

  async function followUser(userId) {

    const data = await follow(token, userId);
    if (data != null) {

      setFollowParametro(true);
    } else {
      alert(data);
    }
  }

  async function unfollowUser(userId) {
    const data = await unfollow(token, userId);
    if (data != null) {

      setFollowParametro(false);
    } else {
      alert(data);
    }
  }
  function calcularTiempoTranscurrido(notificacion) {

    const ahora = new Date();
    const fechaNotificacion = new Date(notificacion?.timestamp);

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
        {notifications.map((notification, index) => {
          return (
            <li
              className="notification-item"
              key={index}
              onClick={() => handleNotificationClick(notification.nameuser)} // Maneja el clic aquí
            >
              <img
                className="notification-avatar"
                src={notification.avatar}
                alt={`${notification.nameuser}'s avatar`}
                width={50}
              />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>

                <div className="notification-content">

                  <p className="notification-user">
                    <strong>{notification.nameuser}</strong>{" "}
                    {renderNotificationText(notification, index)}
                  </p>
                  <p style={{ fontSize: 16 }}>
                    {calcularTiempoTranscurrido(notification)}
                  </p>

                </div>


                {followParametro ? (
                  <button
                    style={{ marginLeft: "5px" }}
                    className="channel-bottom-v2-button-follow"
                    onClick={() => unfollowUser(notification.idUser)}
                  >
                    dejar de seguir
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(notification.idUser)}
                    style={{ marginLeft: "5px" }}
                    className="channel-bottom-v2-button-follow"
                  >
                    Seguir
                  </button>
                )}

              </div>

            </li>
          )

        }
        )}
      </ul>
      {/* <div className="load-more-button" onClick={handleLoadMore}>
        <i className=" fas fa-chevron-down"></i>
      </div> */}
    </div >
  );
}
