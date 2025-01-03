  import React, { useEffect, useState } from "react";
  import { Link, useHistory } from "react-router-dom"; // Asegúrate de importar useHistory
  import "./Notificaciones.css";
  import { GetNotificacionesRecent, GetOldNotifications, follow, unfollow } from "../../services/backGo/user";

  export default function Notificaciones({ PinkerNotifications,user }) {
    const [expandedNotifications, setExpandedNotifications] = useState({});
    const [page, setpage] = useState(1);
    const [notifications, setNotifications] = useState(PinkerNotifications);

    const token = window.localStorage.getItem("token");

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
    }

  useEffect(() => {
    if (PinkerNotifications && PinkerNotifications.length > 0) {
      const newNotifications = PinkerNotifications.filter(
        (newNotif) =>
          !notifications.some((notif) => notif.timestamp === newNotif.timestamp)
      );

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev]);
      }
    }
  }, [PinkerNotifications]);
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

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
        return `comenzó a seguirte.`;
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




  const [followStatus, setFollowStatus] = useState({}); 

  async function followUser(userId) {
    try {
      const data = await follow(token, userId); // Llamada al servicio para seguir.
      if (data) {
        setFollowStatus((prev) => ({ ...prev, [userId]: true })); // Actualiza el estado de seguimiento localmente.
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.idUser === userId ? { ...notif, isFollowed: true } : notif
          )
        );
      } else {
        alert("No se pudo seguir al usuario.");
      }
    } catch (error) {
      console.error("Error al seguir al usuario:", error);
    }
  }
  
  async function unfollowUser(userId) {
    try {
      const data = await unfollow(token, userId); // Llamada al servicio para dejar de seguir.
      if (data) {
        setFollowStatus((prev) => ({ ...prev, [userId]: false })); // Actualiza el estado de seguimiento localmente.
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.idUser === userId ? { ...notif, isFollowed: false } : notif
          )
        );
      } else {
        alert("No se pudo dejar de seguir al usuario.");
      }
    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
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
  const isFollowing = notification.isFollowed; // Prioriza el estado local si existe.

  return (
    <li
      className="notification-item"
      key={index}
      onClick={() => handleNotificationClick(notification.nameuser)}
    >
      <img
        className="notification-avatar"
        src={notification.avatar}
        alt={`${notification.nameuser}'s avatar`}
        width={50}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div className="notification-content">
          <p className="notification-user">
            <strong>{notification.nameuser}</strong>{" "}
            {renderNotificationText(notification, index)}
          </p>
          <p style={{ fontSize: 16 }}>
            {calcularTiempoTranscurrido(notification)}
          </p>
        </div>

        {isFollowing ? (
          <button
            style={{
              marginLeft: "5px",
              fontSize: isMobile && "16px",
              width: isMobile && "25%",
              padding: isMobile && "8px",
            }}
            className="channel-bottom-v2-button-follow"
            onClick={(e) => {
              e.stopPropagation();
              unfollowUser(notification.idUser);
            }}
          >
            Dejar de seguir
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              followUser(notification.idUser);
            }}
            style={{
              marginLeft: "5px",
              fontSize: isMobile && "16px",
              width: isMobile && "25%",
              padding: isMobile && "8px",
            }}
            className="channel-bottom-v2-button-follow"
          >
            Seguir
          </button>
        )}
      </div>
    </li>
  );
})}


      </ul>
      {/* <div className="load-more-button" onClick={handleLoadMore}>
        <i className=" fas fa-chevron-down"></i>
      </div> */}
    </div >
  );
}
