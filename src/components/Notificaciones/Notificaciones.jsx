import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom"; // Asegúrate de importar useHistory
import "./Notificaciones.css";

export default function Notificaciones({ PinkerNotifications }) {
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const history = useHistory(); // Inicializa el hook useHistory

  useEffect(() => {
    console.log(PinkerNotifications);
  }, [PinkerNotifications]);

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
    // Redirige al usuario manualmente
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

  return (
    <div className="notifications-container">
      <ul
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="notifications-list"
      >
        {PinkerNotifications.map((notification, index) => (
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
