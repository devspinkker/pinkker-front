import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { useSelector } from "react-redux";

import Channel from "../components/channel/Channel";

import CustomPlayer from "../components/customPlayer/customPlayer";
import io from "socket.io-client";

const ExternalRouter = () => {
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;

  return (
    <Router>
      <Switch>
        <Route exact path="/:streamer/popout/chat">
          <Channel external={true} expanded={() => console.log(".")} />
        </Route>

        <Route exact path="/:streamer/popout/player">
          <CustomPlayer height={"100%"} width={"100%"} />
        </Route>
      </Switch>
    </Router>
  );
};

export default ExternalRouter;
