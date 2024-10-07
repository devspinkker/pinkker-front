import React, { useState, useEffect } from "react";
import "./Message.css";
import MessageChat from "./chat/MessageChat";
import Loader from "react-loader-spinner";
import { getUserByNameUser } from "../../services/backGo/user";
import {
  GetChatsByUserIDWithStatus,
  CreateChatOrGetChats,
} from "../../services/backGo/Chats";
import PopUpSearch from "./PopUpSearch";
import { TbEdit } from "react-icons/tb";
import { Typography } from "@mui/material";

export default function Message({
  socketMain,
  closeMessageChat,
  messagesOpen1,
}) {
  const [messagesOpen, setMessagesOpen] = useState(messagesOpen1);
  const [Chatrequest, setChatrequest] = useState([]);
  const [Chatsecondary, setChatsecondary] = useState([]);
  const [activeTab, setActiveTab] = useState("primary");

  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [openChatIndex, setOpenChatIndex] = useState(-1); // Índice del chat abierto
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
  let userID = window.localStorage.getItem("_id");
  const handleStatusChange = (newStatus, idChangeStatus) => {
    console.log("El estado del chat ha cambiado a:", newStatus);
    console.log(idChangeStatus);

    setMessagesOpen((prevChats) =>
      prevChats.filter((chat) => chat.chatID !== idChangeStatus)
    );
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSelectedUser(null);
      return;
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      searchUserByName(searchTerm);
    }, 1000);

    setSearchTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  async function searchUserByName(nameUser) {
    setLoading(true);
    try {
      const userData = await getUserByNameUser(nameUser);
      setSelectedUser(userData.data);
    } catch (error) {
      console.error("Error searching user:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCloseChat = () => {
    setMessagesOpen((prevChats) =>
      prevChats.map((chat, index) => ({
        ...chat,
        openedWindow: false,
      }))
    );

    setOpenChatIndex(-1); // Restablecer el índice del chat abierto
    const updatedMessagesOpen = messagesOpen.map((chat) => ({
      ...chat,
      NotifyA: chat.openedWindow ? null : chat.NotifyA,
    }));
    setMessagesOpen(updatedMessagesOpen);
  };

  const handleOpenChat = (index) => {
    const updatedMessagesOpen = messagesOpen.map((chat, i) => ({
      ...chat,
      NotifyA: i === index ? null : chat.NotifyA,
    }));
    setMessagesOpen(updatedMessagesOpen);
  };
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleOpenPopUp = () => {
    setIsPopUpOpen(true);
  };
  const primaryChats = async () => {
    // setMessagesOpen(messagesOpen1);
    if (token && userID) {
      const response = await GetChatsByUserIDWithStatus(token, "primary");
      console.log(response);
      if (response) {
        const updatedMessagesOpen = response.map((chat) => ({
          chatID: chat.ID,
          openedWindow: false,
          user1: chat.User1ID,
          user2: chat.User2ID,
          usersInfo: chat.Users,
          NotifyA: chat.NotifyA,
          StatusUser1: chat.StatusUser1,
          StatusUser2: chat.StatusUser2,
          Blocked: chat.Blocked,
          messages: [],
        }));

        if (!deepEqual(messagesOpen, updatedMessagesOpen)) {
          setChatsecondary(updatedMessagesOpen);
          setMessagesOpen(updatedMessagesOpen);
        }
      } else {
        setMessagesOpen([]);
      }
    }
  };
  let token = window.localStorage.getItem("token");
  const secondaryChats = async () => {
    if (token && userID) {
      const response = await GetChatsByUserIDWithStatus(token, "secondary");
      if (response) {
        const updatedMessagesOpen = response.map((chat) => ({
          chatID: chat.ID,
          openedWindow: false,
          user1: chat.User1ID,
          user2: chat.User2ID,
          usersInfo: chat.Users,
          NotifyA: chat.NotifyA,
          StatusUser1: chat.StatusUser1,
          StatusUser2: chat.StatusUser2,
          Blocked: chat.Blocked,
          messages: [],
        }));
        if (!deepEqual(messagesOpen, updatedMessagesOpen)) {
          setChatsecondary(updatedMessagesOpen);
          setMessagesOpen(updatedMessagesOpen);
        }
      } else {
        setMessagesOpen([]);
      }
    }
  };
  const requestChats = async () => {
    if (token && userID) {
      const response = await GetChatsByUserIDWithStatus(token, "request");
      if (response) {
        const updatedMessagesOpen = response.map((chat) => ({
          chatID: chat.ID,
          openedWindow: false,
          user1: chat.User1ID,
          user2: chat.User2ID,
          usersInfo: chat.Users,
          NotifyA: chat.NotifyA,
          StatusUser1: chat.StatusUser1,
          StatusUser2: chat.StatusUser2,
          Blocked: chat.Blocked,
          messages: [],
        }));
        if (!deepEqual(messagesOpen, updatedMessagesOpen)) {
          setChatrequest(updatedMessagesOpen);
          setMessagesOpen(updatedMessagesOpen);
        } else {
          setChatrequest([]);
          setMessagesOpen([]);
        }
      }
    }
  };
  const handleClosePopUp = () => {
    setIsPopUpOpen(false);
  };

  const handleUserSelect = async (id) => {
    try {
      let token = window.localStorage.getItem("token");

      if (id) {
        const chat = await CreateChatOrGetChats(token, id);
        console.log(chat);

        if (chat) {
          const updatedMessagesOpen = messagesOpen.map((c) => ({
            ...c,
            openedWindow: false,
          }));

          setMessagesOpen([
            {
              chatID: chat.ID,
              openedWindow: true,
              user1: chat.User1ID,
              user2: chat.User2ID,
              usersInfo: chat.Users,
              messages: chat.messages || [],
              NotifyA: chat.NotifyA,
              StatusUser1: chat.StatusUser1,
              StatusUser2: chat.StatusUser2,
            },
            ...updatedMessagesOpen,
          ]);

          setOpenChatIndex(0); // Establecer el índice del chat abierto
        }
      }
    } catch (error) {
      console.error("Error creating/getting chat:", error);
    }
  };
  return (
    <div className="message-body">
      <div className="ContNewChat">
        <div className="message-bodysearch-input">
          <div>
            <TbEdit
              style={{
                color: "white",
                fontSize: "25px",
                cursor: "pointer",
              }}
              onClick={handleOpenPopUp}
            />
            {isPopUpOpen && (
              <PopUpSearch
                onClose={handleClosePopUp}
                handleUserSelect={handleUserSelect}
              />
            )}
          </div>
        </div>
      </div>
      <div className="typesofchats">
        <span
          className={activeTab === "primary" ? "active" : ""}
          onClick={() => {
            setActiveTab("primary");
            primaryChats(); // Ejecuta la función correspondiente
          }}
        >
          Principal
        </span>
        <span
          className={activeTab === "secondary" ? "active" : ""}
          onClick={() => {
            setActiveTab("secondary");
            secondaryChats(); // Ejecuta la función correspondiente
          }}
        >
          General
        </span>
        <span
          className={activeTab === "request" ? "active" : ""}
          onClick={() => {
            setActiveTab("request");
            requestChats(); // Ejecuta la función correspondiente
          }}
        >
          Solicitudes
        </span>

        {/* Línea de navegación animada */}
        <div className={`underline ${activeTab}`}></div>
      </div>

      {messagesOpen.map((chat, index) => {
        const otherUser = chat.usersInfo.find((user) => user.ID !== userID);
        return (
          <div key={index} className="MessageChatContent">
            {otherUser ? (
              <MessageChat
                socketMain={socketMain}
                closeMessageChat={closeMessageChat}
                openedWindow={chat.openedWindow}
                chat={chat}
                index={index}
                chatID={chat.chatID}
                NotifyA={chat.NotifyA}
                to={otherUser}
                handleCloseChat={handleCloseChat}
                handleOpenChat={() => handleOpenChat(index)}
                activeTab={activeTab}
                handleStatusChange={handleStatusChange}
              />
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
}
