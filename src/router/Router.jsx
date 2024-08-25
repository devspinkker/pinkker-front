import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { useSelector } from "react-redux";
import OAuth2Login from "../components/OAuth2/OAuth2Login";
import OAuth2callback from "../components/OAuth2/OAuth2callback";
import NavbarLeft from "../components/navbarLeft/NavbarLeft";
import Layout from "../components/layout/Layout";
import Navbar from "../components/navbar/Navbar";
import NavbarButtom from "../components/navbarBottom/navbarButtom";
import Home from "../components/home/Home";
import Activate from "../components/activate/Activate";
import Channel from "../components/channel/Channel";
import Dashboard from "../components/dashboard/Dashboard";
import SettingsStream from "../components/dashboard/settings/stream/SettingsStream";
import StreamManager from "../components/dashboard/stream-manager/StreamManager";
import Disconnected from "../components/channel/Disconnected";
import Tendency from "../components/tendency/Tendency";
import TendencyMuro from "../components/muro/TendencyLayout";

import UserSettings from "../components/settings/user/UserSettings";
import Explore from "../components/explore/Explore";
import Vod from "../components/vod/Vod";
import Categorie from "../components/categories/Categorie";
import { CreateClip } from "../components/clips/create/ClipCreate";
import { GetClip } from "../components/clips/getClipId/GetClip";
import ClipView from "../components/clips/view/ClipView";
import { LastLocationProvider } from "react-router-last-location";

import Message from "../components/message/Message";
import GeneralChat from "../components/message/general/GeneralChat";
import Content from "../components/dashboard/content/Content";
import Community from "../components/dashboard/community/Community";

import Admin from "../components/admin/Admin";
import Muro from "../components/muro/Muro";
import ClipsMain from "../components/clips/main/ClipsMain";
import Search from "../components/search/Search";
import Analytics from "../components/dashboard/analytics/Analytics";
import Cartera from "../components/cartera/Cartera";
import Suscriptions from "../components/suscriptions/Suscriptions";
import Achievement from "../components/achievement/Achievement";
import Pagos from "../components/admin/pagos/Pagos";
import Statistics from "../components/admin/statistics/Statistics";
import Terms from "../components/pinkker/terms/Terms";
import Privacy from "../components/pinkker/privacity/Privacity";
import ResetPassword from "../components/auth/ResetPassword";
import { getUserByIdTheToken } from "../services/backGo/user";
import RecoverPassword from "../components/userRecuperacion/PasswordReset";
import DashboardStream from "../components/dashboard/stream-manager/DashboardStream";
import DashboardAjustes from "../components/dashboard/stream-manager/DeshboardAjustes";
import DashboardServerTransmision from "../components/dashboard/stream-manager/DashboardServerTransmision";
import NLayout from "../components/layout/NLayout";
import ViewTweet from "../components/muro/popup/ViewTweet";
import HashtagPost from "../components/muro/HashtagPost";
import NAnalytics from "../components/dashboard/analytics/NAnalytics";
import Main from "../components/panelAdminPinkker/Main";
import AuthContext from "../components/AuthContext";
import ChannelVods from "../components/channel/ChannelVods";
import StreamSummaryAnalytics from "../components/dashboard/analytics/StreamSummaryAnalytics";

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  const [expanded, setExpanded] = useState(true);
  const [expandedLeft, setexpandedLeft] = useState(false);

  const [socketMain, setSocketMain] = useState(null);
  // const [user, setUser] = useState();

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    if (user?.name != null && user?.name != undefined) {
      loadDataOnlyOnce();
    }
  }, [user]);

  const loadDataOnlyOnce = () => {
    const name = user?.name;

    if (name != undefined && name != null) {
      socketMain.emit(
        "join",
        { _id: user._id, name, room: "general" },
        (socketMain) => {
          console.log("[PINKKER] [CHAT MESSAGE] Joined " + socketMain);
        }
      );
    }
  };

  useEffect(() => {
    if (socketMain != null) {
      socketMain.on("newMessage", (name) => {
        addOpenMessage(name, true);
        let audio = new Audio("/noti.mp3");
        audio.play();
      });
    }
  }, [socketMain]);

  // useEffect(() => {
  //   async function getUser() {
  //     let token = window.localStorage.getItem("token");
  //     let res = await getUserByIdTheToken(token);
  //     if (res.message == "ok") {
  //       setUser(res.data);
  //     }
  //   }
  //   getUser();
  // }, []);

  const [openMessage, setOpenMessage] = useState(false);
  const [openMessageStreamer, setOpenMessageStreamer] = useState(null);

  const [messagesOpen, setMessagesOpen] = useState([]);

  function addOpenMessage(streamer, openedWindow) {
    if (!messagesOpen.filter((e) => e.streamer === streamer).length > 0) {
      if (messagesOpen.length <= 5) {
        setMessagesOpen([...messagesOpen, { streamer, openedWindow }]);
        setOpenMessage(true);
        setOpenMessageStreamer(streamer);
      }
    }
  }

  function removeOpenMessage(streamer) {
    setMessagesOpen(
      messagesOpen.filter((message) => message.streamer !== streamer)
    );
    if (messagesOpen.length === 0) {
      setOpenMessage(false);
      setOpenMessageStreamer(null);
    }
  }
  return (
    <Router>
      <LastLocationProvider>
        {/* {isMobile &&
          <Navbar
            isMobile={isMobile}
            exact
            socketMain={socketMain}
            handleMessage={(e) => addOpenMessage(e, false)}
            expanded={expanded}
            tyExpanded={() => toggleExpanded()}
            user={user}
          />} */}
        {/* {openMessage && (
          <Message
            socketMain={socketMain}
            closeMessageChat={(e) => removeOpenMessage(e)}
            messagesOpen={messagesOpen}
          />
        )} */}
        {/*!isLogged && <NavbarButtom isMobile={isMobile}/>*/}

        <Route exact path="/:streamer/dashboard/stream">
          {/* <NavbarLeft
            isMobile={isMobile}
            tyExpanded={expanded}
            user={user}
            tyDashboard={true}
            setExpanded={setExpanded}
          ></NavbarLeft> */}
          <DashboardStream
            tyExpanded={expanded}
            isMobile={isMobile}
            user={user}
          />
        </Route>

        <Route exact path="/:streamer/dashboard/Configuración">
          <NavbarLeft
            isMobile={isMobile}
            tyExpanded={expanded}
            user={user}
            tyDashboard={true}
            setExpanded={setExpanded}
          ></NavbarLeft>
          <DashboardAjustes
            user={user}
            tyExpanded={expanded}
            isMobile={isMobile}
          />
        </Route>
        <Route exact path="/:streamer/dashboard/Clave">
          <NavbarLeft
            isMobile={isMobile}
            tyExpanded={expanded}
            user={user}
            tyDashboard={true}
            setExpanded={setExpanded}
          ></NavbarLeft>
          <DashboardServerTransmision
            tyExpanded={expanded}
            isMobile={isMobile}
            user={user}
          />
        </Route>
        <Route exact path="/:streamer/dashboard/home">
          <NavbarLeft
            isMobile={isMobile}
            tyExpanded={expanded}
            user={user}
            tyDashboard={true}
            setExpanded={setExpanded}
          ></NavbarLeft>
          <Dashboard isMobile={isMobile} />
        </Route>
        <Route exact path="/:streamer/dashboard/analytics">
          {/* <NavbarLeft
            isMobile={isMobile}
            tyExpanded={expanded}
            user={user}
            tyDashboard={true}
            setExpanded={setExpanded}
          ></NavbarLeft> */}
          {/* <NAnalytics user={user} /> */}
          <StreamSummaryAnalytics
            user={user}
            tyExpanded={expanded}
            isMobile={isMobile}
          />
        </Route>
        <Route exact path="/:streamer/dashboard/community">
          <NavbarLeft
            isMobile={isMobile}
            tyExpanded={expanded}
            user={user}
            tyDashboard={true}
            setExpanded={setExpanded}
          ></NavbarLeft>
          <Community />
        </Route>

        <NLayout
          isMobile={isMobile}
          user={user}
          tyDashboard={
            window.location.pathname.includes("/dashboard") ? true : false
          }
          tyExpanded={expanded}
          setExpanded={setExpanded}
          txExpandedLeft={expandedLeft}
          setExpandedLeft={setexpandedLeft}
        >
          <Switch>
            <Route exact path="/panel/PaneldminPinkker">
              <Main />
            </Route>

            <Route exact path="/:streamer/dashboard/streammanager">
              <StreamManager
                isMobile={isMobile}
                socketMain={socketMain}
                handleMessage={(e) => addOpenMessage(e)}
              />
            </Route>

            <Route exact path="/:streamer/dashboard/content">
              <Content />
            </Route>

            <Route exact path="/:streamer/settings">
              <UserSettings user={user} isMobile={isMobile} />
            </Route>

            <Route
              path="/user/activate/:activation_token"
              component={Activate}
              exact
            />

            <Route exact path="/plataform/tendency">
              <Tendency isMobile={isMobile} />
            </Route>

            <Route exact path="/admin/general">
              <Admin />
            </Route>

            <Route exact path="/admin/pagos">
              <Pagos />
            </Route>

            <Route exact path="/admin/statistics">
              <Statistics />
            </Route>

            <Route exact path="/user/reset/:token">
              <ResetPassword isMobile={isMobile} />
            </Route>

            <Route exact path="/plataform/explore">
              <Explore isMobile={isMobile} tyExpanded={!expanded} />
            </Route>

            <Route exact path="/plataform/cartera">
              <Cartera user={user} />
            </Route>

            <Route exact path="/plataform/subscriptions">
              <Suscriptions />
            </Route>

            <Route exact path="/plataform/achievement">
              <Achievement />
            </Route>

            <Route exact path="/plataform/clips/:clipId?">
              <ClipsMain
                tyExpanded={expanded}
                expandedLeft={expandedLeft}
                isMobile={isMobile}
              />
            </Route>

            <Route exact path="/plataform/muro">
              <Muro isMobile={isMobile} userName={user} />
            </Route>
            <Route exact path="/post/:User/:IdPost">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  padding: !isMobile && "22px",
                }}
              >
                {!isMobile && <TendencyMuro />}
                <ViewTweet isMobile={isMobile} />
              </div>
            </Route>
            <Route path="/hashtag/:hashtag">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  width: "72%",
                  padding: "22px",
                  justifyContent: "flex-end",
                }}
              >
                <TendencyMuro />
                <HashtagPost />
              </div>
            </Route>
            <Route exact path="/vod/:vodId">
              <Vod />
            </Route>

            <Route path="/categorie/:categorieName" exact>
              <Categorie />
            </Route>
            <Route path="/user/password-reset">
              <RecoverPassword />
            </Route>
            <Route path="/clip/:clipId" exact>
              <ClipView />
            </Route>

            <Route exact path="/">
              <Home
                isMobile={isMobile}
                socketMain={socketMain}
                handleMessage={(e) => addOpenMessage(e)}
                cancelExpand={(e) => setExpanded(e)}
                expanded={expanded}
                expandedLeft={expandedLeft}
              />
            </Route>
            <Route
              exact
              path="/plataform/OAuth2callback"
              component={OAuth2callback}
            >
              <OAuth2callback />
            </Route>

            <Route exact path={"/direct/inbox"}>
              <GeneralChat />
            </Route>

            <Route exact path={"/plataform/search"}>
              <Search />
            </Route>

            <Route exact path="/plataform/terms">
              <Terms />
            </Route>

            <Route exact path="/plataform/privacy">
              <Privacy />
            </Route>
            <Route exact path="/OAuth2Login">
              <OAuth2Login />
            </Route>

            <Route exact path="/:streamer">
              <Channel
                isMobile={isMobile}
                socketMain={socketMain}
                handleMessage={(e) => addOpenMessage(e)}
                expanded={expanded}
                tyExpanded={expanded}
              />
            </Route>

            <Route exact path="/clips/create">
              <CreateClip />
            </Route>
            <Route exact path="/clips/getId">
              <GetClip />
            </Route>
            <Route exact path="/:streamer/:idVod">
              <ChannelVods
                isMobile={isMobile}
                socketMain={socketMain}
                handleMessage={(e) => addOpenMessage(e)}
                expanded={expanded}
                tyExpanded={expanded}
              />
            </Route>
          </Switch>
        </NLayout>
      </LastLocationProvider>
    </Router>
  );
};

export default AppRouter;
