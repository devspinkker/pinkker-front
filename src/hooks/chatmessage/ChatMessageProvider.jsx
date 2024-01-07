import { useState, useEffect } from "react";
import { createContext } from "react";

import io from "socket.io-client";

import { useSelector } from "react-redux";

export const ChatMessageContext = createContext();

export default function ChatMessageProvider({ children }) {
  const ENDPOINT = process.env.REACT_APP_DEV_CHATMESSAGE_URL;

  let socket = io(ENDPOINT);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (user.name != null && user.name != undefined) {
      loadDataOnlyOnce();
    }
  }, [user]);

  const loadDataOnlyOnce = () => {
    const name = user.name;

    if (name != undefined && name != null) {
      socket.emit(
        "join",
        { _id: user._id, name, room: "general" },
        (socket) => {
          console.log("[PINKKER] [CHAT MESSAGE] Joined " + socket);
        }
      );
    }
  };

  useEffect(() => {
    socket.on("chatmessage", () => {
      console.log("[PINKKER] [CHAT MESSAGE] Chat message received 2");
    });
  }, []);

  const contextValue = {
    socket,
  };

  return (
    <ChatMessageContext.Provider value={socket}>
      {children}
    </ChatMessageContext.Provider>
  );
}
