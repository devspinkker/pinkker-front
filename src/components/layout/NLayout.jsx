import { Box, Card, CardContent, CardMedia, Dialog, DialogContent, Grid, Tab, Tabs, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import NavbarLeft from "../navbarLeft/NavbarLeft";
import Search from "../navbar/search/Search";
import "./NLayout.css";
import DropdownBalance from "../navbar/balance/DropdownBalance";
import DropdownPurchase from "../navbar/purchase/DropdownPurchase";
import CanalesRecomendados from "./CanalesRecomendados";
import Auth from "../auth/Auth";
import { Link, useLocation } from "react-router-dom";
import { GetAllsStreamsOnline } from "../../services/backGo/streams";
import { GrHomeRounded } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { AiOutlineMenu, AiOutlinePlayCircle } from "react-icons/ai";
import { BsChatDots, BsChatSquareText, BsWallet } from "react-icons/bs";
import { CgTennis } from "react-icons/cg";
import { ImDice } from "react-icons/im";
import { AiOutlineSetting } from "react-icons/ai";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TfiWallet } from "react-icons/tfi";
import { AiOutlineUser } from "react-icons/ai";
import { LiaSlidersHSolid } from "react-icons/lia";
import { TbLogout2 } from "react-icons/tb";
import { FaBullseye } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa6";
import Messages from "../dashboard/stream-manager/chat/Messages";
import Message from "../message/Message";
import { getChatsByUserID } from "../../services/backGo/Chats";
import logoPinkker from "./LOGOPINKKER.png";
import SearchPopup from "../navbar/search/SearchPopup";
import { fetchSearch } from "../../redux/actions/searchAction";

import zIndex from "@mui/material/styles/zIndex";

function NLayout(props) {
  const [locationpath, setLocationPath] = useState();
  const [dashboard, setDashboard] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [abrir, setAbrir] = useState(true);
  const [aparecer, setAparcer] = useState(false);
  const [showPopupAuth, setShowPopupAuth] = useState(false);
  const [type, setType] = useState(0);
  const [openNotification, setOpenNotification] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);

  const [messagesOpen, setMessagesOpen] = useState([]);
  const [notificacion, setNotificacion] = useState(false);
  useEffect(() => {
    fetchData(); // Llamada inicial para obtener los datos
    const intervalId = setInterval(fetchData, 6000);

    return () => clearInterval(intervalId);
  }, [messagesOpen]);
  const deepEqual = (a, b) => {
    if (a === b) return true;
    if (
      typeof a !== "object" ||
      typeof b !== "object" ||
      a == null ||
      b == null
    )
      return false;

    let keysA = Object.keys(a);
    let keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  };
  const fetchData = async () => {
    let token = window.localStorage.getItem("token");
    let userID = window.localStorage.getItem("_id");
    if (token && userID) {
      try {
        const response = await getChatsByUserID(token);
        if (response) {
          const updatedMessagesOpen = response.map((chat) => ({
            chatID: chat.ID,
            openedWindow: false,
            user1: chat.User1ID,
            user2: chat.User2ID,
            usersInfo: chat.Users,
            NotifyA: chat.NotifyA,
            messages: [],
          }));
          if (!deepEqual(messagesOpen, updatedMessagesOpen)) {
            setMessagesOpen(updatedMessagesOpen);
            const hasNotification = updatedMessagesOpen.some(
              (chat) => chat.NotifyA === userID
            );
            setNotificacion(hasNotification);
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
  };

  function clickPulsedButton() {
    setPulse(!pulse);
    props.setExpanded(!props.tyExpanded);
    if (props.expanded) {
      setOpenMessage(false);
      setOpenNotification(false);
    }
    setTimeout(() => {
      if (pulse) {
        setAparcer(true);
      } else {
        setAparcer(false);
      }
    }, 500);
  }

  function cerrarCanalesRecomendados() {
    setAbrir(!abrir);
  }

  function togglePopupAuth(type) {
    setShowPopupAuth(!showPopupAuth);
    setType(type);
  }
  const handleToggleExpandFollowStreams = () => {
    setTyExpandedFollowStreams(!tyExpandedFollowStreams);
  };
  const [tyExpandedFollowStreams, setTyExpandedFollowStreams] = useState(false);

  let expandido = pulse;
  const [streams, setStreams] = useState(null);
  let location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllsStreamsOnline();
      if (response != null && response != undefined) {
        setStreams(response.data);
      }
    };
    fetchData();

    if (window.location.pathname.includes("/dashboard")) {
      setDashboard(true);
    }
  }, [props.tyExpanded, window.location.pathname]);

  const [subMenu, setSubMenu] = useState(false);

  const [esClick, setEsClick] = useState(false);

  const habilitarAside = (e, openMessage, openNotification) => {
    if (openNotification) {
      setOpenMessage(false);
    } else if (openMessage) {
      setOpenNotification(false);
    }
  };

  const habilitarMensaje = () => {
    if (openMessage) {
      setOpenMessage(false);
    } else {
      setOpenMessage(true);
    }
    setOpenNotification(false);
    props.setExpanded(false);
  };

  const habilitarNotificaciones = () => {
    if (openNotification) {
      setOpenNotification(false);
    } else {
      setOpenNotification(true);
    }
    setOpenMessage(false);
    props.setExpanded(false);
  };
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

  const [expandCartera, setExpandCartera] = useState(false);

  const handleExpandCartera = () => {
    setExpandCartera(!expandCartera);
  };

  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [urlCat, setUrlCat] = useState();
  const divRef = useRef();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Agrega un event listener para detectar cambios en la ubicación
    window.addEventListener("popstate", handleLocationChange);
    setUrlCat(currentPath?.includes("/categorie/"));

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [habilitar, setHabilitar] = useState(false);
  const handleClose = () => setHabilitar(!habilitar);
  const [text, setText] = useState(null);

  const games = [
    {
      title: "Rich Wilde and the Tome of Insanity",
      image: "/path/to/image1.jpg",
    },
    { title: "Sweet Bonanza 1000", image: "/path/to/image2.jpg" },
    // ... more game data
  ];

console.log('===', search);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= 0) {
      setSearch(null);
      setText(null);
    } else {
      setText(value);

      const getUser = () => {
        return fetchSearch(value).then((res) => {
          setSearch(res.data);
        });
      };
      getUser();
    }
  };
  const getNavDesktop = () => {
    return (
      <Grid
        style={{
          display: dashboard ? "none" : "flex",
          flexDirection: "row",
          width: "105% !important",
          justifyContent:
            !props.tyExpanded &&
            (openNotification || openMessage) &&
            "space-between",
        }}
      >
        {/* GRID ASIDE */}
        <Grid
          style={{
            width: props.tyExpanded ? "13%" : "4%",
            transition: "width .2s ease-in-out",
            border: "1px solid #2a2e38",
            height: "100vh",
            backgroundColor: "#121418",
            position: "sticky",
            top: 0,
          }}
        >
          <Grid
            style={{
              padding: props.tyExpanded ? ".98rem 20px" : "1.72rem 5px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* <i
            onClick={() => clickPulsedButton()}
            style={{
              cursor: "pointer",
              fontSize: props.tyExpanded ? "30px" : "30px",
              zIndex: "1000",

              // transform: expanded === false && "rotate(90deg)",

              color: "#ededed",
            }}
            className="fas fa-bars"
          /> */}
            {/* <img  src="/images/menu.svg" className="img-bars" /> */}

            <AiOutlineMenu
              style={{
                color: "white",
                fontSize: "26px",
                width: !props.tyExpanded && "100%",
              }}
              onClick={() => clickPulsedButton()}
              className="img-bars"
            />

            {props.tyExpanded && (
              <Grid
                style={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  borderRadius: ".375rem",
                  backgroundColor: "#2a2e38",
                  border: "1px solid #343843",
                }}
                className="contenedor-directos-cat"
              >
                <Link
                  style={{ textDecoration: "none", padding: 0 }}
                  to="/plataform/explore?tipo=streams"
                >
                  <Grid
                    className="button-casino"
                    style={{
                      height: "3rem",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "70px",
                      background:
                        ' url("/images/BOTON-DIRECTO-blanco-y-negro.jpg") ',
                      backgroundSize: "cover",
                      padding: ".5rem",
                      borderRadius: ".375rem",
                      animation: !props.tyExpanded && "ease-in-out 1.5s linear",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        textShadow: "0 1px 0 #000",
                      }}
                    >
                      Directos{" "}
                    </span>
                  </Grid>
                </Link>

                <Link
                  style={{ textDecoration: "none", padding: 0 }}
                  to="/plataform/explore?tipo=categories"
                >
                  <Grid
                    style={{
                      height: "3rem",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: ".5rem",
                      borderRadius: ".375rem",
                      width: "70px",
                      justifyContent: "center",
                      animation: !props.tyExpanded && "ease-in-out 1.5s linear",
                    }}
                    className="button-sports"
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        textShadow: "0 1px 0 #000",
                      }}
                    >
                      Categorias
                    </span>
                  </Grid>
                </Link>
              </Grid>
            )}
          </Grid>

          <Grid
            style={{
              padding: "1.3rem 20px",
              border: "1px solid #2a2e38",
              borderRight: "none",
              borderLeft: "none",
              width: "100%",
              display: "flex",
              flexDirection: props.tyExpanded ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-around",
              gap: "15px",
            }}
          >
            {!props.tyExpanded && (
              <Grid style={{ display: "flex", flexDirection: "column" }}>
                <Grid
                  style={{
                    height: "100%",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ff69c4",
                    borderTopLeftRadius: ".375rem",
                    borderTopRightRadius: ".375rem",
                    padding: ".4rem",
                  }}
                  className="button-casino"
                >
                  {/* <img src="/images/dice.svg" /> */}
                  <Link
                    style={{
                      textDecoration: "none",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    to="/"
                  >
                    <AiOutlinePlayCircle
                      style={{ fontSize: "20px", fontWeight: 600 }}
                    />
                  </Link>
                </Grid>

                <Grid
                  style={{
                    height: "100%",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#343843",
                    borderBottomLeftRadius: ".375rem",
                    borderBottomRightRadius: ".375rem",
                    padding: ".4rem",
                  }}
                  className="button-sports"
                >
                  {/* <img src="/images/tennis.svg" /> */}
                  <Link
                    style={{
                      textDecoration: "none",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    to="/plataform/explore?tipo=categories"
                  >
                    <FaLayerGroup style={{ fontSize: "20px" }} />
                  </Link>
                </Grid>
              </Grid>
            )}

            <div
              ref={divRef}
              style={{
                padding: props.tyExpanded && "0 0 0 1rem",
                height: props.tyExpanded && "3rem",
                lineHeight: props.tyExpanded && 2,
                display: "flex",
                width: props.tyExpanded && "88% !important",
                cursor: "pointer",
              }}
              onClick={() => props.setExpanded(true)}
              className={"navbar-search-dark"}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: props.isMobile ? "50px" : "",
                }}
              >
                <img
                  src="/images/search.svg"
                  style={{
                    fontSize: props.tyExpanded ? "18px" : "16px",
                    color: "rgb(89 89 89)",
                    margin: props.tyExpanded ? "5px" : "8px",
                  }}
                />

                {props.tyExpanded && (
                  <input
                    style={{ fontSize: "16px" }}
                    onClickCapture={() => setHabilitar(!habilitar)}

                    placeholder="Search"
                    type="search"
                    className="input-searchbar"
                  />
                )}
              </div>
            </div>
          </Grid>

          <Grid>
            <Grid
              className="pixel-li"
              style={{
                transition: "all 1s ease",
                animation: !props.tyExpanded && "ease-in-out 1s linear",
              }}
            >
              <div
                className={
                  props.tyExpanded
                    ? "pixel-coming-soon-navbarLeft"
                    : "pixel-coming-soon-navbarLeft-noexpand"
                }
              >
                <div className="pixel-coming-soon-navbarLeft-img-pixel-container">
                  <img
                    className="pixel-coming-soon-navbarLeft-img-pixel"
                    style={{
                      width: "36px",
                      padding: "5px",
                    }}
                    src="/images/pixel.png"
                  />
                </div>
                {props.tyExpanded && (
                  <div className="pixel-coming-soon-text-container">
                    <div className="pixel-coming-soon-text">
                      <span className="pixel-coming-soon-text-pixel">
                        Pinkker Prime
                      </span>
                      {/* <span className="pixel-coming-soon-text-pxl">(PXL)</span> */}
                    </div>
                    <span className="pixel-coming-soon-navbarLeft-Comming-soon">
                      Proximamente
                    </span>
                  </div>
                )}
              </div>
            </Grid>

            <Grid
              style={{
                margin: ".625rem 0",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
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
                  to="/"
                >
                  <li
                    style={{
                      color: "white",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      width: "100% !important",
                      padding: props.tyExpanded ? "0rem 15px" : "0px",
                      justifyContent: !props.tyExpanded && "center",
                      animation: !props.tyExpanded && "ease-in-out 1s linear",
                    }}
                    className={
                      location.pathname === "/" ? "item-liActive" : "item-li"
                    }
                  >
                    <GrHomeRounded />
                    {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                    {props.tyExpanded && <span>Inicio</span>}
                  </li>
                </Link>
                <Link
                  style={{ textDecoration: "none" }}
                  className="menu-aside-option"
                  to="/plataform/clips"
                >
                  <li
                    style={{
                      color: "white",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: props.tyExpanded ? "0rem 15px" : "0px",
                      justifyContent: !props.tyExpanded && "center",
                      animation: !props.tyExpanded && "ease-in-out 1s linear",
                    }}
                    className={
                      location.pathname === "/plataform/clips"
                        ? "item-liActive"
                        : "item-li"
                    }
                  >
                    {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-search"
                  /> */}
                    <FiSearch />
                    {props.tyExpanded && <span>Explorar</span>}
                  </li>
                </Link>

                {/* <Link
                style={{ textDecoration: "none" }}
                className="menu-aside-option"
                to="/plataform/clips"
              >
                <li
                  style={{
                    color: "white",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    padding: props.tyExpanded ? "0rem 15px" : "0px",
                    justifyContent: !props.tyExpanded && "center",
                    animation: !props.tyExpanded && "ease-in-out 1s linear",
                  }}
                  className="item-li"
                >
                  <AiOutlinePlayCircle />
                  {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fas fa-film"
                  /> */}
                {/*} {props.tyExpanded && <span>Clips</span>}
                </li>
              </Link> */}

                <Link
                  style={{ textDecoration: "none" }}
                  className="menu-aside-option"
                  to="/plataform/muro"
                >
                  <li
                    style={{
                      color: "white",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: props.tyExpanded ? "0rem 15px" : "0px",
                      justifyContent: !props.tyExpanded && "center",
                      animation: !props.tyExpanded && "ease-in-out 3s linear",
                    }}
                    className={
                      location.pathname === "/plataform/muro"
                        ? "item-liActive"
                        : "item-li"
                    }
                  >
                    <BsChatSquareText />
                    {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fas fa-edit"
                  /> */}
                    {props.tyExpanded && <span>Muro</span>}
                  </li>
                </Link>
              </ul>
            </Grid>
            <Grid
              style={{
                backgroundColor: "#080808",
                padding: streams?.length ? "0.5rem 15px" : 0,
                borderTop: "1px solid #2a2e38",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {props.tyExpanded && streams?.length ? (
                <>
                  <Grid
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      padding: "5px",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontFamily: "Inter",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      CANALES RECOMENDADOS
                    </span>
                    <i
                      style={{
                        color: "white",
                        marginLeft: "5px",
                        backgroundColor: "#080808",
                        cursor: "pointer",
                        transform: abrir ? "rotate(0deg)" : "rotate(-180deg)",
                        transition: "all 0.5s ",
                      }}
                      class={
                        props.abrir
                          ? "fas fa-chevron-down"
                          : "fas fa-chevron-up"
                      }
                      onClick={() => cerrarCanalesRecomendados()}
                    />
                  </Grid>

                  <Grid
                    style={{
                      display: abrir ? "flex" : "none",
                      flexDirection: "column",
                      gap: "15px",
                      maxHeight: abrir ? "100% !important" : "0px !important",
                      transition: "all 0.5s ease-out",
                    }}
                  >
                    {[...Array(streams?.length)].map((_, index) => (
                      <CanalesRecomendados
                        abrir={true}
                        streamer={streams[index]?.streamer ?? "Cargando.."}
                        categorie={
                          streams[index]?.stream_category ?? "Cargando.."
                        }
                        avatarStreamer={
                          streams[index]?.streamer_avatar ?? "Cargando.."
                        }
                        spectators={streams[index]?.ViewerCount ?? ""}
                        title={streams[index]?.stream_title ?? "Cargando.."}
                      />
                    ))}
                  </Grid>
                </>
              ) : (
                streams?.length && (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      style={{ margin: "0 auto" }}
                      className="icono-recomendados"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.002 3.999a2 2 0 0 1 2 2v2L18 6v8l-3.998-2v2a2 2 0 0 1-2 1.999h-8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8zM12 6H4v8h8V6z"
                        clip-rule="evenodd"
                        fill="#fff"
                      ></path>
                    </svg>
                    {[...Array(streams?.length)].map((_, index) => (
                      <CanalesRecomendados
                        abrir={false}
                        streamer={streams[index]?.streamer ?? "Cargando.."}
                        categorie={
                          streams[index]?.stream_category ?? "Cargando.."
                        }
                        avatarStreamer={
                          streams[index]?.streamer_avatar ?? "Cargando.."
                        }
                        spectators={streams[index]?.ViewerCount ?? ""}
                        title={streams[index]?.stream_title ?? "Cargando.."}
                      />
                    ))}
                  </>
                )
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* GRID NAV - MAIN */}

        <Grid
          style={{
            width: props.tyExpanded
              ? "85%"
              : openNotification || openMessage
              ? "80%"
              : "95%",
            display: "flex",
            flexDirection: "column",
            zIndex: 99999,
          }}
        >
          {!props.user.NameUser ? (
            <Grid
              style={{
                borderBottom: "1px solid #2a2e38",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 5.8rem",
                position: "sticky",
                top: 0,
                zIndex: 9999,
                backgroundColor: "#080808",
                width: "102%",
              }}
            >
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                  style={{ width: "12.5%" }}
                  alt=""
                />
              </Link>
              <Grid
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <h6
                  onClick={() => togglePopupAuth(0)}
                  className="button-navbar-login"
                >
                  Ingresar
                </h6>
                <h6
                  onClick={() => togglePopupAuth(1)}
                  className="button-navbar-register"
                >
                  Registrarse
                </h6>
              </Grid>
            </Grid>
          ) : (
            <Grid
              style={{
                borderBottom: "1px solid #2a2e38",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 5.8rem",
                position: "sticky",
                top: 0,
                zIndex: 9999,
                backgroundColor: "#080808",
                width: "103.5%",
              }}
            >
              <Link to="/" style={{ width: "200px" }}>
                <img
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                  style={{ width: "67%" }}
                  alt=""
                />
              </Link>

              <Grid style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      // width: "500px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                    className="button-purchase-pixels"
                    onClick={() => handleExpandCartera()}
                  >
                    <button
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        style={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        <img
                          style={{
                            width: props.isMobile ? "25px" : "17px",
                          }}
                          src="/images/usdt.svg"
                          alt=""
                        />{" "}
                        <span style={{ fontSize: "14px" }}>
                          {props.user?.Pixeles != 0
                            ? props.user?.Pixeles
                            : "0.0000000"}
                        </span>
                      </Grid>

                      {expandCartera ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                  </div>
                  {expandCartera && <DropdownPurchase />}

                  <Link to="/plataform/cartera">
                    <button
                      style={{
                        borderRadius: "5px",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        backgroundColor: "transparent",
                        border: "1px solid #f36196",
                      }}
                      className="boton-comprar"
                    >
                      <BsWallet />
                      <Typography style={{ fontSize: "14px" }}>
                        Comprar{" "}
                      </Typography>
                    </button>
                  </Link>
                </div>
              </Grid>

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
                        name="notificaciones"
                        onClick={() => habilitarNotificaciones()}
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
                      {/* <img
                        src={"/images/iconos/mensaje.png"}
                        alt=""
                        style={{ width: "60%" }}
                      /> */}
                      {notificacion && (
                        <span className="messagechat-InfoUserTo-notiNav"></span>
                      )}
                      <BsChatDots
                        style={{ fontSize: "20px", color: "white" }}
                        onClick={() => habilitarMensaje()}
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
                      <img
                        src={props.user?.Avatar ?? "/images/pixel.png"}
                        alt=""
                      />
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
                          src={props.user?.Avatar ?? "/images/pixel.png"}
                          alt=""
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
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
                            to={"/" + props.user.NameUser}
                          >
                            <Typography
                              style={{
                                color: "white",
                                fontSize: "1rem",
                                fontFamily: "Inter",
                                fontWeight: 600,
                              }}
                            >
                              {props.user?.NameUser ?? "Usuario"}
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
                        to={"/" + props.user.NameUser}
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
                        to={"/" + props.user.NameUser + "/dashboard/stream"}
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
                        to={"/" + props.user.NameUser + "/settings"}
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
            </Grid>
          )}

          <Grid style={{ width: "102%" , padding: props.isMobile && '0px 0px 25% 0px' }} onClick={() => setEsClick(false)}>
            {props.children}
            {habilitar && (
              <div className="auth-body-container">
                <div className={"auth-body"}>
                  <div
                    style={{
                      padding: "30px",
                      height: "85% ",
                      textAlign: "center",
                      backgroundColor: "#121418",
                      borderRadius: "5px",
                      zIndex: 9999,
                      display: "flex",
                      boxShadow: "5px 5px 20px 5px rgba(0, 0, 0, 0.651)",
                      width: "70%",
                    }}
                  >
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Search"
                        type="search"
                        fullWidth
                        variant="outlined"
                        value={text}
                        onChange={handleChange}
                        InputProps={{
                          style: {
                            color: "white",
                            borderColor: "white",
                          },
                          classes: {
                            notchedOutline: {
                              borderColor: "white",
                            },
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "white" },
                        }}
                        inputProps={{
                          style: {
                            color: "white",
                            borderColor: "white",
                          },
                          placeholder: "Search",
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white",
                            },
                          "& .MuiInputBase-input": {
                            color: "white",
                          },
                          "& .MuiInputLabel-outlined": {
                            color: "white",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "white",
                            opacity: 1,
                          },
                        }}
                      />

                      <Box mt={2}>
                        <Grid container spacing={2}>
                          {search?.data?.map((game, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index} >
                                <Card style={{ zIndex: 99999}}>
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={game?.Avatar}
                                    alt={game?.NameUser}
                                  />
                                  <CardContent>
                                    <Typography variant="h6" style={{ color: 'black' }}>{game?.NameUser?.toUpperCase()}</Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                        </Grid>
                      </Box>
                    </DialogContent>

                    <div className="auth-close">
                      <button
                        className="pinkker-button-more"
                        onClick={() => setHabilitar(false)}
                      >
                        <i
                          style={{ fontSize: props.isMobile && "20px" }}
                          class="fas fa-times"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showPopupAuth === true && (
              <Auth
                isMobile={props.isMobile}
                typeDefault={type}
                closePopup={() => togglePopupAuth()}
              />
            )}
          </Grid>
          {/* FOOTER */}
          {/* 
          <Grid
            style={{
              width: "103%",
              display: "flex",
              flexDirection: "column",
              padding: "1.3rem 5rem",
              zIndex: 99999,
              backgroundColor: "rgb(18, 20, 24)",
              gap: "2rem",
              position: "relative",
              bottom: 0,
            }}
          >
            <Grid
              style={{ display: "flex", alignItems: "center", width: "98%" }}
            >
              <Grid style={{ width: "20%" }}>
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                    style={{ width: "70%" }}
                    alt=""
                  />
                </Link>
              </Grid>

              <Grid
                style={{
                  display: "flex",
                  alignItems: "flexStart",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "20%",
                  color: "white",
                }}
              >
                <Typography
                  style={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    textShadow: "0 1px 0 #000",
                  }}
                >
                  Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Live Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Help Center
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Game Responsibly
                </Typography>
              </Grid>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "flexStart",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "20%",
                  color: "white",
                }}
              >
                <Typography
                  style={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    textShadow: "0 1px 0 #000",
                  }}
                >
                  Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Live Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Help Center
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Game Responsibly
                </Typography>
              </Grid>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "flexStart",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "20%",
                  color: "white",
                }}
              >
                <Typography
                  style={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    textShadow: "0 1px 0 #000",
                  }}
                >
                  Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Live Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Help Center
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Game Responsibly
                </Typography>
              </Grid>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "flexStart",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "20%",
                  color: "white",
                }}
              >
                <Typography
                  style={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    textShadow: "0 1px 0 #000",
                  }}
                >
                  Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Live Support
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Help Center
                </Typography>
                <Typography style={{ color: "#828998", fontFamily: "Inter" }}>
                  Game Responsibly
                </Typography>
              </Grid>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "flexStart",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "10%",
                  color: "white",
                }}
              >
                <select
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#2a2e38",
                    borderRadius: "5px",
                    color: "white",
                    padding: "10px",
                  }}
                  name="cars"
                  id="cars"
                >
                  <option value="Publico"> Español</option>
                  <option value="Privado"> Inglés</option>
                </select>
              </Grid>
            </Grid>

            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "98%",
                borderTop: "1px solid gray",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <p
                style={{
                  color: "#828998",
                  fontSize: "14px",
                  fontFamily: "Inter",
                }}
              >
                1 ETH = $3,561.37
              </p>

              <p
                style={{
                  color: "#828998",
                  fontSize: "14px",
                  fontFamily: "Inter",
                }}
              >
                © 2024 Pinkker.tv | All Rights Reserved
              </p>
            </Grid>
          </Grid> */}
        </Grid>

        {(openNotification || openMessage) && !props.tyExpanded && (
          <Grid
            style={{
              width: "15%",
              transition: "width .2s ease-in-out",
              border: "1px solid #2a2e38",
              height: "100vh",
              backgroundColor: "#121418",
              position: "sticky",
              zIndex: 999999,
              top: 0,
            }}
          >
            <Grid
              style={{
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                border: "1px solid #343843",
                padding: "1.70rem",
              }}
            >
              <Typography
                style={{
                  color: "white",
                  fontWeight: 600,
                  textAlign: "center",
                  fontSize: "18px",
                  width: "100%",
                }}
              >
                {openMessage ? "Mensajes" : "Notificaciones"}
              </Typography>
            </Grid>
            {openMessage && <Message messagesOpen1={messagesOpen} />}
          </Grid>
        )}
      </Grid>
    );
  };

  const getNavMobile = () => {
    return (
      <Grid>
        {!props.user.NameUser ? (
          <Grid
            style={{
              borderBottom: "1px solid #2a2e38",
              display: dashboard ? "none" : "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1rem",
              position: "sticky",
              top: 0,
              zIndex: 9999,
              backgroundColor: "#080808",
              margin: "0 auto",
              width: "100%",
              height: "100px",
            }}
          >
            <Link
              to="/"
              style={{
                width: "40%",
                padding: "0 !important",
                margin: "0 !important",
              }}
            >
              <img
                src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                style={{ width: "100%" }}
                alt=""
              />
            </Link>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                width: "40%",
              }}
            >
              <h6
                onClick={() => togglePopupAuth(0)}
                className="button-navbar-login"
              >
                Ingresar
              </h6>
              <h6
                onClick={() => togglePopupAuth(1)}
                className="button-navbar-register"
              >
                Registrarse
              </h6>
            </Grid>
          </Grid>
        ) : (
          <Grid
            style={{
              borderBottom: "1px solid #2a2e38",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 2rem",
              position: "sticky",
              top: 0,
              zIndex: 9999,
              backgroundColor: "#080808",
              width: "100%",
            }}
          >
            <Link to="/" style={{ width: "15%" }}>
              <img src={logoPinkker} style={{ width: "100%" }} alt="" />
            </Link>

            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                width: "60%",
                justifyContent: "center",
                height: "5rem !important",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  height: "3rem !important",
                }}
              >
                <div
                  style={{
                    // width: "500px",
                    display: "flex",
                    justifyContent: "flex-end",
                    height: "3rem !important",
                  }}
                  className="button-purchase-pixels"
                  onClick={() => handleExpandCartera()}
                >
                  <button
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
                      <img
                        style={{
                          width: props.isMobile ? "25px" : "17px",
                        }}
                        src="/images/usdt.svg"
                        alt=""
                      />{" "}
                      <span style={{ fontSize: "14px" }}>
                        {props.user?.Pixeles != 0
                          ? props.user?.Pixeles
                          : "0.0000000"}
                      </span>
                    </Grid>

                    {expandCartera ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                </div>
                {expandCartera && <DropdownPurchase />}

                <Link to="/plataform/cartera">
                  <button
                    style={{
                      borderRadius: "5px",
                      fontFamily: "inter",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: "#f36196 !important",
                      padding: "20px 10px !important",
                      backgroundColor: "#f36196 !important",
                      padding: "20px 10px !important",
                      height: "60px !important",
                    }}
                    className="boton-comprar"
                  >
                    <BsWallet style={{ fontSize: "20px", fontWeight: 600 }} />
                  </button>
                </Link>
              </div>
            </Grid>

            <Grid>
              <Grid
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
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
                    <img
                      src={props.user?.Avatar ?? "/images/pixel.png"}
                      alt=""
                    />
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
                    right: props.isMobile ? "5px" : "105px",
                    top: props.isMobile && "100%",
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
                        src={props.user?.Avatar ?? "/images/pixel.png"}
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
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
                          to={"/" + props.user.NameUser}
                        >
                          <Typography
                            style={{
                              color: "white",
                              fontSize: "1rem",
                              fontFamily: "Inter",
                              fontWeight: 600,
                            }}
                          >
                            {props.user?.NameUser ?? "Usuario"}
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
                      to={"/" + props.user.NameUser}
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
                      to={"/" + props.user.NameUser + "/dashboard/stream"}
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
                      to={"/" + props.user.NameUser + "/settings"}
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
          </Grid>
        )}

        <Grid
          style={{ width: "100%", height: "100vh" }}
          onClick={() => setEsClick(false)}
        >
          {props.children}

          {showPopupAuth === true && (
            <Auth
              isMobile={props.isMobile}
              typeDefault={type}
              closePopup={() => togglePopupAuth()}
            />
          )}
        </Grid>

        <div className="mobile-menu">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <GrHomeRounded className="icon" />
            <span>Inicio</span>
          </Link>
          <Link
            to="/plataform/clips"
            className={location.pathname === "/plataform/clips" ? "active" : ""}
          >
            <FiSearch className="icon" />

            <span>Explorar</span>
          </Link>
          <Link
            to="/plataform/explore?tipo=streams"
            className={
              location.pathname === "/plataform/explore?tipo=streams"
                ? "active"
                : ""
            }
          >
            <AiOutlinePlayCircle className="icon" />
            <span>Directos</span>
          </Link>
          <Link
            to="/plataform/explore?tipo=categories"
            className={
              location.pathname === "/plataform/explore?tipo=categories"
                ? "active"
                : ""
            }
          >
            <FaLayerGroup className="icon" />
            <span>Categorías</span>
          </Link>
          <Link
            to="/plataform/muro"
            className={location.pathname === "/plataform/muro" ? "active" : ""}
          >
            <BsChatSquareText className="icon" />
            <span>Muro</span>
          </Link>
        </div>
      </Grid>
    );
  };

  return props.isMobile ? getNavMobile() : getNavDesktop();
}

export default NLayout;
