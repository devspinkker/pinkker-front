import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Notificaciones.css";

export default function Notificaciones({ PinkerNotifications }) {
  useEffect(() => {
    console.log(PinkerNotifications);
  }, [PinkerNotifications]);

  const truncateTitle = (title, length) => {
    if (title.length > length) {
      return `${title.substring(0, length)}...`;
    }
    return title;
  };

  return (
    <div className="notifications-container">
      <ul className="notifications-list">
        {PinkerNotifications.map((notification, index) => (
          <Link to={`/${notification.Nameuser}`} className="notification-link">
            <li key={index} className="notification-item">
              <img
                className="notification-avatar"
                src={notification.Avatar}
                alt={`${notification.Nameuser}'s avatar`}
                width={50}
              />
              <div className="notification-content">
                <p className="notification-user" title={notification.Title}>
                  {notification.Nameuser} -{" "}
                  {truncateTitle(notification.Title, 20)}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
