import React, { useState, useEffect, useRef } from "react";
import "./DashboardStream.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ChatStreaming } from "./chat/ChatStreaming";
import { getUserByIdTheToken } from "../../../services/backGo/user";
import {
  getStreamById,
  updateModChat,
  updateModChatSlowModeAxios,
} from "../../../services/backGo/streams";
import { getStream } from "../../../services/stream";
import ReactFlvPlayer from "../../../player/PlayerMain";
import PopupEditInfo from "./popup/PopupEditInfo";
import { Button, Chip, Grid, Slider, Switch, Typography } from "@mui/material";
import { AiFillThunderbolt } from "react-icons/ai";
import { IoMdPause } from "react-icons/io";
import { CiStreamOn } from "react-icons/ci";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { GoHeartFill } from "react-icons/go";
import DashboarLayout from "../DashboarLayout";
import Tippy from "@tippyjs/react";
import { FaInfoCircle, FaPencilAlt, FaUndo, FaSave } from "react-icons/fa";
import { IoChatboxEllipsesOutline, IoNewspaperOutline, IoVideocam } from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import logoPinkker from './Chancho--dengue.webp';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Definición estática de las secciones con títulos en español e íconos
const sectionDefinitions = {
  infoSesion: { title: "Información de la sesión", icon: <CiStreamOn style={{ color: "white" }} />, height: 200 },
  vistaPrevia: { title: "Vista previa del stream", icon: <MdOutlineOndemandVideo style={{ color: "white" }} />, height: 350 },
  feedAct: { title: "Feed de Actividades", icon: <AiFillThunderbolt style={{ color: "white" }} />, height: 300 },
  accMod: { title: "Acciones de Moderador", icon: <IoNewspaperOutline style={{ color: "white" }} />, height: 200 },
  chat: { title: "Chat", icon: <IoChatboxEllipsesOutline style={{ color: "white" }} />, height: 700 },
  infoStream: { title: "Información del stream", icon: <FiTool style={{ color: "white" }} />, height: 200 },
  accCanal: { title: "Acciones del canal", icon: <IoVideocam style={{ color: "white" }} />, height: 200 },
};

// Función para eliminar duplicados basada en el ID
const removeDuplicates = (array) => {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

// Configuración predeterminada de las secciones
const defaultSections = {
  left: [
    { id: "infoSesion", visible: true, ...sectionDefinitions.infoSesion },
    { id: "vistaPrevia", visible: true, ...sectionDefinitions.vistaPrevia },
    { id: "feedAct", visible: true, ...sectionDefinitions.feedAct },
    { id: "accMod", visible: true, ...sectionDefinitions.accMod },
  ],
  center: [
    { id: "chat", visible: true, ...sectionDefinitions.chat },
  ],
  right: [
    { id: "infoStream", visible: true, ...sectionDefinitions.infoStream },
    { id: "accCanal", visible: true, ...sectionDefinitions.accCanal },
  ],
};

// Valores iniciales de los anchos en porcentaje
const initialWidths = {
  leftWidth: 40, // 40%
  centerWidth: 35, // 35%
  rightWidth: 20, // 20%
};

export default function DashboardStream({ isMobile, tyExpanded, user }) {
  const [streamerData, setStreamerData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const [volumePlayer, setVolumePlayer] = useState(0.5);
  const [videoLoading, setVideoLoading] = useState(true);
  const [mostrarditInfoStream, setditInfoStreamN] = useState(false);
  const [ChatOnliFollowers, setChatOnliFollowers] = useState(false);
  const [ChatOnliSubs, setChatOnliSubs] = useState(false);
  const [SecondModChatSlowMode, setSecondModChatSlowMode] = useState(null);
  const [socket, setSocket] = useState(null);
  const pingIntervalRef = useRef();
  const [ActivityFeed, setActivityFeed] = useState([]);
  const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [menuModChatSlowMode, setModChatSlowMode] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sections, setSections] = useState(defaultSections);
  const [leftWidth, setLeftWidth] = useState(initialWidths.leftWidth);
  const [centerWidth, setCenterWidth] = useState(initialWidths.centerWidth);
  const [rightWidth, setRightWidth] = useState(initialWidths.rightWidth);

  // Cargar layout desde localStorage
  const loadSectionsLayout = () => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        const { sections: savedSections, widths } = parsedLayout;

        // Cargar secciones con valores predeterminados si faltan
        setSections({
          left: savedSections?.left?.map(s => ({
            ...s,
            title: sectionDefinitions[s.id].title,
            icon: sectionDefinitions[s.id].icon,
          })) || defaultSections.left,
          center: savedSections?.center?.map(s => ({
            ...s,
            title: sectionDefinitions[s.id].title,
            icon: sectionDefinitions[s.id].icon,
          })) || defaultSections.center,
          right: savedSections?.right?.map(s => ({
            ...s,
            title: sectionDefinitions[s.id].title,
            icon: sectionDefinitions[s.id].icon,
          })) || defaultSections.right,
        });

        // Cargar anchos con valores predeterminados si faltan
        setLeftWidth(widths?.leftWidth ?? initialWidths.leftWidth);
        setCenterWidth(widths?.centerWidth ?? initialWidths.centerWidth);
        setRightWidth(widths?.rightWidth ?? initialWidths.rightWidth);
      } catch (error) {
        console.error('Error al parsear el layout guardado:', error);
        setSections(defaultSections);
        setLeftWidth(initialWidths.leftWidth);
        setCenterWidth(initialWidths.centerWidth);
        setRightWidth(initialWidths.rightWidth);
      }
    }
  };

  useEffect(() => {
    loadSectionsLayout();
  }, []);

  // Guardar layout en localStorage
  const saveSectionsLayout = () => {
    const layout = {
      sections: {
        left: sections.left.map(section => ({ ...section })),
        center: sections.center.map(section => ({ ...section })),
        right: sections.right.map(section => ({ ...section })),
      },
      widths: {
        leftWidth,
        centerWidth,
        rightWidth,
      },
    };
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    console.log('Layout guardado:', layout);
  };

  // Restaurar valores predeterminados
  const resetSectionsToDefault = () => {
    setSections(defaultSections);
    setLeftWidth(initialWidths.leftWidth);
    setCenterWidth(initialWidths.centerWidth);
    setRightWidth(initialWidths.rightWidth);
  };

  // Toggle modo edición
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  // Manejar el inicio del arrastre
  const handleDragStart = (start) => {
    setDraggingId(start.draggableId);
  };

  // Manejar el fin del arrastre
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    setDraggingId(null);

    if (!destination) return;

    const sourceSection = source.droppableId;
    const destSection = destination.droppableId;

    const newSections = { ...sections };
    const sourceItems = Array.from(newSections[sourceSection]);
    const destItems = sourceSection === destSection ? sourceItems : Array.from(newSections[destSection]);
    const [movedItem] = sourceItems.splice(source.index, 1);

    destItems.splice(destination.index, 0, movedItem);
    newSections[sourceSection] = sourceItems;
    newSections[destSection] = destItems;

    setSections(newSections);
  };

  // Toggle visibilidad de una sección
  const toggleSectionVisibility = (sectionId) => {
    setSections((prevSections) => {
      const newSections = { ...prevSections };
      ["left", "center", "right"].forEach((column) => {
        newSections[column] = newSections[column].map((section) =>
          section.id === sectionId ? { ...section, visible: !section.visible } : section
        );
      });
      return newSections;
    });
  };

  // Actualizar altura de una sección
  const updateSectionHeight = (column, sectionId, newHeight) => {
    setSections(prev => ({
      ...prev,
      [column]: prev[column].map(s =>
        s.id === sectionId ? { ...s, height: newHeight } : s
      ),
    }));
  };

  // Convertir porcentaje a píxeles
  const percentageToPixels = (percentage) => {
    return (percentage / 100) * (window.innerWidth * 0.95); // 95% del ancho total
  };

  // Funciones existentes (sin cambios significativos)
  const speakMessage = (message) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = "es";
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const REACT_APP_BACKCOMMERCIALWS = process.env.REACT_APP_BACKCOMMERCIALWS;
    let id = window.localStorage.getItem("_id");
    const connectWebSocket = () => {
      const newSocket = new WebSocket(
        `${REACT_APP_BACKCOMMERCIALWS}/ws/notification/ActivityFeed/${id}`
      );

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onmessage = (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);
          if (receivedMessage.action === "DonatePixels") {
            speakMessage(receivedMessage.text);
          }
          setActivityFeed((prevMessages) => [...prevMessages, receivedMessage]);
        } catch (error) {
          console.error("Error parsing JSON message:", error);
        }
      };

      newSocket.onopen = () => { };

      setSocket(newSocket);

      window.addEventListener("beforeunload", () => {
        newSocket.send("closing");
        newSocket.close();
      });
    };

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("closing");
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    const pingInterval = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    };

    const intervalId = setInterval(pingInterval, 3000);
    pingInterval();

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    pingIntervalRef.current = intervalId;

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      let id = window.localStorage.getItem("_id");
      let token = window.localStorage.getItem("token");
      const resuser = await getUserByIdTheToken(token);
      if (resuser.message === "ok") setUserData(resuser.data);
      const dataStreamer = await getStreamById(id);
      if (dataStreamer?.data) {
        setStreamerData(dataStreamer.data);
        setChatOnliFollowers(dataStreamer.data?.ModChat === "Following");
        setChatOnliSubs(dataStreamer.data?.ModChat === "Subscriptions");
        setSecondModChatSlowMode(dataStreamer.data?.ModSlowMode || 0);
      }
      const res = await getStream(token);
      if (res) setStream(res);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateElapsedTime = () => {
      if (!streamerData?.start_date) return;
      const startDateTime = new Date(streamerData.start_date);
      const now = new Date();
      const timeDifference = now - startDateTime;
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      setElapsedTime({ hours, minutes, seconds });
    };
    const interval = setInterval(calculateElapsedTime, 1000);
    return () => clearInterval(interval);
  }, [streamerData?.start_date]);

  const formatNumber = (number) => (number < 10 ? `0${number}` : number);

  const getHlsSrc = () => {
    const keyTransmission = userData?.keyTransmission?.substring(4);
    const rtmp = process.env.REACT_APP_RTMP || "http://localhost:8000/live";
    return `${rtmp}/${keyTransmission}`;
  };

  const getHlsPlayer = () => (
    <Grid>
      <ReactFlvPlayer
        id="pinkker-player"
        videoRef={videoRef}
        preload="auto"
        playsInline={true}
        src={getHlsSrc()}
        autoPlay={false}
        muted={true}
        controls={true}
        width="100%"
        height="100%"
        quality="1080"
      />
    </Grid>
  );

  const getVolumeButton = () => {
    if (muted) {
      return (
        <Tippy content={<h1 style={{ fontSize: "12px" }}>Volumen</h1>}>
          <i
            onMouseEnter={() => setVolumeHovered(true)}
            onMouseLeave={() => setVolumeHovered(false)}
            onClick={mutedPlayer}
            style={{ cursor: "pointer" }}
            className="fas fa-volume-mute pinkker-button-more"
          />
        </Tippy>
      );
    }
    return (
      <Tippy content={<h1 style={{ fontSize: "12px" }}>Volumen</h1>}>
        <i
          onMouseEnter={() => setVolumeHovered(true)}
          onMouseLeave={() => setVolumeHovered(false)}
          onClick={mutedPlayer}
          style={{ cursor: "pointer" }}
          className="fas fa-volume-down pinkker-button-more"
        />
      </Tippy>
    );
  };

  const mutedPlayer = () => {
    if (!videoLoading) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
      setVolumePlayer(muted ? 0.2 : 0);
    }
  };

  const setVolume = (volume) => {
    if (volume === 0) {
      setMuted(true);
    } else {
      videoRef.current.volume = volume;
      setMuted(false);
    }
    setVolumePlayer(volume);
  };

  const videoHandler = () => {
    if (!videoLoading) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };

  const getBottomButtons = () => {
    if (videoRef.current) {
      return (
        <div className="customPlayer-container" style={{ opacity: 1 }}>
          <div className="customPlayer-primary" style={{ top: "-73px" }}>
            <div className="customPlayer-secundary-div" style={{ width: '100%' }}>
              <div className="customPlayer-card">
                {playing ? (
                  <Tippy content={<h1 style={{ fontSize: "12px" }}>Pausa</h1>}>
                    <IoMdPause
                      onClick={videoHandler}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      className="pinkker-button-more"
                    />
                  </Tippy>
                ) : (
                  <Tippy content={<h1 style={{ fontSize: "12px" }}>Play</h1>}>
                    <i
                      onClick={videoHandler}
                      style={{ cursor: "pointer" }}
                      className="fas fa-play pinkker-button-more"
                    />
                  </Tippy>
                )}
              </div>
              <div className="customPlayer-card">{getVolumeButton()}</div>
              <div style={{ marginLeft: "15px", width: "125px" }} className="customPlayer-card">
                <Slider
                  onMouseEnter={() => setVolumeHovered(true)}
                  onMouseLeave={() => setVolumeHovered(false)}
                  value={volumePlayer}
                  max={1}
                  step={0.01}
                  color="secondary"
                  style={{ color: "#fff", opacity: volumeHovered ? "1" : "0" }}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      const handlePlayerLoad = () => setVideoLoading(false);
      const handlePlayerError = () => setVideoLoading(false);
      videoPlayer.addEventListener("loadeddata", handlePlayerLoad);
      videoPlayer.addEventListener("error", handlePlayerError);
      return () => {
        videoPlayer.removeEventListener("loadeddata", handlePlayerLoad);
        videoPlayer.removeEventListener("error", handlePlayerError);
      };
    }
  }, []);

  const toggleChatOnliSubs = async () => {
    let token = window.localStorage.getItem("token");
    if (token) {
      if (ChatOnliSubs) {
        await updateModChat(token, { title: "" });
        setStreamerData({ ...streamerData, ModChat: "" });
        setChatOnliFollowers(false);
      } else {
        await updateModChat(token, { title: "Subscriptions" });
        setStreamerData({ ...streamerData, ModChat: "Subscriptions" });
        setChatOnliFollowers(false);
      }
      setChatOnliSubs(!ChatOnliSubs);
    }
  };

  const toggleChatOnliFollowers = async () => {
    let token = window.localStorage.getItem("token");
    if (token) {
      if (ChatOnliFollowers) {
        await updateModChat(token, { title: "" });
        setStreamerData({ ...streamerData, ModChat: "" });
        setChatOnliSubs(false);
      } else {
        await updateModChat(token, { title: "Following" });
        setStreamerData({ ...streamerData, ModChat: "Following" });
        setChatOnliSubs(false);
      }
      setChatOnliFollowers(!ChatOnliFollowers);
    }
  };

  const toggleEditInfoStream = () => setditInfoStreamN(!mostrarditInfoStream);

  const togglemenuModChatSlowMode = () => setModChatSlowMode(!menuModChatSlowMode);

  const updateModChatSlowMode = async (second) => {
    const secondsInt = parseInt(second, 10);
    let token = window.localStorage.getItem("token");
    if (token) {
      const res = await updateModChatSlowModeAxios(token, secondsInt);
      if (res?.message === "ok") setSecondModChatSlowMode(secondsInt);
    }
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case "infoSesion":
        return (
          <Grid style={{ backgroundColor: '#141517', padding: '5px', display: 'flex', alignItems: 'center' }}>
            {!streamerData?.online && <div className="stats-container"><span className="w-fit grow-0 rounded-[2px] px-[0.375rem] py-1 text-center text-[0.625rem] font-bold uppercase bg-[#F4F5F6] text-[#070809]">Sin conexión</span><span>Sesión</span></div>}
            <div className="stats-container"><span>{streamerData?.online && streamerData?.ViewerCount || "-"}</span><span>espectadores</span></div>
            <div className="stats-container"><span>{userData?.FollowersCount || "-"}</span><span>seguidores</span></div>
            <div className="stats-container"><span>{streamerData?.online ? `${formatNumber(elapsedTime.hours)}:${formatNumber(elapsedTime.minutes)}:${formatNumber(elapsedTime.seconds)}` : "-"}</span><span>Tiempo en vivo</span></div>
          </Grid>
        );
      case "vistaPrevia":
        return streamerData?.online ? (
          <>
            {getHlsPlayer()}
            {getBottomButtons()}
          </>
        ) : (
          <img src={streamerData?.stream_thumbnail} alt="Thumbnail" style={{ width: "100%", height: '100%', objectFit: 'cover' }} />
        );
      case "feedAct":
        return (
          <div style={{ backgroundColor: '#141517', height: '100%', overflowY: 'auto' }}>
            {ActivityFeed.map((item, index) => (
              item.type !== "moderator" && (
                <div key={index} className="activity-feed-item">
                  <GoHeartFill style={{ color: "#ff69c4" }} />
                  <span>{item.nameuser}</span>
                  <span>{item.type === "follow" ? "Te comenzó a seguir" : item.type === "DonatePixels" ? `Dono ${item.Pixeles} Pixeles` : item.type === "Suscribirse" && "Se suscribió"}</span>
                </div>
              )
            ))}
          </div>
        );
      case "accMod":
        return (
          <div style={{ backgroundColor: '#141517', height: '100%', overflowY: 'auto' }}>
            {ActivityFeed.map((item, index) => (
              item.type === "moderator" && (
                <div key={index} className="activity-feed-item">
                  <span>{item.nameuser}</span>
                  <span>{item.type === "moderator" && ` le dio ${item.action} a ${item.actionAgainst}`}</span>
                </div>
              )
            ))}
          </div>
        );
      case "chat":
        return streamerData && userData && !isMobile ? (
          <ChatStreaming
            streamerChat={streamerData}
            chatExpandeds={true}
            streamerData={streamerData}
            user={userData}
            isMobile={isMobile}
            DashboardStream={true}
          />
        ) : null;
      case "infoStream":
        return (
          <Grid style={{ backgroundColor: '#141517', padding: '10px' }}>
            <Typography style={{ color: "white", fontWeight: "bold" }}>{streamerData?.stream_title}</Typography>
            <Grid style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <img src="https://files.kick.com/images/subcategories/15/banner/responsives/b697a8a3-62db-4779-aa76-e4e47662af97___banner_294_392.webp" style={{ width: "15%" }} />
              <Grid>
                <Typography style={{ color: "#f16397" }}>{streamerData?.stream_category}</Typography>
                {streamerData?.stream_tag?.map((tag) => <Chip key={tag} label={tag} style={{ color: 'white', backgroundColor: '#35393c' }} />)}
              </Grid>
            </Grid>
            <Button onClick={toggleEditInfoStream} style={{ backgroundColor: '#333436', color: 'white', width: '95%', margin: '0 auto' }}>Editar</Button>
          </Grid>
        );
      case "accCanal":
        return (
          <Grid style={{ backgroundColor: '#141517', padding: '10px' }}>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>Chat solo seguidores</Typography>
              <Switch checked={ChatOnliFollowers} onChange={toggleChatOnliFollowers} sx={{ '& .Mui-checked': { color: '#f16397' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#f16397' } }} />
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>Chat solo suscriptores</Typography>
              <Switch checked={ChatOnliSubs} onChange={toggleChatOnliSubs} sx={{ '& .Mui-checked': { color: '#f16397' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#f16397' } }} />
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>Chat modo lento</Typography>
              <Switch onChange={togglemenuModChatSlowMode} sx={{ '& .Mui-checked': { color: '#f16397' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#f16397' } }} />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <DashboarLayout user={user} isMobile={isMobile}>
      <Grid
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            width: '95%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <DragDropContext
            onDragStart={handleDragStart}
            onDragEnd={isEditMode ? handleDragEnd : () => {}}
          >
            {/* Columna Izquierda */}
            <ResizableBox
              width={percentageToPixels(leftWidth)}
              height={window.innerHeight * 0.9}
              axis="x"
              resizeHandles={isEditMode ? ['e'] : []}
              minConstraints={[100, 0]}
              maxConstraints={[window.innerWidth * 0.8, window.innerHeight]}
              style={{ display: 'flex', flexDirection: 'column' }}
              className="ColIzq"
              onResize={(e, data) => {
                const newWidthPercentage = (data.size.width / (window.innerWidth * 0.95)) * 100;
                setLeftWidth(newWidthPercentage);
              }}
            >
              <Droppable droppableId="left" isDropDisabled={!isEditMode}>
                {(provided, snapshot) => (
                  <Grid
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      padding: '5px',
                      borderRadius: '5px',
                      height: '100%',
                      backgroundColor: snapshot.isDraggingOver ? '#2a2a2a' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      width: '100%',
                    }}
                  >
                    {sections.left
                      .filter(section => section.visible)
                      .map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                          isDragDisabled={!isEditMode}
                        >
                          {(provided, snapshot) => (
                            <ResizableBox
                              width="100%"
                              height={section.height || sectionDefinitions[section.id].height}
                              axis="y"
                              resizeHandles={isEditMode ? ['s'] : []}
                              minConstraints={[100, 50]}
                              maxConstraints={[Infinity, window.innerHeight * 0.9]}
                              onResizeStop={(e, data) => {
                                updateSectionHeight('left', section.id, data.size.height);
                              }}
                              style={{ backgroundColor: '#141517', marginBottom: '5px', overflow: 'hidden' }}
                            >
                              <Grid
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  padding: '5px',
                                  borderRadius: '5px',
                                  backgroundColor: '#131418',
                                  opacity: snapshot.isDragging ? 0.5 : 1,
                                  border: snapshot.isDragging ? '2px dashed #f16397' : 'none',
                                  ...provided.draggableProps.style,
                                  height: '100%',
                                  overflow: 'hidden',
                                }}
                              >
                                <Grid style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                  {section.icon}
                                  <Typography style={{ color: 'white', fontWeight: 'bold', marginLeft: '5px' }}>
                                    {section.title}
                                  </Typography>
                                </Grid>
                                {renderSectionContent(section.id)}
                              </Grid>
                            </ResizableBox>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </ResizableBox>

            {/* Columna Centro */}
            <ResizableBox
              width={percentageToPixels(centerWidth)}
              height={window.innerHeight * 0.9}
              axis="x"
              resizeHandles={isEditMode ? ['e'] : []}
              minConstraints={[100, 0]}
              maxConstraints={[window.innerWidth * 0.8, window.innerHeight]}
              style={{ display: 'flex', flexDirection: 'column' }}
              className="ColCent"
              onResize={(e, data) => {
                const newWidthPercentage = (data.size.width / (window.innerWidth * 0.95)) * 100;
                setCenterWidth(newWidthPercentage);
              }}
            >
              <Droppable droppableId="center" isDropDisabled={!isEditMode}>
                {(provided, snapshot) => (
                  <Grid
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      padding: '5px',
                      borderRadius: '5px',
                      height: '100%',
                      backgroundColor: snapshot.isDraggingOver ? '#2a2a2a' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      width: '100%',
                    }}
                  >
                    {sections.center
                      .filter(section => section.visible)
                      .map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                          isDragDisabled={!isEditMode}
                        >
                          {(provided, snapshot) => (
                            <ResizableBox
                              width="100%"
                              height={section.height || sectionDefinitions[section.id].height}
                              axis="y"
                              resizeHandles={isEditMode ? ['s'] : []}
                              minConstraints={[100, 50]}
                              maxConstraints={[Infinity, window.innerHeight * 0.9]}
                              onResizeStop={(e, data) => {
                                updateSectionHeight('center', section.id, data.size.height);
                              }}
                              style={{ backgroundColor: '#141517', marginBottom: '5px', overflow: 'hidden' }}
                            >
                              <Grid
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  padding: '5px',
                                  borderRadius: '5px',
                                  backgroundColor: '#131418',
                                  opacity: snapshot.isDragging ? 0.5 : 1,
                                  border: snapshot.isDragging ? '2px dashed #f16397' : 'none',
                                  ...provided.draggableProps.style,
                                  height: '100%',
                                  overflow: 'hidden',
                                }}
                              >
                                <Grid style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                  {section.icon}
                                  <Typography style={{ color: 'white', fontWeight: 'bold', marginLeft: '5px' }}>
                                    {section.title}
                                  </Typography>
                                </Grid>
                                {renderSectionContent(section.id)}
                              </Grid>
                            </ResizableBox>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </ResizableBox>

            {/* Columna Derecha */}
            <ResizableBox
              width={percentageToPixels(rightWidth)}
              height={window.innerHeight * 0.9}
              axis="x"
              resizeHandles={isEditMode ? ['e'] : []}
              minConstraints={[100, 0]}
              maxConstraints={[window.innerWidth * 0.8, window.innerHeight]}
              style={{ display: 'flex', flexDirection: 'column' }}
              className="ColDer"
              onResize={(e, data) => {
                const newWidthPercentage = (data.size.width / (window.innerWidth * 0.95)) * 100;
                setRightWidth(newWidthPercentage);
              }}
            >
              <Droppable droppableId="right" isDropDisabled={!isEditMode}>
                {(provided, snapshot) => (
                  <Grid
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      padding: '5px',
                      borderRadius: '5px',
                      height: '100%',
                      backgroundColor: snapshot.isDraggingOver ? '#2a2a2a' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      width: '100%',
                    }}
                  >
                    {sections.right
                      .filter(section => section.visible)
                      .map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                          isDragDisabled={!isEditMode}
                        >
                          {(provided, snapshot) => (
                            <ResizableBox
                              width="100%"
                              height={section.height || sectionDefinitions[section.id].height}
                              axis="y"
                              resizeHandles={isEditMode ? ['s'] : []}
                              minConstraints={[100, 50]}
                              maxConstraints={[Infinity, window.innerHeight * 0.9]}
                              onResizeStop={(e, data) => {
                                updateSectionHeight('right', section.id, data.size.height);
                              }}
                              style={{ backgroundColor: '#141517', marginBottom: '5px', overflow: 'hidden' }}
                            >
                              <Grid
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  padding: '5px',
                                  borderRadius: '5px',
                                  backgroundColor: '#131418',
                                  opacity: snapshot.isDragging ? 0.5 : 1,
                                  border: snapshot.isDragging ? '2px dashed #f16397' : 'none',
                                  ...provided.draggableProps.style,
                                  height: '100%',
                                  overflow: 'hidden',
                                }}
                              >
                                <Grid style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                  {section.icon}
                                  <Typography style={{ color: 'white', fontWeight: 'bold', marginLeft: '5px' }}>
                                    {section.title}
                                  </Typography>
                                </Grid>
                                {renderSectionContent(section.id)}
                              </Grid>
                            </ResizableBox>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </ResizableBox>
          </DragDropContext>
        </Grid>

        {/* Barra lateral fija a la derecha */}
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '5px',
            borderRadius: '5px',
            height: '100vh',
            width: '5%',
            flexShrink: 0,
          }}
        >
          <Grid
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',
              borderRadius: '5px',
              height: '100%',
              backgroundColor: '#131418',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
                alignItems: 'center',
                backgroundColor: '#131418',
                width: '100%',
                padding: '5px',
                justifyContent: 'center',
              }}
            >
              <FaInfoCircle style={{ color: 'white', fontSize: '15px' }} />
            </Grid>
            <hr style={{ width: '100%' }} />
            {Object.values(sections).flat().map((section) => (
              <Grid
                key={section.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '5px',
                  alignItems: 'center',
                  backgroundColor: '#131418',
                  width: '100%',
                  padding: '5px',
                  justifyContent: 'center',
                  border: section.visible ? '1px solid #f16397' : '1px solid grey',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: 'white',
                }}
                onClick={() => toggleSectionVisibility(section.id)}
              >
                {section.icon}
              </Grid>
            ))}
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
                alignItems: 'center',
                backgroundColor: '#131418',
                width: '100%',
                padding: '5px',
                justifyContent: 'center',
                border: isEditMode ? '1px solid #f16397' : '1px solid grey',
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'white',
              }}
              onClick={toggleEditMode}
            >
              <FaPencilAlt style={{ fontSize: '15px' }} />
            </Grid>
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
                alignItems: 'center',
                backgroundColor: '#131418',
                width: '100%',
                padding: '5px',
                justifyContent: 'center',
                border: '1px solid grey',
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'white',
              }}
              onClick={resetSectionsToDefault}
            >
              <FaUndo style={{ fontSize: '15px' }} />
            </Grid>
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
                alignItems: 'center',
                backgroundColor: '#131418',
                width: '100%',
                padding: '5px',
                justifyContent: 'center',
                border: '1px solid #f16397',
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'white',
              }}
              onClick={saveSectionsLayout}
            >
              <FaSave style={{ fontSize: '15px' }} />
            </Grid>
          </Grid>
        </Grid>

        {/* Popup de edición */}
        {mostrarditInfoStream && (
          <PopupEditInfo closePopup={toggleEditInfoStream} stream={streamerData} user={userData} />
        )}

        {/* Imagen del chancho centrada */}
        {!Object.values(sections).flat().some(section => section.visible) && (
          <Grid style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <img src={logoPinkker} style={{ width: '50%', padding: '15px' }} />
          </Grid>
        )}
      </Grid>
    </DashboarLayout>
  );
}