import React, { useEffect, useState } from "react";
import NavbarLeft from "../navbarLeft/NavbarLeft";
import {
  GetLastSixStreamSummaries,
  AWeekOfStreaming,
  getStreamById,
} from "../../services/backGo/streams";
import { Chart } from "react-google-charts";
import { TbBoxMargin, TbLogout2 } from "react-icons/tb";
import { Grid, Typography } from "@mui/material";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { LiaSlidersHSolid } from "react-icons/lia";
import { TfiWallet } from "react-icons/tfi";
import { getUserByIdTheToken } from "../../services/backGo/user";
import { getStream } from "../../services/stream";

function DashboarLayout({ user, isMobile, children }) {
  const [expanded, setExpanded] = useState(true);
  const [streamerData, setStreamerData] = useState(null);
  const [userData, SetUserData] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const fetchDataStream = async () => {
      let id = window.localStorage.getItem("_id");
      let token = window.localStorage.getItem("token");

      let resuser = await getUserByIdTheToken(token);
      if (resuser.message == "ok") {
        SetUserData(resuser.data);
      }
      const dataStreamer = await getStreamById(id);
      if (dataStreamer != null && dataStreamer != undefined) {
        setStreamerData(dataStreamer.data);
      }

      const res = await getStream(token);
      if (res != null && res != undefined) {
        setStream(res);
      }
    };

    fetchDataStream();
  }, []);
  const [elapsedTime, setElapsedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const formatNumber = (number) => (number < 10 ? `0${number}` : number);

  useEffect(() => {
    const calculateElapsedTime = () => {
      const startDateTime = new Date(streamerData?.start_date);
      const now = new Date();

      const timeDifference = now - startDateTime;
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));

      setElapsedTime({ hours, minutes, seconds });
    };

    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [streamerData?.start_date]);

  const [subMenu, setSubMenu] = useState(false);

  const [esClick, setEsClick] = useState(false);
  const habilitarSubMenu = (valor, e) => {
    if (e?.type === "click") {
      setEsClick(true);
    } else {
      setEsClick(false);
    }

    setTimeout(() => {
      setSubMenu(valor);
    }, [100]);
  };

  useEffect(() => {
    // Función para manejar el clic en cualquier parte de la página
    const handleClickOutside = () => {
      setSubMenu(false); // Cambiar el estado a false cuando se hace clic fuera del área deseada
    };

    // Agregar un event listener para escuchar clics en el documento
    document.addEventListener("click", handleClickOutside);

    // Limpiar el event listener en la fase de limpieza de useEffect
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("_id");
    window.localStorage.removeItem("avatar");
    window.location.href = "/";
  };
  return (
    <Grid style={{ display: "flex", flexDirection: "row" }}>
      <NavbarLeft
        isMobile={isMobile}
        tyExpanded={expanded}
        user={user}
        tyDashboard={true}
        setExpanded={setExpanded}
      />

      <Grid
        style={{
          display: "flex",
          flexDirection: "row",

          padding: "0rem 0rem 0rem 0rem",
          width: expanded ? "95%" : "95%",
        }}
      >
        <div className="first-section">
          <div
            className="navigation"
            style={{ padding: "1rem 4rem !important", width: "90%" }}
          >
            <div className="navigation-container-stream-deshboard">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "1rem 5.8rem",
                }}
              >
                <a href="/" style={{ width: "20%" }}>
                  <img
                    style={{ width: "90%" }}
                    src="https://res.cloudinary.com/dcj8krp42/image/upload/v1726509395/Emblemas/Pinkker_dmzobi.png"
                    alt="Avatar"
                  />
                </a>

                <Grid>
                  <div className="session-info">
                    {!streamerData?.online && (
                      <div className="stats-container">
                        <span className="w-fit grow-0 rounded-[2px] px-[0.375rem] py-1 text-center text-[0.625rem] font-bold uppercase bg-[#F4F5F6] text-[#070809]">
                          Sin conexión
                        </span>
                        <span className="label">Sesión</span>
                      </div>
                    )}
                    <div className="stats-container">
                      <span className="data">
                        - {streamerData?.online && streamerData?.ViewerCount}
                      </span>
                      <span className="label"> espectadores</span>
                    </div>
                    <div className="stats-container">
                      <span className="data">
                        - {userData && userData.FollowersCount}{" "}
                      </span>
                      <span className="label"> seguidores</span>
                    </div>
                    <div className="stats-container">
                      <span className="data">
                        {streamerData?.online ? (
                          <p className="elapsedTime">
                            <p>{`${formatNumber(elapsedTime.hours)}`}</p>
                            <p>{`: ${formatNumber(elapsedTime.minutes)}`}</p>
                            <p>{`: ${formatNumber(elapsedTime.seconds)}`}</p>
                          </p>
                        ) : (
                          "-"
                        )}
                      </span>
                      <span className="label">Tiempo en vivo</span>
                    </div>
                  </div>
                </Grid>
              </div>

              <Grid>
                <Grid
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div className="navbar-image-avatar-container">
                    <div
                      style={{
                        width: "40px",
                        background: "#2a2e38",
                        position: "relative",
                        left: "  ",
                        top: "2px",
                      }}
                      className="navbar-image-avatar"
                    >
                      {/* <img src={"/images/iconos/notificacion.png"} alt="" style={{ width: '60%' }} /> */}
                      <IoMdNotificationsOutline
                        style={{ fontSize: "20px", color: "white" }}
                      />
                    </div>
                  </div>
                  <div className="navbar-image-avatar-container">
                    <div
                      style={{
                        width: "40px",
                        background: "#2a2e38",
                        position: "relative",
                        left: "  ",
                        top: "2px",
                      }}
                      className="navbar-image-avatar"
                    >
                      {/* <img src={"/images/iconos/mensaje.png"} alt="" style={{ width: '60%' }} /> */}
                      <BsChatDots
                        style={{ fontSize: "20px", color: "white" }}
                      />
                    </div>
                  </div>
                  <div className="navbar-image-avatar-container">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#f36196",
                        position: "relative",
                        left: "  ",
                        top: "2px",
                      }}
                      className="navbar-image-avatar"
                      onClick={(e) => habilitarSubMenu(true, e)}
                      onMouseEnter={
                        esClick
                          ? console.log("activo")
                          : () => habilitarSubMenu(true)
                      }
                      onMouseLeave={
                        esClick
                          ? console.log("activo")
                          : () => habilitarSubMenu(false)
                      }
                    >
                      <img src={user?.Avatar ?? "/images/pixel.png"} alt="" />
                    </div>
                  </div>
                </Grid>

                {subMenu && (
                  <Grid
                    onMouseEnter={
                      esClick
                        ? console.log("activo")
                        : () => habilitarSubMenu(true)
                    }
                    onMouseLeave={
                      esClick
                        ? console.log("activo")
                        : () => habilitarSubMenu(false)
                    }
                    style={{
                      backgroundColor: "#121418",
                      border: "1px solid #343843",
                      position: "absolute",
                      padding: "1rem",
                      width: "16.25rem",
                      right: "105px",
                      borderRadius: "0.5rem",
                      zIndex: 99999,
                    }}
                  >
                    <Grid
                      style={{
                        backgroundColor: "#202329",
                        borderRadius: "5px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "1rem",
                      }}
                    >
                      <Grid
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          padding: 10,
                        }}
                      >
                        <img
                          src={user?.Avatar ?? "/images/pixel.png"}
                          alt=""
                          style={{
                            width: "20%",
                            height: "20%",
                            borderRadius: "50%",
                          }}
                        />
                        <Grid
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1px",
                          }}
                        >
                          <Link
                            style={{
                              textDecoration: "none",
                              margin: 0,
                              padding: 0,
                            }}
                            to={"/" + user.NameUser}
                          >
                            <Typography
                              style={{
                                color: "white",
                                fontSize: "1rem",
                                fontFamily: "Inter",
                                fontWeight: 600,
                              }}
                            >
                              {user?.NameUser ?? "Usuario"}
                            </Typography>
                          </Link>
                          <Typography
                            style={{
                              color: "white",
                              fontSize: "12px",
                              fontFamily: "Inter",
                            }}
                          >
                            0 seguidores
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "15px",
                        marginTop: "15px",
                      }}
                    >
                      <Link
                        className="dropdownaccount-link"
                        to={"/" + user.NameUser}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <AiOutlineUser style={{ marginRight: "10px" }} />
                        Tu canal
                      </Link>

                      <Link
                        className="dropdownaccount-link"
                        to={"/" + user.NameUser + "/dashboard/stream"}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <LiaSlidersHSolid
                          style={{ marginRight: "10px", fontSize: "24px" }}
                        />
                        Panel de control del creador
                      </Link>

                      <Link
                        className="dropdownaccount-link"
                        to="/plataform/cartera"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TfiWallet style={{ marginRight: "10px" }} />
                        Cartera
                      </Link>

                      <Link
                        className="dropdownaccount-link"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        to={"/" + user.NameUser + "/settings"}
                      >
                        <AiOutlineSetting style={{ marginRight: "10px" }} />
                        Configuración
                      </Link>
                      <div
                        className="dropdownaccount-link"
                        onClick={() => handleLogout()}
                      >
                        <TbLogout2 style={{ marginRight: "10px" }} />
                        Cerrar sesión
                      </div>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </div>
          </div>

          {/* Contenido */}
          <div
            className="content"
            style={{
              padding: "2.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {children}
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default DashboarLayout;
