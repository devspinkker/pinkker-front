import React, { useState, useEffect } from "react";
import "./Message.css";
import MessageChat from "./chat/MessageChat";
import Loader from "react-loader-spinner";
import { getUserByNameUser } from "../../services/backGo/user";
import {
  getChatsByUserID,
  CreateChatOrGetChats,
} from "../../services/backGo/Chats";
import PopUpSearch from "./PopUpSearch";
import { TbEdit } from "react-icons/tb";

export default function Message({
  socketMain,
  closeMessageChat,
  messagesOpen1,
}) {
  const [messagesOpen, setMessagesOpen] = useState(messagesOpen1);
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

  const handleAddChat = async () => {
    try {
      let token = window.localStorage.getItem("token");

      if (selectedUser) {
        const chat = await CreateChatOrGetChats(token, selectedUser.id);
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
      {messagesOpen.map((chat, index) => {
        const otherUser = chat.usersInfo.find((user) => user.ID !== userID);

        return (
          <div key={index} className="MessageChatContent">
            {otherUser ? (
              <MessageChat
                socketMain={socketMain}
                closeMessageChat={closeMessageChat}
                openedWindow={chat.openedWindow}
                index={index}
                chatID={chat.chatID}
                NotifyA={chat.NotifyA}
                to={otherUser}
                usersInfo={chat.usersInfo}
                messages={chat.messages}
                handleCloseChat={handleCloseChat}
                handleOpenChat={() => handleOpenChat(index)}
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
