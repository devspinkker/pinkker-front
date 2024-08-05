import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  Drawer,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import NavbarLeft from "../navbarLeft/NavbarLeft";
import Search from "../navbar/search/Search";
import "./NLayout.css";
import DropdownBalance from "../navbar/balance/DropdownBalance";
import DropdownPurchase from "../navbar/purchase/DropdownPurchase";
import CanalesRecomendados from "./CanalesRecomendados";
import Auth from "../auth/Auth";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  GetAllsStreamsOnline,
  getStreamSummariesByTitle,
} from "../../services/backGo/streams";
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
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";

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
import { GetClipsByTitle } from "../../redux/actions/searchAction";
import {
  PostCreate,
  setToken,
  PostGets,
  GetTweetsRecommended,
} from "../../services/backGo/tweet";
import {
  IoArrowBackCircleOutline,
  IoChatbubbleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import zIndex from "@mui/material/styles/zIndex";
import Notificaciones from "../Notificaciones/Notificaciones";
import Loading from "./Loading";
import axios from "axios";
import { MdManageSearch, MdOndemandVideo } from "react-icons/md";
import { RiUserSearchLine } from "react-icons/ri";

function NLayout(props) {
  const { streamer } = useParams();
  const [locationpath, setLocationPath] = useState();
  const [dashboard, setDashboard] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [abrir, setAbrir] = useState(true);
  const [aparecer, setAparcer] = useState(false);
  const [showPopupAuth, setShowPopupAuth] = useState(false);
  const [type, setType] = useState(0);
  const [openNotification, setOpenNotification] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [openTweet, setOpenTweet] = useState(false);
  const [tweets, setTweets] = useState(null);
  const [message, setMessage] = useState("");
  const [messagesOpen, setMessagesOpen] = useState([]);
  const [notificacion, setNotificacion] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_DEV_API_URL,
  });
  // Message
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
    props.setExpanded(!props.tyExpanded);
    setTimeout(() => {
      if (pulse) {
        setAparcer(true);
      } else {
        setAparcer(false);
      }
    }, 500);
  }
  // Notificaciones
  const [socket, setSocket] = useState(null);
  const [PinkerNotifications, setPinkerNotifications] = useState([]);
  const token = window.localStorage.getItem("token");
  const anySeenNotifications = PinkerNotifications.some(
    (notification) => !notification.visto
  );

  useEffect(() => {
    if (token) {
      const connectWebSocket = () => {
        const REACT_APP_BACKCHATWS = process.env.REACT_APP_BACKCOMMERCIALWS;
        const newSocket = new WebSocket(
          `${REACT_APP_BACKCHATWS}/ws/pinker_notifications/${token}`
        );

        newSocket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        newSocket.onmessage = (event) => {
          const receivedMessage = JSON.parse(event.data);
          console.log(receivedMessage);

          setPinkerNotifications((prevNotifications) => [
            ...prevNotifications,
            { ...receivedMessage, visto: false },
          ]);
          // SetanySeenNotifications();
        };

        newSocket.onopen = () => {
          console.log("WebSocket connected");
        };

        setSocket(newSocket);

        return () => {
          newSocket.close();
          console.log("WebSocket disconnected");
        };
      };

      if (!socket) {
        connectWebSocket();
      }
    }
  }, [token, socket]);
  const markAllAsSeen = () => {
    setPinkerNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        visto: true,
      }))
    );
  };

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
  const isStreamerPath = /^\/[^\/]+$/.test(location.pathname);

  console.log('props.user?.NameUser?.length', props.user?.NameUser?.length)
  console.log('location.pathname.includes', location.pathname.includes('/post'))
  console.log('isStreamerPath', isStreamerPath)
  console.log('( !isStreamerPath || !location.pathname.includes())', ( !isStreamerPath || location.pathname.includes('/post')))
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
      props.setExpandedLeft(false);
    } else {
      setOpenMessage(true);
      props.setExpandedLeft(true);
    }
    setOpenNotification(false);
  };
  const habilitarNotificaciones = () => {
    if (openNotification) {
      setOpenNotification(false);
      props.setExpandedLeft(false);
    } else {
      setOpenNotification(true);
      props.setExpandedLeft(true);

      markAllAsSeen();
    }
    // SetanySeenNotifications(
    //   PinkerNotifications.some((notification) => notification.visto)
    // );
    setOpenMessage(false);
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
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [habilitar, setHabilitar] = useState(false);
  const handleClose = () => setHabilitar(!habilitar);
  const [text, setText] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [openVideo, setOpenVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleItemClick = (url, valor, user, id) => {
    if (valor) {
      const url = `/${user}/${id}`;
      window.location.href = url;
    } else {
      setHabilitar(false);
      setVideoUrl(url);
      setOpenVideo(true);
    }
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    setVideoUrl("");
  };
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= 0) {
      setSearch([]);
      setText(null);
    } else {
      setText(value);

      const getUser = () => {
        return fetchSearch(value).then((res) => {
          console.log("fetchSearch result:", res.data.data);
          return Array.isArray(res.data.data) ? res.data.data : []; // Asegurarse de que es un array
        });
      };

      const getClip = () => {
        return GetClipsByTitle(value).then((res) => {
          return Array.isArray(res.data.data) ? res.data.data : []; // Asegurarse de que es un array
        });
      };
      const getVods = () => {
        return getStreamSummariesByTitle(value).then((res) => {
          return Array.isArray(res.data) ? res.data : []; // Asegurarse de que es un array
        });
      };

      if (tabIndex === 3) {
        getVods()
          .then((data) => {
            console.log("Vods:", data)
            setSearch(data);
          })
          .catch((error) => {
            console.error("Error getting clips:", error);
          });
      }
      else if (tabIndex === 2) {
        getClip()
          .then((data) => {
            setSearch(data);
          })
          .catch((error) => {
            console.error("Error getting clips:", error);
          });
      } else if (tabIndex === 0) {
        Promise.all([getUser(), getClip(), getVods()])
          .then((results) => {
            const userResults = Array.isArray(results[0]) ? results[0] : [];
            const clipResults = Array.isArray(results[1]) ? results[1] : [];
            const VodsResults = Array.isArray(results[2]) ? results[2] : [];

            const combinedResults = [
              ...userResults,
              ...clipResults,
              ...VodsResults,
            ];

            setSearch(combinedResults);
          })
          .catch((error) => {
            console.error("Error combining results:", error);
          });
      } else {
        getUser()
          .then((data) => {
            setSearch(data);
          })
          .catch((error) => {
            console.error("Error getting user:", error);
          });
      }
    }
  };
  useEffect(() => {
    if (text?.length > 0) {
      handleChange({ target: { value: text } });
    }
  }, [tabIndex]);
  console.log(tabIndex)

  const [loading, setLoading] = useState(true);
  // sacar
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);
  //
  function clickPulsedButtonExpandedLeft() {
    setPulse(!pulse);
    props.setExpandedLeft(!props.txExpandedLeft);
    if (props.txExpandedLeft) {
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

  async function handlePost() {
    if (message != "") {
      const formData = new FormData();
      formData.append("Status", message);

      try {
        let loggedUser = window.localStorage.getItem("token");
        if (loggedUser) {
          setToken(loggedUser);
          setMessage("");
          const res = await PostCreate(formData);
          if (res?.message === "StatusCreated") {
            setTweets([res.post, ...tweets]);
          }
        }
        setOpenTweet(false);
      } catch (error) {
        setOpenTweet(false);
        console.error(error);
      }
    }
  }
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenTweet(open);
  };


  const getNavDesktop = () => {
    return loading ? (
      <div className={`loading-overlay ${loading ? "fade-out" : ""}`}>
        <Loading />
      </div>
    ) : (
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
            width: props.tyExpanded ? "16rem" : "4rem",
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
              padding: props.tyExpanded ? "14.97px 14.5px" : "26.72px 0px",
              width: "222px",
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
                display: "flex",
                color: "white",
                fontSize: "26px",
                padding: !props.tyExpanded && "0px 14.5px",
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
                    placeholder="Buscar.."
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
                animation: "ease-in-out 1s linear",
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
                  <div
                    style={{
                      animation: "ease-in-out 3s linear",
                    }}
                    className="pixel-coming-soon-text-container"
                  >
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
                      width: "100% !important",
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
            width:
              props.tyExpanded && props.txExpandedLeft
                ? "72%"
                : props.tyExpanded && !props.txExpandedLeft
                  ? "85%"
                  : !props.tyExpanded && props.txExpandedLeft
                    ? "85%"
                    : "95%",
            display: "flex",
            flexDirection: "column",
            transition: "width .2s ease-in-out",
            zIndex: 99999,
          }}
        >
          {!props.user?.NameUser ? (
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
                padding: "15.5px 5.8rem",
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
                          src="/images/pixel.png"
                          alt=""
                        />{" "}
                        <span style={{ fontSize: "14px" }}>
                          {props.user?.Pixeles != 0
                            ? props.user?.Pixeles.toFixed(2)
                            : "0.00"}
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
                  <div
                    onClick={() => habilitarNotificaciones()}
                    className="navbar-image-avatar-container"
                  >
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
                      {anySeenNotifications && (
                        <span className="messagechat-InfoUserTo-notiNav"></span>
                      )}
                      <IoMdNotificationsOutline
                        style={{ fontSize: "20px", color: "white" }}
                        name="notificaciones"
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => habilitarMensaje()}
                    className="navbar-image-avatar-container"
                  >
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
                            to={"/" + props.user?.NameUser}
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
                        to={"/" + props.user?.NameUser}
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
                        to={"/" + props.user?.NameUser + "/dashboard/stream"}
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
                        to={"/" + props.user?.NameUser + "/settings"}
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
            style={{
              width: "102%",
              padding: props.isMobile && "0px 0px 25% 0px",
            }}
            onClick={() => setEsClick(false)}
          >
            {props.children}
            {habilitar && (
              <div className="auth-body-container">
                <div className={"auth-body"}>
                  <div
                    style={{
                      height: "95% ",
                      textAlign: "center",
                      backgroundColor: "#121418",
                      borderRadius: "5px",
                      zIndex: 9999,
                      display: "flex",
                      boxShadow: "5px 5px 20px 5px rgba(0, 0, 0, 0.651)",
                      width: "85%",
                    }}
                  >
                    <DialogContent
                      style={{
                        backgroundColor: "#131418", // Fondo oscuro
                        padding: "0px !important", // Espaciado interno
                        borderRadius: "8px", // Bordes redondeados
                        color: "white",
                      }}
                    >
                      <Grid
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#080808",
                          padding: "15px",
                        }}
                      >
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Buscar"
                          type="search"
                          fullWidth
                          variant="outlined"
                          value={text}
                          onChange={handleChange}
                          style={{ width: "97%" }}
                          InputProps={{
                            style: {
                              color: "white",
                              borderColor: "white",
                              borderRadius: "1000px",
                              backgroundColor: "#212129",
                            },
                            classes: {
                              notchedOutline: {
                                borderColor: "white",
                                borderRadius: "1000px",
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
                              borderRadius: "1000px",
                            },
                            placeholder: "Buscar...",
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
                              backgroundColor: "#212129",
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

                        <i
                          onClick={() => setHabilitar(false)}
                          style={{
                            fontSize: props.isMobile ? "20px" : "24px",
                            cursor: "pointer",
                          }}
                          class="fas fa-times"
                        />
                      </Grid>

                      <Grid
                        position="static"
                        style={{
                          borderTop: "2px solid #2a2e37",
                          padding: "24px",
                        }}
                      >
                        <Tabs
                          value={tabIndex}
                          onChange={handleTabChange}
                          variant="fullWidth"
                          TabIndicatorProps={{ style: { display: "none" } }}
                          sx={{
                            "& .MuiTab-root": {
                              minWidth: "auto", // para que el ancho mínimo no sea forzado por Material-UI
                              width: "auto", // ancho automático basado en el contenido
                              padding: "0 10px", // ajusta el padding según sea necesario
                            },
                          }}
                        >
                          <Tab
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <MdManageSearch style={{ fontSize: "32px" }} />
                                Todos
                              </div>
                            }
                            style={{
                              color: tabIndex === 0 ? "#f16397" : "#fff",
                              backgroundColor: "#202329",
                              border:
                                tabIndex === 0
                                  ? "1px solid #f16397"
                                  : "inherit",

                              borderRadius: "10px",
                              margin: "0 5px",
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          />
                          <Tab
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <RiUserSearchLine
                                  style={{ fontSize: "32px" }}
                                />
                                Usuarios
                              </div>
                            }
                            style={{
                              color: tabIndex === 1 ? "#f16397" : "#fff",
                              backgroundColor: "#202329",
                              border:
                                tabIndex === 1
                                  ? "1px solid #f16397"
                                  : "inherit",
                              borderRadius: "10px",
                              margin: "0 5px",
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          />
                          <Tab
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <MdOndemandVideo style={{ fontSize: "32px" }} />
                                Clips
                              </div>
                            }
                            style={{
                              color: tabIndex === 2 ? "#f16397" : "#fff",
                              backgroundColor: "#202329",
                              border:
                                tabIndex === 2
                                  ? "1px solid #f16397"
                                  : "inherit",
                              borderRadius: "10px",
                              margin: "0 5px",
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          />
                          <Tab
                            label={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <MdOndemandVideo style={{ fontSize: "32px" }} />
                                Vods
                              </div>
                            }
                            style={{
                              color: tabIndex === 3 ? "#f16397" : "#fff",
                              backgroundColor: "#202329",
                              border:
                                tabIndex === 3
                                  ? "1px solid #f16397"
                                  : "inherit",
                              borderRadius: "10px",

                              margin: "0 5px",
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          />
                        </Tabs>
                      </Grid>
                      <Box
                        mt={2}
                        style={{ backgroundColor: "#080808", height: "100%" }}
                      >
                        <Grid
                          container
                          spacing={2}
                          style={{ backgroundColor: "#080808" }}
                        >
                          {Array.isArray(search) &&
                            search.length > 0 &&
                            search?.map((game, index) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={index}
                                style={{ backgroundColor: "#080808" }}
                              >
                                {!game?.streamThumbnail && !game?.StreamThumbnail ? (
                                  <Link
                                    key={index}
                                    to={`/${game?.NameUser}`}
                                    onClick={() => setHabilitar(false)}
                                    style={{
                                      textDecoration: "none",
                                      width: "33%",
                                    }}
                                  >
                                    <Card
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderRadius: "50%",
                                        textAlign: "center",
                                        padding: "20px",
                                        boxShadow: "none",
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: "relative",
                                          width: "150px",
                                          height: "150px",
                                          margin: "0 auto",
                                        }}
                                      >
                                        <CardMedia
                                          component="img"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "50%",
                                          }}
                                          image={game?.Avatar}
                                          alt={game?.NameUser}
                                        />
                                      </div>
                                      <CardContent>
                                        <Typography
                                          variant="body1"
                                          style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {game?.NameUser}
                                        </Typography>
                                        {/* <Typography
                                      variant="body2"
                                      style={{ color: "grey" }}
                                    >
                                      Artista
                                    </Typography> */}
                                      </CardContent>
                                    </Card>
                                  </Link>
                                ) : (
                                  <Box
                                    style={{ backgroundColor: "#080808" }}
                                    sx={{
                                      maxWidth: 400,
                                      margin: "0 auto",
                                      backgroundColor: "#1c1c1c",
                                      color: "white",
                                      borderRadius: 2,
                                      overflow: "hidden",
                                    }}
                                    onClick={() => handleItemClick(game?.url, game?.StreamThumbnail && true, game?.StreamThumbnail && game?.UserInfo?.NameUser, game?.StreamThumbnail && game?.id)}
                                  >
                                    <Box
                                      component="img"
                                      src={game?.streamThumbnail || game?.StreamThumbnail}
                                      alt="Workout"
                                      sx={{ width: "100%", height: "auto" }}
                                    />
                                    <Box sx={{ p: 2 }}>
                                      <Typography
                                        variant="body"
                                        fontWeight="bold"
                                      >
                                        {game?.clipTitle || game?.Title}
                                      </Typography>
                                      <Grid
                                        container
                                        alignItems="center"
                                        sx={{ mt: 2 }}
                                        style={{ gap: "5px" }}
                                      >
                                        <Avatar
                                          src={game?.Avatar || game?.UserInfo?.Avatar}
                                          alt={`Clipeado por ${game?.nameUserCreator}`}
                                          sx={{ width: 40, height: 40 }}
                                        />{" "}
                                        {/* Add avatar image path */}
                                        <Box
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                          }}
                                        >
                                          <Typography
                                            variant="body"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {
                                              game?.streamThumbnail &&
                                              (`clipeado por ${game?.nameUserCreator}`)
                                            }
                                            {
                                              game?.StreamThumbnail &&
                                              (`${game?.UserInfo?.FullName}`)
                                            }
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="gray"
                                          >
                                            {game?.views || game?.MaxViewers} Visitas •{" "}
                                            {game?.category || game?.stream_category}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Box>
                                  </Box>
                                )}
                              </Grid>
                            ))}
                        </Grid>
                      </Box>
                    </DialogContent>
                  </div>
                </div>
              </div>
            )}

            {openVideo && (
              <div className="auth-body-container">
                <div className={"auth-body"}>
                  <div
                    style={{
                      padding: "10px",
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
                    <DialogContent
                      onClose={handleCloseVideo}
                      maxWidth="md"
                      fullWidth
                    >
                      <Box sx={{ position: "relative", padding: 2 }}>
                        <IconButton
                          onClick={handleCloseVideo}
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: "white",
                          }}
                        >
                          <IoCloseCircleOutline />
                        </IconButton>
                        <video
                          src={videoUrl}
                          autoPlay
                          controls
                          sx={{ width: "85% !important", height: "auto" }}
                        />
                      </Box>
                    </DialogContent>
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

        {(openNotification || openMessage) && !props.tyExpande && (
          <Grid
            style={{
              width: "15%",
              transition: "width 1s ease-in-out",
              border: "1px solid #2a2e38",
              height: "100vh",
              backgroundColor: "#121418",
              position: "sticky",
              zIndex: 999999,
              top: 0,
              transition: "width 1s ease-in-out",
            }}
          >
            <Grid
              style={{
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                border: "1px solid #343843",
                transition: "width 1s ease-in-out",
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
            <div
              style={{
                transition: "width 1s ease-in-out",
              }}
            >
              {openMessage ? (
                <Message messagesOpen1={messagesOpen} />
              ) : (
                <Notificaciones PinkerNotifications={PinkerNotifications} />
              )}
            </div>
          </Grid>
        )}
      </Grid>
    );
  };

  const getNavMobile = () => {
    return loading ? (
      <div className={`loading-overlay ${loading ? "fade-out" : ""}`}>
        <Loading />
      </div>
    ) : (
      <Grid>
        {!props.user?.NameUser ? (
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
                        src="/images/pixel.png"
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

            <Grid
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Grid
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div
                  onClick={() => habilitarNotificaciones()}
                  className="navbar-image-avatar-container"
                >
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
                    {anySeenNotifications && (
                      <span className="messagechat-InfoUserTo-notiNav"></span>
                    )}
                    <IoMdNotificationsOutline
                      style={{ fontSize: "24px", color: "white" }}
                      name="notificaciones"
                    />
                  </div>
                </div>
                <div
                  onClick={() => habilitarMensaje()}
                  className="navbar-image-avatar-container"
                >
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
                    <BsChatDots style={{ fontSize: "24px", color: "white" }} />
                  </div>
                </div>
              </Grid>
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
                          to={"/" + props.user?.NameUser}
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
                      to={"/" + props.user?.NameUser}
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
                      to={"/" + props.user?.NameUser + "/dashboard/stream"}
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
                      to={"/" + props.user?.NameUser + "/settings"}
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
          style={{ width: "100%", height: !window.location.pathname?.includes('/post') && "100vh" }}
          onClick={() => setEsClick(false)}
        >
          {
            !isStreamerPath && !location.pathname.includes('/post') && props.user?.NameUser?.length &&
            <IconButton
              style={{
                color: "#fff",
                position: "fixed",
                bottom: "10%",
                right: "3%",
                backgroundColor: "#ff69c4",
                zIndex: 99999999,
              }}
              aria-label="fingerprint"
              color="secondary"
              onClick={() => setOpenTweet(!openTweet)}
            >
               <AddCircleOutlineIcon style={{ fontSize: "4.5rem" }} />
            </IconButton>
          }


          {
            <Drawer
              anchor="bottom"
              open={openTweet}
              onClose={toggleDrawer(false)}
              transitionDuration={{ enter: 500, exit: 500 }}
              PaperProps={{
                style: { height: "93%", backgroundColor: "#080808" },
              }} // Esto asegura que el Drawer ocupe todo el alto
            >
              <Box
                sx={{
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "2rem",
                }}
                role="presentation"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <IoArrowBackCircleOutline
                    style={{ color: "white", fontSize: "2.5rem" }}
                    onClick={() => setOpenTweet(false)}
                  />
                  <button
                    onClick={() => handlePost()}
                    className="muro-send-tweet-button"
                  >
                    Postear
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "100%",
                      }}
                      src={
                        props.user?.Avatar
                          ? props.user?.Avatar
                          : "/images/search.svg"
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label='¿Qué está pasando' 
                      variant="outlined"
                      fullWidth
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      multiline
                      rows={4}
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
                    // sx={{ flex: 1, marginBottom: 2, color:'white' }}
                    />
                    <Typography
                      variant="subtitle1"
                      style={{
                        marginTop: "10px",
                        color: message?.length > 100 ? "red" : "white",
                        textAlign: "right",
                      }}
                    >
                      {message.length}/100
                    </Typography>
                  </div>
                </div>
              </Box>
            </Drawer>
          }

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
