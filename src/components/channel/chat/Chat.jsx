import React, { useState, useEffect } from "react";

import Messages from "./Messages";
import { useSelector } from "react-redux";
import Input from "./Input";

import "./Chat.css";

import { useParams } from "react-router-dom";
import Confetti from "react-confetti";

import {
  getChatRoom,
  addModToChat,
  removeModToChat,
  addVipToChat,
  removeVipToChat,
  setSlow,
  addBanToChat,
  removeBanToChat,
  enableUniqueChat,
  disableUniqueChat,
  enableEmotes,
  disableEmotes,
  enableSuscriber,
  disableSuscriber,
  enableFollowers,
  disableFollowers,
  sendRequestMessage,
} from "../../../services/chat";

import AccordionList from "./accordion/AccordionList";

import { updateColor } from "../../../services/user";

import DonationCard from "./donation/card/DonationCard";

import { getStreamerDonationPixel } from "../../../services/donationPixel";

import Donation from "./donation/card/Donation";

import { getAllEmotes } from "../../../services/emotes";

import Tippy from "@tippyjs/react";
import { getStreamerDonationSubscription } from "../../../services/donationSubscription";

import { ScaleLoader } from "react-spinners";
import { addHistoryAnnounce } from "../../../services/history";

import { useNotification } from "../../Notifications/NotificationProvider";

import PredictPopup from "./popup/PredictPopup";

import BetTop from "./bet/BetTop";

import { getBetsStreamer } from "../../../services/bet";
import BetTopWin from "./bet/BetTopWin";

const Chat = ({
  external,
  socket,
  socketMain,
  chatExpanded,
  announce,
  handleAnnounce,
  callback,
  handleSendMessage,
  setUserSuscripted,
  setSuscribers,
  isMobile,
}) => {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [chatData, setChatData] = useState(null);

  const [chatConnected, setChatConnected] = useState(false);

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [type, setType] = useState(0);
  const [typeDonation, setTypeDonation] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);

  let messageData = [];
  var messageDataHistory = [];

  const [hoverUser, setHoverUser] = useState(null);

  const alert = useNotification();

  let [users, setUsers] = useState([]);
  let [mods, setMods] = useState([]);
  let [vips, setVips] = useState([]);

  const [reply, setReply] = useState(null);

  const [userMod, setUserMod] = useState(false);
  const [userVip, setUserVip] = useState(false);
  const [userBan, setUserBan] = useState(false);

  const [uniqueChat, setUniqueChat] = useState(true);
  const [onlyEmotes, setOnlyEmotes] = useState(false);
  const [onlySuscriber, setOnlySuscriber] = useState(false);
  const [onlyFollowers, setOnlyFollowers] = useState(false);

  const ENDPOINT = process.env.REACT_APP_DEV_CHAT_URL;

  const { streamer } = useParams();

  const chatTextSize = localStorage.getItem("chatTextSize");

  const [textSize, setTextSize] = useState(
    chatTextSize === null ? 1 : parseInt(chatTextSize)
  );

  const [connected, setConnected] = useState(false);

  const [donationCard, setDonationCard] = useState(false);

  const [donationAmount, setDonationAmount] = useState(0);
  const [donationName, setDonationName] = useState(null);
  const [donationAvatar, setDonationAvatar] = useState(null);
  const [donationText, setDonationText] = useState(null);
  const [donationLook, setDonationLook] = useState(null);
  const [donationColor, setDonationColor] = useState(null);

  const [donations, setDonations] = useState(null);
  const [donationsSubscriptions, setDonationsSubscriptions] = useState(null);

  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const [chatOff, setChatOff] = useState(false);

  const [emotes, setEmotes] = useState(null);

  const [predictPopup, setPredictPopup] = useState(false);

  const [betTopOpen, setBetTopOpen] = useState(false);
  const [dropdownBet, setDropdownBet] = useState(false);

  const [bets, setBets] = useState(null);
  const [betRanking, setBetRanking] = useState(null);

  const [betWon, setBetWon] = useState(false);
  const [betWonAmount, setBetWonAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChatRoom(streamer);
      if (data != null && data != undefined) {
        if (data.mods.includes(user._id)) {
          setUserMod(true);
        }

        if (data.vips.includes(user._id)) {
          setUserVip(true);
        }

        if (data.banned.filter((e) => e._id === user._id).length > 0) {
          setUserBan(true);
        }

        if (data.suscribers.filter((e) => e._id === user._id).length > 0) {
          setUserSuscripted(true);
        }

        setSuscribers(data.suscribers);
        setUniqueChat(data.uniqueChat);
        setOnlyEmotes(data.onlyEmotes);
        setOnlySuscriber(data.onlySuscriber);
        setOnlyFollowers(data.onlyFollowers);

        setChatData(data);
      }

      const dataBets = await getBetsStreamer(token, streamer);
      if (dataBets != null && dataBets != undefined) {
        if (
          dataBets.data.bet._id != null &&
          dataBets.data.bet._id != undefined
        ) {
          setBetTopOpen(true);
          setBets(dataBets.data.bet);
          setBetRanking(dataBets.data.ranking);
        }
      }

      const dataEmotes = await getAllEmotes(token);
      if (dataEmotes != null && dataEmotes != undefined) {
        setEmotes(dataEmotes);
      }

      const dataDonationsSubscriptions = await getStreamerDonationSubscription(
        streamer,
        page
      );
      if (
        dataDonationsSubscriptions != null &&
        dataDonationsSubscriptions != undefined
      ) {
        setDonationsSubscriptions(dataDonationsSubscriptions.donations);
      }

      const dataDonation = await getStreamerDonationPixel(streamer, page);
      if (dataDonation != null && dataDonation != undefined) {
        //Paginate the data with limit and page
        setPage(page + 1);
        const data = dataDonation.donations.slice(page * 3, (page + 1) * 3);

        setMaxPage(Math.ceil(dataDonation.donations.length / 3));

        setDonations(data);
      }

      setInterval(async () => {
        const dataDonation = await getStreamerDonationPixel(streamer, page);
        if (dataDonation != null && dataDonation != undefined) {
          setDonations(dataDonation.donations);
        }

        const dataDonationsSubscriptions =
          await getStreamerDonationSubscription(streamer, page);
        if (
          dataDonationsSubscriptions != null &&
          dataDonationsSubscriptions != undefined
        ) {
          setDonationsSubscriptions(dataDonationsSubscriptions.donations);
        }
      }, 5000);
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    loadDataOnlyOnce();
  }, [token, socket]);

  const loadDataOnlyOnce = () => {
    const name = user.name;
    const room = streamer;

    setName(name);
    setRoom(room);

    // if (socket != null && socket != undefined) {
    //   if (user != null && user != undefined && user != []) {
    //     socket.emit(
    //       "join",
    //       {
    //         _id: user._id,
    //         name,
    //         room,
    //         color: user.color,
    //         lookImage: user.lookImage,
    //         birthDate: user.birthDate,
    //         pinkkerPrime: user.pinkkerPrime?.active,
    //       },
    //       () => {
    //         setMessages([
    //           {
    //             user: "System",
    //             text: "Te damos la bienvenida a la sala de chat.",
    //           },
    //         ]);
    //         messageData = [
    //           {
    //             user: "System",
    //             text: "Te damos la bienvenida a la sala de chat.",
    //           },
    //         ];
    //         setChatConnected(true);
    //       }
    //     );
    //   }
    // }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      if (messageData.length > 75) {
        messageData.shift();
        messageData = [...messageData, message];
        messageDataHistory = [...messageDataHistory, message];
      } else {
        messageData = [...messageData, message];
        messageDataHistory = [...messageDataHistory, message];
      }

      setMessages(messageData);

      scrollLastElement();
    });
  }, []);

  function reloadChatData() {
    const fetchData = async () => {
      const data = await getChatRoom(streamer);
      if (data != null && data != undefined) {
        if (data.mods.includes(user._id)) {
          setUserMod(true);
        } else {
          setUserMod(false);
        }

        if (data.vips.includes(user._id)) {
          setUserVip(true);
        } else {
          setUserVip(false);
        }

        if (data.banned.filter((e) => e._id === user._id).length > 0) {
          setUserBan(true);
        } else {
          setUserBan(false);
        }

        setUniqueChat(data.uniqueChat);
        setOnlyEmotes(data.onlyEmotes);
        setOnlySuscriber(data.onlySuscriber);
        setOnlyFollowers(data.onlyFollowers);

        setChatData(data);
      }
    };
    fetchData();
  }

  function toggleDonationCard(amount, name, avatar, text, look, color) {
    setDonationCard(true);
    setDonationAmount(amount);
    setDonationName(name);
    setDonationAvatar(avatar);
    setDonationText(text);
    setDonationLook(look);
    setDonationColor(color);
  }

  useEffect(() => {
    if (chatData != null) {
      socket.on("roomData", (user) => {
        users = [];
        mods = [];
        vips = [];
        //
        user.users.forEach((el) => {
          if (chatData.mods.includes(el._id)) {
            mods.push(el);
          } else if (chatData.vips.includes(el._id)) {
            vips.push(el);
          } else {
            users.push(el);
          }
        });

        setMods(mods);
        setVips(vips);
        setUsers(users);
      });
    }
  }, [chatData]);

  useEffect(() => {
    socket.on("onClearChat", (user) => {
      setMessages([
        { user: "System", text: user + " ha despejado el chat de esta sala" },
      ]);
      messageData = [
        { user: "System", text: user + " ha despejado el chat de esta sala" },
      ];
    });

    socket.on("host", (streamer) => {
      window.location.href = "/" + streamer;
    });

    socket.on("reload", (streamer) => {
      reloadChatData();
    });

    socket.on("reloadBet", (streamer) => {
      reloadBets();
    });

    socket.on("onAnnouncement", () => {
      handleAnnounce();
    });
  }, []);

  async function reloadBets() {
    const dataBets = await getBetsStreamer(token, streamer);
    if (dataBets != null && dataBets != undefined) {
      if (dataBets.data.bet._id != null && dataBets.data.bet._id != undefined) {
        setBetTopOpen(true);
        setBets(dataBets.data.bet);
        setBetRanking(dataBets.data.ranking);
      }
    }
  }

  function scrollLastElement() {
    var elem = document.getElementById("chat-message-data");
    elem.scrollTop = elem.scrollHeight - 50;
  }

  function getColorByName(name) {
    if (name === "red") {
      return "#FF0000";
    }

    if (name === "green") {
      return "#00FF00";
    }

    if (name === "blue") {
      return "#0000FF";
    }
  }

  const sendMessage = async () => {
    if (message.startsWith("/")) {
      const command = message.substr(1);
      const args = command.split(" ");
      const commandName = args[0];
      const commandArgs = args;

      if (commandName === "clear") {
        socket.emit("clearChat", () => setMessage(""));
        return;
      }

      if (commandName === "mod") {
        if (commandArgs.length === 2) {
          await addModToChat(token, commandArgs[1], streamer);
          setMessage("");
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " es mod de la sala"
          );
          socket.emit("sendReload", () => setMessage(""));
          return;
        }
      }

      if (commandName === "unmod") {
        if (commandArgs.length === 2) {
          await removeModToChat(token, commandArgs[1], streamer);
          setMessage("");
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " no es mod de la sala"
          );
          socket.emit("sendReload", () => setMessage(""));
          return;
        }
      }

      if (commandName === "vip") {
        if (commandArgs.length === 2) {
          await addVipToChat(token, commandArgs[1], streamer);
          setMessage("");
          socket.emit("sendReload", () => setMessage(""));
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " es vip de la sala"
          );
        }
        return;
      }

      if (commandName === "unvip") {
        if (commandArgs.length === 2) {
          await removeVipToChat(token, commandArgs[1], streamer);
          setMessage("");
          socket.emit("sendReload", () => setMessage(""));
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " no es vip de la sala"
          );
        }
        return;
      }

      if (commandName === "slow") {
        if (commandArgs.length === 2) {
          await setSlow(token, commandArgs[1], streamer);
          setMessage("");
          socket.emit("sendReload", () => setMessage(""));
          socket.emit(
            "sendMessageSystem",
            "Ahora hay " + commandArgs[1] + " segundos de delay en la sala"
          );
        }
        return;
      }

      if (commandName === "slowoff") {
        await setSlow(token, 2, streamer);
        setMessage("");
        socket.emit("sendReload", () => setMessage(""));
        socket.emit(
          "sendMessageSystem",
          "Ahora hay 2 segundos de delay en la sala"
        );
        return;
      }

      if (commandName === "ban") {
        if (commandArgs.length === 3) {
          await addBanToChat(token, commandArgs[1], commandArgs[2], streamer);
          setMessage("");
          socket.emit("sendReload", () => setMessage(""));
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " esta baneado de la sala"
          );
        }
        return;
      }

      if (commandName === "unban") {
        if (commandArgs.length === 2) {
          await removeBanToChat(token, commandArgs[1], streamer);
          setMessage("");
          socket.emit("sendReload", () => setMessage(""));
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " no esta baneado de la sala"
          );
        }
        return;
      }

      if (commandName === "host") {
        if (commandArgs.length === 2) {
          socket.emit(
            "sendMessageSystem",
            "Ahora " + commandArgs[1] + " es el host de la sala"
          );
          socket.emit("sendHost", commandArgs[1], () => setMessage(""));
        }
        return;
      }

      if (commandName === "color") {
        if (commandArgs.length === 2) {
          const color = getColorByName(commandArgs[1]);
          //socket.emit("sendMessageSystem", "Ahora tu color es " + commandArgs[1]);
          /*let newMessageData = [...messageData, { _id: null, user: "System", text: "Ahora tu color es " + commandArgs[1], amount: 0, donation: false, color: null }]
          setMessages(newMessageData);*/

          const data = await updateColor(token, commandArgs[1]);
          if (data != null && data != undefined) {
            user.color = commandArgs[1];
            socket.emit("updateColor", commandArgs[1]);
            socket.emit("sendReload", () => setMessage(""));
          } else {
            alert({
              type: "ERROR",
              message: "No se pudo actualizar el color.",
            });
          }
        }
        return;
      }

      if (commandName === "announcement") {
        socket.emit("announcement");
        addHistoryAnnounce(token, "DNGTEAM");
        setMessage("");
        return;
      }

      if (commandName === "uniquechat") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta activado el modo de chat único en esta sala."
        );
        await enableUniqueChat(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "uniquechatoff") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta desactivado el modo de chat único en esta sala."
        );
        await disableUniqueChat(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "emoteonly") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta activado el modo Solo emoticonos en esta sala."
        );
        await enableEmotes(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "emoteonlyoff") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta desactivado el modo Solo emoticonos en esta sala."
        );
        await disableEmotes(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "subscribers") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta activado el modo Solo suscriptores en esta sala."
        );
        await enableSuscriber(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "subscribersoff") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta desactivado el modo solo suscriptores en esta sala."
        );
        await disableSuscriber(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "followers") {
        if (commandArgs.length === 2) {
          const time = commandArgs[1];

          socket.emit(
            "sendMessageSystem",
            "Ahora esta activado el modo Solo seguidores durante " +
              time +
              " minuto en esta sala."
          );
          await enableFollowers(token, streamer, time);
          socket.emit("sendReload", () => setMessage(""));
          setMessage("");
        }
        return;
      }

      if (commandName === "followersoff") {
        socket.emit(
          "sendMessageSystem",
          "Ahora esta desactivado el modo solo seguidores en esta sala."
        );
        await disableFollowers(token, streamer);
        socket.emit("sendReload", () => setMessage(""));
        setMessage("");
        return;
      }

      if (commandName === "bet") {
        setPredictPopup(true);
        setMessage("");
        return;
      }

      return;
    }

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
      await sendRequestMessage(token, streamer, message);
    }
  };

  const handleHotel = () => {
    window.open(
      "http://localhost:3002?name=" + user.name,
      "newwin",
      "width=1200,height=800"
    );
  };

  function popupwindow(url, title, w, h) {
    var y = window.outerHeight / 2 + window.screenY - h / 2;
    var x = window.outerWidth / 2 + window.screenX - w / 2;
    return window.open(
      url,
      title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        y +
        ", left=" +
        x
    );
  }

  function getReply(replyMessage) {
    setReply(replyMessage);
  }

  function getTextSize(size) {
    setTextSize(size);
  }

  function sendDonation(amount, text, donation) {
    socket.emit("sendDonation", amount, text, donation);
    callback(amount);
  }

  function sendBetReload() {
    socket.emit("sendBetReload", () => setMessage(""));
  }

  function getColorFromName(color) {
    if (color === "white") {
      return "#bebebe";
    }
    if (color === "pink") {
      return "#dda4a7";
    }
    if (color === "green") {
      return "#a1d1a3";
    }
    if (color === "yellow") {
      return "#ddd59d";
    }
    if (color === "lightblue") {
      return "#659dab";
    }
    if (color === "orange") {
      return "#dd7e0e";
    }
    if (color === "red") {
      return "#cc4f45";
    }
    if (color === "blue") {
      return "#44698b";
    }
    if (color === "violet") {
      return "#6c4e7c";
    }

    if (color === "PRIME1") {
      return "#D500FF";
    }

    if (color === "PRIME2") {
      return "#FF0000";
    }

    if (color === "PRIME3") {
      return "#82CD00";
    }
  }

  async function changeColor(color) {
    const colorCode = getColorFromName(color);

    const data = await updateColor(token, colorCode);
    if (data != null && data != undefined) {
      user.color = colorCode;
      socket.emit("updateColor", color, colorCode);
      socket.emit("sendReload", () => setMessage(""));
    } else {
      alert({ type: "ERROR", message: "No se pudo actualizar el color." });
    }
  }

  const [replyUser, setReplyUser] = useState("");
  const childFunc = React.useRef(null);

  function replyToUser(e) {
    setReplyUser(e);
    childFunc.current();
  }

  function getType() {
    if (type === 0) {
      return (
        <div className="messages-wrapper">
          <Messages
            isScrolled={isScrolled}
            setIsScrolled={setIsScrolled}
            isMobile={isMobile}
            replyToUser={(e) => replyToUser(e)}
            viewChat={() => setChatOff(false)}
            chatOff={chatOff}
            announce={announce}
            chatData={chatData}
            userMod={userMod}
            userVip={userVip}
            userBan={userBan}
            colorUser={user.color}
            reply={() => getReply("Test")}
            textSize={textSize}
            messages={messages}
            name={name}
            room={room}
            lookImage={user.lookImage}
            emotes={emotes}
            handleSendMessage={(e) => handleSendMessage(e)}
          />
          <Input
            isMobile={isMobile}
            reloadBets={() => sendBetReload()}
            betRanking={betRanking}
            bets={bets}
            dropdownBet={dropdownBet}
            setDropdownBet={(e) => setDropdownBet(e)}
            childFunc={childFunc}
            replyUser={replyUser}
            socketMain={socketMain}
            chatData={chatData}
            changeColor={(color) => changeColor(color)}
            setChatOff={() => setChatOff(true)}
            chatOff={chatOff}
            handleAnnounce={handleAnnounce}
            streamer={streamer}
            userMod={userMod}
            userVip={userVip}
            userBan={userBan}
            changeTextSize={(e) => getTextSize(e)}
            reply={reply}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            callback={(amount, text, donation) =>
              sendDonation(amount, text, donation)
            }
          />
        </div>
      );
    }

    if (type === 1) {
      return (
        <div style={{ overflow: "scroll" }} className="messages-wrapper">
          <AccordionList
            users={users}
            mods={mods}
            vips={vips}
            streamer={streamer}
          />
        </div>
      );
    }
  }

  const reloadPage = async (type) => {
    if (type === 0) {
      if (page === maxPage) {
        return alert("Selecciona una cantidad mayor a " + maxPage);
      }

      setPage(parseInt(page + 1));

      const dataDonation = await getStreamerDonationPixel(streamer);
      if (dataDonation != null && dataDonation != undefined) {
        const data = dataDonation.donations.slice(page * 3, (page + 1) * 3);
        setDonations(data);
      }
    }

    if (type === 1) {
      if (page === 0) {
        return alert("Selecciona una cantidad mayor a 0");
      }
      setPage(parseInt(page - 1));
      const dataDonation = await getStreamerDonationPixel(streamer);
      if (dataDonation != null && dataDonation != undefined) {
        const data = dataDonation.donations.slice(page * 3, (page - 1) * 3);
        setDonations(data);
      }
    }
  };

  function toggleBetDropdown() {
    setDropdownBet(!dropdownBet);
  }

  function getDonationSubscriptionCard(donation) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#534bb3",
          padding: "5px",
          borderRadius: "10px",
        }}
      >
        <img
          style={{ width: "15px" }}
          src="https://static.twitchcdn.net/assets/GiftBadge-Gold_72-6e5e65687a6ca6959e08.png"
        />
        <div
          style={{ marginLeft: "5px", display: "flex", alignItems: "center" }}
        >
          <p
            style={{ lineHeight: "10px", fontSize: "14px", fontWeight: "800" }}
          >
            {donation.userName}
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "800",
              color: "violet",
              marginLeft: "5px",
            }}
          >
            {donation.amount}
          </p>
        </div>
      </div>
    );
  }

  function getDonation() {
    if (typeDonation === 0 && donationsSubscriptions && donations) {
      return (
        <div className="chat-donation-body">
          <div className="chat-donation-container">
            <div
              className="chat-donation-card-container"
              style={{
                width: "90%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              {donationsSubscriptions.length > 0 || donations.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {donationsSubscriptions.map(
                    (donation, index) =>
                      donation.enabled === true &&
                      getDonationSubscriptionCard(donation)
                  )}
                  {donations.map(
                    (donation, index) =>
                      donation.enabled === true && (
                        <Donation
                          callback={() => console.log("Expiroo ")}
                          donation={donation}
                          onClick={() =>
                            toggleDonationCard(
                              donation.amount,
                              donation.userName,
                              donation.userAvatar,
                              donation.text,
                              donation.userLook,
                              donation.userColor
                            )
                          }
                        />
                      )
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h5
                    style={{
                      color: "#f36196",
                      fontFamily: "'Roboto', 'Arial', sans-serif",
                      fontSize: "13px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ¡Suscríbete, regala suscripciones o envía Pixels para
                    aparecer aquí!
                  </h5>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          height: "60px",
          backgroundColor: "#0404048f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScaleLoader width={4} height={20} color="#f36197d7" />
      </div>
    );
  }

  function getChat() {
    return (
      <div className="chat-wrapper">
        {betTopOpen && bets && (
          <BetTop
            bets={bets}
            betWon={betWon}
            handleBet={() => toggleBetDropdown()}
          />
        )}
        {!betTopOpen && betWon && (
          <BetTopWin betWonAmount={betWonAmount} betWon={betWon} />
        )}

        <div className="list-wrapper">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              fontFamily: "Montserrat",
            }}
          >
            <Tippy
              placement="right-start"
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Contraer
                </h1>
              }
            >
              <img
                onClick={() => chatExpanded()}
                style={{ width: "12px", cursor: "pointer" }}
                className="chat-button-more"
                src="/images/iconos/contraer.png"
              />
            </Tippy>

            <h4
              style={{
                fontSize: "12px",
                width: "290px",
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              CHAT DEL DIRECTO
            </h4>

            {/* type === 0 && <Tippy placement="left-start" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Usuarios</h1>}>
              <img onClick={() => setType(1)}  style={{width: "16px", cursor: "pointer"}} className="chat-button-more" src="/images/iconos/comunidad2.png"  />

            </Tippy>*/}

            {type === 1 && (
              <Tippy
                placement="left-start"
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Chat
                  </h1>
                }
              >
                <i
                  onClick={() => setType(0)}
                  style={{
                    cursor: "pointer",
                    width: "0px",
                    textAlign: "center",
                  }}
                  class="fas fa-arrow-left pinkker-button-more"
                />
              </Tippy>
            )}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#2b2b2b3f",
            marginTop: "19px auto",
          }}
        />

        {getDonation()}
        {donationCard && (
          <DonationCard
            donationColor={donationColor}
            donationAmount={donationAmount}
            donationName={donationName}
            donationAvatar={donationAvatar}
            donationText={donationText}
            donationLook={donationLook}
            close={() => setDonationCard(false)}
          />
        )}

        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#2b2b2b3f",
            marginTop: "19px auto",
          }}
        />

        {emotes != null && getType()}
      </div>
    );
  }

  function finishBetSetWinner(typeWin) {
    //Get if the user won or not the bet
    const userBet = bets.participants.find(
      (bet) => bet.userId.toString() === user._id.toString()
    );
    if (userBet) {
      if (userBet.type === typeWin) {
        setBetTopOpen(false);
        setBetWon(true);
        setBetWonAmount(userBet.amount);
        user.coins += userBet.amount;
        setTimeout(() => {
          setBetWon(false);
        }, 7000);
      } else {
        setBetWon(false);
      }
    }
  }

  return (
    <div className="page-wrapper">
      {getChat()}
      {betWon && (
        <div
          style={{
            position: "fixed",
            width: "0%",
            height: "0%",
            top: "0",
            right: "320px",
          }}
        >
          <Confetti numberOfPieces={100} width={"300px"} height={"1080px"} />
        </div>
      )}
      {predictPopup && (
        <PredictPopup
          finishBetGeneral={(typeWin) => finishBetSetWinner(typeWin)}
          reloadBets={() => sendBetReload()}
          bets={bets}
          streamer={streamer}
          closePopup={() => setPredictPopup(false)}
        />
      )}
    </div>
  );
};

export default Chat;
