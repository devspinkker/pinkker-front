import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MainDeshboard.css";

export default function MainDeshboard({ user, tyExpanded, setExpanded }) {
  const [expandedMenus, setExpandedMenus] = useState({
    Monetizacion: false,
    Logros: false,
    Studio: false,
    Comunidad: false,
    Ajustes: false,
  });
  const toggleexpandedMenu = () => {
    setExpanded(!tyExpanded);
  };

  const handleItemClick = (title) => {
    if (title !== "Stream") {
      setExpandedMenus({
        ...expandedMenus,
        [title]: !expandedMenus[title],
      });
    }
  };

  // Definir los elementos correspondientes a cada título del menú
  const menuElements = {
    Monetizacion: ["Ingresos", "Ganancias", "Transacciones"],
    Logros: ["Logro 1", "Logro 2", "Logro 3"],
    Studio: ["Proyectos", "Diseños", "Bocetos"],
    Comunidad: ["Foro", "Grupos", "Eventos"],
    Ajustes: ["Configuración"],
  };

  const menuItems = [
    { title: "Stream", icon: "fas fa-tv" },
    { title: "Monetizacion", icon: "fas fa-money-bill-wave" },
    { title: "Logros", icon: "fas fa-trophy" },
    { title: "Studio", icon: "fas fa-paint-brush" },
    { title: "Comunidad", icon: "fas fa-users" },
    { title: "Ajustes", icon: "fas fa-cog" },
  ];

  return (
    <div>
      <aside className="MainDeshboard min-w-[256px] max-w-[256px] px-1 !hidden md:!flex">
        <div
          style={{
            position: !tyExpanded && "relative",
            left: !tyExpanded && "20px",
          }}
          className="dashboard-left-menu-header"
        >
          <div
            style={{
              display: tyExpanded ? "" : "none",
            }}
            className="menu-title max-w-full opacity-100"
          >
            Panel de control del creador
          </div>
          <button
            onClick={() => toggleexpandedMenu()}
            className="menu-activator-icon right-1 variant-text size-md base-icon-button menu-activator-icon right-1"
          >
            <div
              className="base-icon icon"
              style={{ width: "20px", height: "20px" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.75 11.75H1V13.5H9.75V11.75Z"
                  fill="currentColor"
                ></path>
                <path d="M9.75 3H1V4.75H9.75V3Z" fill="currentColor"></path>
                <path d="M8 7.375H1V9.125H8V7.375Z" fill="currentColor"></path>
                <path
                  d="M13.25 3.875L9.3125 7.63313C9.3125 8.11438 9.3125 8.38563 9.3125 8.87125L13.25 12.6294H15V3.875H13.25Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              style={{
                backgroundColor: expandedMenus[item.title]
                  ? "#313538"
                  : item.title === "Stream"
                  ? "#53fc18"
                  : "transparent",
                cursor: "pointer",
              }}
              className="dashboard-left-menu-item"
            >
              <div
                aria-current="page"
                className={`menu-item-link item-selected ${
                  expandedMenus[item.title] ? "menu-extended" : ""
                }`}
                onClick={() => handleItemClick(item.title)}
                style={{
                  color: item.title === "Stream" ? "#080808" : "#fff",
                }}
              >
                <div className="menu-item-icon-holder w-5">
                  <i
                    className={item.icon}
                    style={{
                      color: "#fff",
                      color: item.title === "Stream" ? "#080808" : "#fff",
                    }}
                  ></i>
                </div>
                <div
                  style={{
                    display: tyExpanded ? "" : "none",
                    color: "#fff",
                  }}
                  className="item-title"
                >
                  {item?.title == "Stream" ? (
                    <Link to={"/" + user?.NameUser + "/dashboard/stream"}>
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </div>
              </div>
              {item.title !== "Stream" && (
                <div
                  onClick={() => handleItemClick(item.title)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <i
                    className="fas fa-chevron-left"
                    style={{
                      margin: "0px 10px",
                      cursor: "pointer",
                      color: "#fff",
                      transition: "200ms all",
                      transform: expandedMenus[item.title]
                        ? "rotate(-90deg)"
                        : "rotate(90deg)",
                    }}
                  ></i>
                </div>
              )}
            </div>
            <div
              className={`items-container-expandedMenus ${
                expandedMenus[item.title] ? "expanded" : ""
              }`}
            >
              {expandedMenus[item.title] &&
                menuElements[item.title].map((element, elementIndex) => {
                  return (
                    <Link to={"/" + user?.NameUser + "/dashboard/ajustes"}>
                      <div key={elementIndex} className="menu-item-sublink">
                        {element}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
