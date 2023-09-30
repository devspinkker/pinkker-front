import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";

import { useSelector } from "react-redux";

import Layout from "../components/layout/Layout";
import Navbar from "../components/navbar/Navbar";
import NavbarLeft from "../components/navbarLeft/NavbarLeft";
import NavbarButtom from "../components/navbarBottom/navbarButtom";
import Home from "../components/home/Home";
import Activate from "../components/activate/Activate";
import Channel from "../components/channel/Channel";
import Dashboard from "../components/dashboard/Dashboard";
import SettingsStream from "../components/dashboard/settings/stream/SettingsStream";
import StreamManager from "../components/dashboard/stream-manager/StreamManager";
import Disconnected from "../components/channel/Disconnected";
import Tendency from "../components/tendency/Tendency";
import UserSettings from "../components/settings/user/UserSettings";
import Explore from "../components/explore/Explore";
import Vod from "../components/vod/Vod";
import Categorie from "../components/categories/Categorie";
import ClipCreate from "../components/clips/create/ClipCreate";
import ClipView from "../components/clips/view/ClipView";
import { LastLocationProvider } from 'react-router-last-location';

import Message from "../components/message/Message";
import GeneralChat from "../components/message/general/GeneralChat";
import Content from "../components/dashboard/content/Content";
import Community from "../components/dashboard/community/Community";

import { io } from "socket.io-client";
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


const AppRouter = () => {

    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const { user, isLogged } = auth;

    const [expanded, setExpanded] = useState(true);
    const [socketMain, setSocketMain] = useState(null);

    function toggleExpanded() {
        setExpanded(!expanded)
    }

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);


    const isMobile = width <= 768;



    useEffect(() => {
        setSocketMain(io(process.env.REACT_APP_DEV_CHATMESSAGE_URL));

    }, []);

    useEffect(() => {
        if (user.name != null && user.name != undefined) {
            loadDataOnlyOnce()
        }
    }, [user]);


    const loadDataOnlyOnce = () => {
        const name = user.name;

        if (name != undefined && name != null) {
            console.log("[PINKKER] [CHAT MESSAGE] User name: " + user.name);
            socketMain.emit("join", { _id: user._id, name, room: "general" }, (socketMain) => {
                console.log("[PINKKER] [CHAT MESSAGE] Joined " + socketMain);
            });
        }
    };

    useEffect(() => {
        if (socketMain != null) {
            socketMain.on("newMessage", (name) => {
                addOpenMessage(name, true)
                console.log("Nuevo mensaje de " + name)
                let audio = new Audio("/noti.mp3")
                audio.play()
            });
        }
    }, [socketMain]);


    const [openMessage, setOpenMessage] = useState(false);
    const [openMessageStreamer, setOpenMessageStreamer] = useState(null);

    const [messagesOpen, setMessagesOpen] = useState([]);

    function addOpenMessage(streamer, openedWindow) {
        if (!messagesOpen.filter(e => e.streamer === streamer).length > 0) {
            if (messagesOpen.length <= 5) {
                setMessagesOpen([...messagesOpen, { streamer, openedWindow }]);
                setOpenMessage(true)
                setOpenMessageStreamer(streamer)
            }
        }
    }


    function removeOpenMessage(streamer) {
        setMessagesOpen(messagesOpen.filter(message => message.streamer !== streamer))
        if (messagesOpen.length === 0) {
            setOpenMessage(false)
            setOpenMessageStreamer(null)
        }
    }

    return (
        <Router>
            <LastLocationProvider>
                <Navbar  isMobile={isMobile} exact socketMain={socketMain} handleMessage={(e) => addOpenMessage(e, false)} expanded={expanded} tyExpanded={() => toggleExpanded()} />
                {openMessage && <Message socketMain={socketMain} closeMessageChat={(e) => removeOpenMessage(e)} messagesOpen={messagesOpen} />}
                {/*!isLogged && <NavbarButtom isMobile={isMobile}/>*/}
                <Layout isMobile={isMobile} tyExpanded={expanded}>
                    <Switch>


                        <Route exact path="/:streamer/dashboard/home">
                            <NavbarLeft setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={true} />
                            <Dashboard isMobile={isMobile} />
                        </Route>

                        <Route exact path="/:streamer/dashboard/analytics">
                            <NavbarLeft setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={true} />
                            <Analytics />
                        </Route>

                        <Route exact path="/:streamer/dashboard/streammanager">
                            <NavbarLeft isMobile={isMobile} setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={true} />
                            <StreamManager isMobile={isMobile} socketMain={socketMain} handleMessage={(e) => addOpenMessage(e)} />
                        </Route>

                        <Route exact path="/:streamer/dashboard/settings/stream">
                            <NavbarLeft setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={true} />
                            <SettingsStream />
                        </Route>

                        <Route exact path="/:streamer/dashboard/content">
                            <NavbarLeft setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={true} />
                            <Content />
                        </Route>

                        <Route exact path="/:streamer/dashboard/community">
                            <NavbarLeft setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={true} />
                            <Community />
                        </Route>

                        <Route exact path="/:streamer">
                            {!isMobile && <NavbarLeft setExpanded={setExpanded} tyExpanded={expanded} tyDashboard={false} />}
                            <Channel isMobile={isMobile} socketMain={socketMain} handleMessage={(e) => addOpenMessage(e)} expanded={() => setExpanded(false)} tyExpanded={expanded} />
                        </Route>

                        <Route exact path="/:streamer/settings">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <UserSettings isMobile={isMobile} />
                        </Route>

                        <Route path="/user/activate/:activation_token" component={Activate} exact />

                        <Route exact path="/plataform/tendency">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Tendency />
                        </Route>

                        <Route exact path="/admin/general">
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <Admin />
                        </Route>

                        <Route exact path="/admin/pagos">
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <Pagos />
                        </Route>

                        <Route exact path="/admin/statistics">
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <Statistics />
                        </Route>

                        <Route exact path="/user/reset/:token">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <ResetPassword isMobile={isMobile} />
                        </Route>

                        <Route exact path="/plataform/explore">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Explore isMobile={isMobile} />
                        </Route>

                        <Route exact path="/plataform/cartera">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Cartera />
                        </Route>

                        <Route exact path="/plataform/subscriptions">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Suscriptions />
                        </Route>

                        <Route exact path="/plataform/achievement">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Achievement />
                        </Route>

                        <Route exact path="/plataform/clips">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <ClipsMain />
                        </Route>

                        <Route exact path="/plataform/muro">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Muro isMobile={isMobile} />
                        </Route>

                        <Route exact path="/vod/:vodId">
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <Vod />
                        </Route>

                        <Route path="/categorie/:categorieName" exact>
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Categorie />
                        </Route>

                        <Route path="/clip/:clipId" exact>
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <ClipView />
                        </Route>

                        <Route exact path="/" component={Home}>
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Home isMobile={isMobile} socketMain={socketMain} handleMessage={(e) => addOpenMessage(e)} cancelExpand={(e) => setExpanded(e)} socketMain={socketMain} expanded={expanded} />
                        </Route>

                        <Route exact path={"/direct/inbox"}>
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <GeneralChat />
                        </Route>

                        <Route exact path={"/plataform/search"}>

                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Search />
                        </Route>

                        <Route exact path="/plataform/terms">
                            <NavbarLeft isMobile={isMobile} tyExpanded={expanded} tyDashboard={false} />
                            <Terms />
                        </Route>

                        <Route exact path="/plataform/privacy">
                            <NavbarLeft tyExpanded={expanded} tyDashboard={false} />
                            <Privacy />
                        </Route>


                    </Switch>
                </Layout>
            </LastLocationProvider>

        </Router>
    )
}

export default AppRouter;
