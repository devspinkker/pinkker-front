import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MainDeshboard.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { Grid } from "@mui/material";
import { GrHomeRounded } from "react-icons/gr";
import { HiStatusOnline } from "react-icons/hi";
import { SiSimpleanalytics } from "react-icons/si";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdOndemandVideo, MdOutlinePermMedia } from "react-icons/md";
import { LiaCommentSolid } from "react-icons/lia";
import { IoSettingsSharp } from "react-icons/io5";

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
  const location = useLocation()
  
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
            padding: !tyExpanded ? "1.45rem 0rem" : ".8rem 0rem",
          }}
          className="dashboard-left-menu-header"
        >
          <button
            onClick={() => toggleexpandedMenu()}
            className="menu-activator-icon"
            style={{ width: !tyExpanded && "100%" }}
          >
            <div
              className="base-icon icon"
              style={{ width: "20px", height: "20px" }}
            >
              <GiHamburgerMenu style={{ fontSize: "25px" }} />
            </div>
          </button>
        </div>
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "all 1s ease",
            }}
          >
            <Link
              style={{ textDecoration: "none" }}
              className="menu-aside-option"
              to={"/" + user?.NameUser + "/dashboard/stream"}
            >
              <li
                style={{
                  color: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100% !important",
                  padding: tyExpanded ? "0rem 15px" : "0px",
                  justifyContent: !tyExpanded ? "center" : "flex-start",
                  animation: !tyExpanded && "ease-in-out 1s linear",
                }}
                className={
                  location.pathname === `/${user?.NameUser}/dashboard/stream`
                    ? "item-liActive"
                    : "item-li"
                }
              >
                <HiStatusOnline />
                {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                {tyExpanded && <span>{"Stream"}</span>}
              </li>
            </Link>

            
            <Link
              style={{ textDecoration: "none" }}
              className="menu-aside-option"
              to={"/" + user?.NameUser + "/dashboard/analytics"}
            >
              <li
                style={{
                  color: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100% !important",
                  padding: tyExpanded ? "0rem 15px" : "0px",
                  justifyContent: !tyExpanded ? "center" : "flex-start",
                  animation: !tyExpanded && "ease-in-out 1s linear",
                }}
                className={
                  location.pathname === `/${user?.NameUser}/dashboard/analytics`
                    ? "item-liActive"
                    : "item-li"
                }
              >
                <SiSimpleanalytics />
                {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                {tyExpanded && <span>{"Analytics"}</span>}
              </li>
            </Link>

            <Link
              style={{ textDecoration: "none" }}
              className="menu-aside-option"
              to={"/" + user?.NameUser + "/dashboard/ingresos"}
            >
              <li
                style={{
                  color: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100% !important",
                  padding: tyExpanded ? "0rem 15px" : "0px",
                  justifyContent: !tyExpanded ? "center" : "flex-start",
                  animation: !tyExpanded && "ease-in-out 1s linear",
                }}
                className={
                  location.pathname === `/${user?.NameUser}/dashboard/ingresos`
                    ? "item-liActive"
                    : "item-li"
                }
              >
                <RiMoneyDollarCircleFill />
                {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                {tyExpanded && <span>{"Ingresos"}</span>}
              </li>
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              className="menu-aside-option"
              to={"/" + user?.NameUser + "/dashboard/contenido"}
            >
              <li
                style={{
                  color: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100% !important",
                  padding: tyExpanded ? "0rem 15px" : "0px",
                  justifyContent: !tyExpanded ? "center" : "flex-start",
                  animation: !tyExpanded && "ease-in-out 1s linear",
                }}
                className={
                  location.pathname === `/${user?.NameUser}/dashboard/contenido`
                    ? "item-liActive"
                    : "item-li"
                }
              >
                <MdOutlinePermMedia  />
                {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                {tyExpanded && <span>{"Contenido"}</span>}
              </li>
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              className="menu-aside-option"
              to={"/" + user?.NameUser + "/dashboard/comentarios"}
            >
              <li
                style={{
                  color: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100% !important",
                  padding: tyExpanded ? "0rem 15px" : "0px",
                  justifyContent: !tyExpanded ? "center" : "flex-start",
                  animation: !tyExpanded && "ease-in-out 1s linear",
                }}
                className={
                  location.pathname === `/${user?.NameUser}/dashboard/comentarios`
                    ? "item-liActive"
                    : "item-li"
                }
              >
                <LiaCommentSolid   />
                {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                {tyExpanded && <span>{"Comentarios"}</span>}
              </li>
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              className="menu-aside-option"
              to={"/" + user?.NameUser + "/dashboard/ajustes"}
            >
              <li
                style={{
                  color: "white",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100% !important",
                  padding: tyExpanded ? "0rem 15px" : "0px",
                  justifyContent: !tyExpanded ? "center" : "flex-start",
                  animation: !tyExpanded && "ease-in-out 1s linear",
                }}
                className={
                  location.pathname === `/${user?.NameUser}/dashboard/ajustes`
                    ? "item-liActive"
                    : "item-li"
                }
              >
                <IoSettingsSharp    />
                {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                {tyExpanded && <span>{"Ajustes"}</span>}
              </li>
            </Link>

          </ul>
        </Grid>
      </aside>
    </div>
  );
}
