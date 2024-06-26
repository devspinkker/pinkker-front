import React, { useState, useEffect } from "react";
import "./Message.css";
import MessageChat from "./chat/MessageChat";
import Loader from "react-loader-spinner";
import { getUserByNameUser } from "../../services/backGo/user";
import {
  getChatsByUserID,
  getMessages,
  CreateChatOrGetChats,
} from "../../services/backGo/Chats";

export default function Message({ socketMain, closeMessageChat }) {
  const [messagesOpen, setMessagesOpen] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [openChatIndex, setOpenChatIndex] = useState(-1); // Índice del chat abierto

  useEffect(() => {
    let token = window.localStorage.getItem("token");
    let userID = window.localStorage.getItem("_id");
    setUserID(userID);

    const fetchData = async () => {
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
          setMessagesOpen(updatedMessagesOpen);

          for (let chat of updatedMessagesOpen) {
            const messages = await getMessages(
              token,
              chat.user1 === userID ? chat.user2 : chat.user1
            );
            chat.messages = messages || [];
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="message-body">
      <div className="ContNewChat">
        <div className="message-bodysearch-input">
          <input
            type="text"
            placeholder="Buscar usuario"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          {loading && (
            <Loader
              type="TailSpin"
              color="#ff60b2"
              height={20}
              width={20}
              className="loader"
            />
          )}
          {selectedUser && (
            <div className="user-info">
              <p>{selectedUser.FullName}</p>
              <button className="open-chat-button" onClick={handleAddChat}>
                Chat with {selectedUser.NameUser}
              </button>
            </div>
          )}
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
