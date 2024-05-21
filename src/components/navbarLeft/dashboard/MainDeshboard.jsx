import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MainDeshboard.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { Grid } from "@mui/material";

export default function MainDeshboard({ user, tyExpanded, setExpanded }) {
  const [expandedMenus, setExpandedMenus] = useState({
    // Monetizacion: false,
    // Logros: false,
    // Studio: false,
    // Comunidad: false,
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
    // Monetizacion: ["Ingresos", "Ganancias", "Transacciones"],
    // Logros: ["Logro 1", "Logro 2", "Logro 3"],
    // Studio: ["Proyectos", "Diseños", "Bocetos"],
    // Comunidad: ["Foro", "Grupos", "Eventos"],
    Ajustes: ["Configuración", "Clave"],
    Estadisticas: ["Analytics"],
  };

  const menuItems = [
    { title: "Stream", icon: "fas fa-tv" },
    { title: "Contenido", icon: "fas fa-tv" },
    { title: "Analytics", icon: "fas fa-tv" },
    { title: "Comentarios", icon: "fas fa-tv" },
    { title: "Ingresos", icon: "fas fa-money-bill-wave" },
    // { title: "Logros", icon: "fas fa-trophy" },
    // { title: "Studio", icon: "fas fa-paint-brush" },
    // { title: "Comunidad", icon: "fas fa-users" },
    // { title: "Ajustes", icon: "fas fa-cog" },
    // { title: "Estadisticas", icon: "fas fa-cog" },
  ];

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <aside className="MainDeshboard ">
        <div
          style={{
            position: !tyExpanded && "relative",
            left: !tyExpanded && "0px",
          }}
          className="dashboard-left-menu-header"
        >

          <button
            onClick={() => toggleexpandedMenu()}
            className="menu-activator-icon"
          >
            <div
              className="base-icon icon"
              style={{ width: "20px", height: "20px" }}
            >
              <GiHamburgerMenu style={{ fontSize: '25px' }} />

            </div>
          </button>
        </div>
        <Grid style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>


          {menuItems.map((item, index) => (
            <div key={index} style={{width:'100%'}}>
              <div
                style={{
                  backgroundColor: expandedMenus[item.title]
                    ? "#313538"
                    : item.title === "Stream"
                      ? "#53fc18"
                      : "transparent",
                  color: item.title == "Stream" ? "#0e0e10" : "",
                  cursor: "pointer",
                  justifyContent: !tyExpanded ? 'center !important' : 'flex-start !important'
                }}
                className="dashboard-left-menu-item"
              >
                <div
                  aria-current="page"
                  className={`menu-item-link item-selected ${expandedMenus[item.title] ? "menu-extended" : ""
                    }`}
                  onClick={() => handleItemClick(item.title)}
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
                      <Link
                        style={{
                          color: item.title === "Stream" ? "#080808" : "#fff",
                        }}
                        to={"/" + user?.NameUser + "/dashboard/stream"}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </div>
                </div>
                {/* {item.title !== "Stream" && (
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
                )} */}
              </div>
              {/* <div
                className={`items-container-expandedMenus ${expandedMenus[item.title] ? "expanded" : ""
                  }`}
              >
                {expandedMenus[item.title] &&
                  menuElements[item.title].map((element, elementIndex) => {
                    return (
                      <Link to={"/" + user?.NameUser + "/dashboard/" + element}>
                        <div key={elementIndex} className="menu-item-sublink">
                          {element}
                        </div>
                      </Link>
                    );
                  })}
              </div> */}
            </div>
          ))}
        </Grid>
      </aside>

    </div>
  );
}
