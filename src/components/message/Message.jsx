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
  NewChatMessageForChannel,
}) {
  const [messagesOpen, setMessagesOpen] = useState(messagesOpen1);
  const [Chatrequest, setChatrequest] = useState([]);
  const [Chatsecondary, setChatsecondary] = useState([]);
  const [activeTab, setActiveTab] = useState("primary");
  const idUser = window.localStorage.getItem("_id");

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
    setMessagesOpen((prevChats) =>
      prevChats.filter((chat) => chat.chatID !== idChangeStatus)
    );
  };
  useEffect(() => {
    handleNewChatWithMessage();
  }, [NewChatMessageForChannel]);

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
        } else {
          setChatrequest([]);
          setMessagesOpen([]);
        }
      } else {
        setChatrequest([]);
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
        } else {
          setChatrequest([]);
          setMessagesOpen([]);
        }
      } else {
        setChatrequest([]);
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
          return;
        } else {
          setChatrequest([]);
          setMessagesOpen([]);
        }
      } else {
        setChatrequest([]);
        setMessagesOpen([]);
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

        if (chat) {
          const chatExists = messagesOpen.some((c) => c.chatID === chat.ID);

          if (!chatExists) {
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
      } else if (NewChatMessageForChannel) {
        await handleNewChatWithMessage();
      }
    } catch (error) {
      console.error("Error creating/getting chat:", error);
    }
  };

  const handleNewChatWithMessage = async () => {
    console.log("ALGO");

    try {
      let token = window.localStorage.getItem("token");
      if (!token || NewChatMessageForChannel === "") {
        return;
      }

      const chat = await CreateChatOrGetChats(token, NewChatMessageForChannel);

      if (chat) {
        // Identifica al usuario actual
        const currentUserInfo = chat.Users.find((user) => user.ID === idUser);

        // Verifica si existe el usuario actual
        if (!currentUserInfo) {
          console.error("Usuario actual no encontrado en el chat.");
          return;
        }

        // Determina el estado que corresponde al usuario actual
        const currentUserStatus =
          currentUserInfo.ID === chat.User1ID
            ? chat.StatusUser1
            : chat.StatusUser2;

        const chatExists = messagesOpen.some((c) => c.chatID === chat.ID);

        if (!chatExists) {
          // const updatedMessagesOpen = messagesOpen.map((c) => ({
          //   ...c,
          //   openedWindow: false,
          // }));
          // let objInfo = [
          //   {
          //     chatID: chat.ID,
          //     openedWindow: false,
          //     user1: chat.User1ID,
          //     user2: chat.User2ID,
          //     usersInfo: chat.Users,
          //     messages: chat.messages || [],
          //     NotifyA: chat.NotifyA,
          //     StatusUser1: chat.StatusUser1,
          //     StatusUser2: chat.StatusUser2,
          //   },
          //   ...updatedMessagesOpen,
          // ];
          // console.log(currentUserStatus);

          // setMessagesOpen(objInfo);
          console.log(currentUserStatus);
          console.log("currentUserStatus");

          if (currentUserStatus == "primary") {
            primaryChats();
          } else if (currentUserStatus == "secondary") {
            secondaryChats();
          } else {
            requestChats();
          }
          setActiveTab(currentUserStatus);

          setOpenChatIndex(0); // Establecer el índice del chat abierto
        }
      }
    } catch (error) {
      console.error(
        "Error handling chat with NewChatMessageForChannel:",
        error
      );
    }
  };
console.log('activeTab', activeTab)
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
          style={{backgroundColor: activeTab === 'primary' ? '#ff86e4' : '#ebebec', borderRadius: '5px' ,padding: '15px 30px', color:  activeTab === 'primary' ? 'white': 'black', width: '30%', textAlign: 'center', fontSize: '16px'}}


          onClick={() => {
            setActiveTab("primary");
            primaryChats(); // Ejecuta la función correspondiente
          }}
        >
          Principal
        </span>

        <span
          className={activeTab === "secondary" ? "active" : ""}
          style={{backgroundColor: activeTab === 'secondary' ? '#ff86e4' : '#ebebec', borderRadius: '5px', padding: '15px 30px', color:  activeTab === 'secondary' ? 'white': 'black' , width: '30%', textAlign: 'center', fontSize: '16px'}}


          onClick={() => {
            setActiveTab("secondary");
            secondaryChats(); // Ejecuta la función correspondiente
          }}
        >
          General
        </span>
        
        <span
          className={activeTab === "request" ? "active" : ""}
          style={{backgroundColor: activeTab === 'request' ? '#ff86e4' : '#ebebec', borderRadius: '5px',padding: '15px 30px', color:  activeTab === 'request' ? 'white': 'black' , width: '30%', textAlign: 'center', fontSize: '16px'}}

          onClick={() => {
            setActiveTab("request");
            requestChats(); // Ejecuta la función correspondiente
          }}
        >
          Solicitudes
        </span>

        {/* Línea de navegación animada */}
        {/* <div className={`underline ${activeTab}`}></div> */}
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
