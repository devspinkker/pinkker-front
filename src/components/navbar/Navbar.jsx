import React, { useState, useEffect, useRef, useCallback } from "react";
import "./NNavbar.css";
import "./Navbar.css";

import Auth from "../auth/Auth";
import { useSelector } from "react-redux";
import DropdownAccount from "./DropdownAccount";

import useTheme from "../../theme/useTheme";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Search from "./search/Search";
import DropdownNews from "./news/DropdownNews";
import DropdownBalance from "./balance/DropdownBalance";
import DropdownMessage from "./message/DropdownMessage";
import DropdownNotifications from "./notifications/DropdownNotifications";
import DropdownFriends from "./friends/Friends";

import { getNotificationsNotViewed } from "../../services/notifications";

import { getMessagesNotViewed } from "../../services/messages";
import DropdownPurchase from "./purchase/DropdownPurchase";

import DropdownLang from "./DropdownLang";

import Skeleton from "@mui/material/Skeleton";

import { Link, useLocation } from "react-router-dom";

function Navbar({
  socketMain,
  tyExpanded,
  expanded,
  handleMessage,
  isMobile,
  user,
}) {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const [isLogged, SetisLogged] = useState(false);
  const [avatar, setAvatar] = useState("");
  const token = useSelector((state) => state.token);

  const [click, setClick] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  const [isLoadingMain, setIsLoadingMain] = useState(true);
  setTimeout(() => {
    setIsLoadingMain(false);
  }, 400);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => {
    console.log("closeMobileMenu");
    setClick(false);
  };
  const [showPopupAuth, setShowPopupAuth] = useState(false);
  const [type, setType] = useState(0);

  const [dropdownAccount, setDropdownAccount] = useState(false);
  const [dropdownNews, setDropdownNews] = useState(false);
  const [dropdownBalance, setDropdownBalance] = useState(false);
  const [dropdownMessage, setDropdownMessage] = useState(false);
  const [dropdownNotifications, setDropdownNotifications] = useState(false);
  const [dropdownFriends, setDropdownFriends] = useState(false);
  const [dropdownPurchase, setDropdownPurchase] = useState(false);
  const [dropdownLang, setDropdownLang] = useState(false);

  const [dashboard, setDashboard] = useState(false);

  const [pulse, setPulse] = useState(false);

  const theme = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [donations, setDonations] = useState([]);

  let messageData = [];
  let notificationData = [];

  function togglePopupAuth(type) {
    setShowPopupAuth(!showPopupAuth);
    setType(type);
  }

  /*useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationsNotViewed(token);
      if(data != null && data != undefined) {
        setNotifications(data);
        let friends1 = [];
        let donations1 = [];

        await data.map((dataMaped) => dataMaped.type === 0 && friends1.push(dataMaped))
        await data.map((dataMaped) => dataMaped.type === 1 && friends1.push(dataMaped))
        await data.map((dataMaped) => dataMaped.type === 3 && donations1.push(dataMaped))

        setFriends(friends1)
        setDonations(donations1)
        if(data.length > 0) {
          document.title = "(" + data.length + ") - Pinkker";
        }
      }

      const dataMessages = await getMessagesNotViewed(token);
      if(dataMessages != null && dataMessages != undefined) {
        setMessages(dataMessages);
        messageData = [...dataMessages]
      }
      
    }
    fetchData();
  }, [token])*/
  useEffect(() => {
    let avatar = window.localStorage.getItem("avatar");
    if (avatar) {
      SetisLogged(true);
      setAvatar(avatar);
    } else {
      SetisLogged(false);
    }
    console.log(user);
  }, []);

  const addEllipsis = (str, limit) => {
    return str.length > limit ? str.substring(0, limit) + "..." : str;
  };

  const onMouseEnterAccount = () => {
    if (dropdownAccount === true) {
      setDropdownAccount(false);
    } else {
      setDropdownLang(false);
      setDropdownAccount(true);
    }
  };

  const onMouseEnterNews = () => {
    if (dropdownNews === true) {
      setDropdownNews(false);
    } else {
      setDropdownNews(true);
    }
  };

  const onMouseEnterBalance = () => {
    if (dropdownBalance === true) {
      setDropdownBalance(false);
    } else {
      setDropdownBalance(true);
    }
  };

  const onMouseEnterMessage = () => {
    if (dropdownMessage === true) {
      setDropdownMessage(false);
    } else {
      setDropdownMessage(true);
    }
  };

  const onMouseEnterNotifications = () => {
    if (dropdownNotifications === true) {
      setDropdownNotifications(false);
    } else {
      setDropdownNotifications(true);
      setNotifications([]);
    }
  };

  const onMouseEnterFriends = () => {
    if (dropdownFriends === true) {
      setDropdownFriends(false);
    } else {
      setDropdownFriends(true);
      user.userFriendsNotifications = 0;
    }
  };

  const onMouseEnterPurchase = () => {
    if (dropdownPurchase === true) {
      setDropdownPurchase(false);
    } else {
      setDropdownPurchase(true);
    }
  };

  const onMouseEnterLang = () => {
    if (dropdownLang === true) {
      setDropdownLang(false);
    } else {
      setDropdownLang(true);
    }
  };

  const userLink = () => {
    return (
      <div className="navbar-image-avatar-container">
        <div
          onClick={onMouseEnterAccount}
          style={{
            width: dropdownAccount ? "42px" : "40px",
            height: dropdownAccount ? "42px" : "40px",
            backgroundColor: dropdownAccount && "#f36196",
            position: "relative",
            left: "  ",
            top: "2px",
          }}
          className="navbar-image-avatar"
        >
          <img src={avatar} alt="" />
        </div>
      </div>
    );
  };

  function clickPulsedButton() {
    setPulse(!pulse);
    tyExpanded();
  }

  const [searchMobile, setSearchMobile] = useState(true);

  function getNavbar() {
    if (dashboard === false && isLoadingMain === false) {
      return (
        <nav className={"navbar-" + theme.theme}>
          {!isMobile && (
            <a
              className={"navbar-logo-" + theme.theme}
              onClick={closeMobileMenu}
            >
              <i
                onClick={() => clickPulsedButton()}
                style={{
                  fontSize: "18px",
                  zIndex: "1000",
                  marginLeft: "5px",
                  transform: expanded === false && "rotate(90deg)",
                  transition: "0.2s",
                  color: "#ededed",
                }}
                class="fas fa-bars"
              />
            </a>
          )}
          <Link
            to="/"
            className={"navbar-logo-" + theme.theme}
            onClick={closeMobileMenu}
          >
            <img src="/images/logo.png" style={{ width: "145px" }} alt="" />
          </Link>

          {!isMobile && (
            <div
              style={{
                width: isMobile ? "50%" : "100%",
                alignItems: "center",
                height: "50px",
                marginRight: "5px",
              }}
            >
              <Search isMobile={isMobile} />
            </div>
          )}

          {/* {isMobile && searchMobile === true && 
        <div style={{width: isMobile ? "100%" : "100%", alignItems: "center", height: "50px"}}>
          <Search isMobile={isMobile} />
        </div>} */}

          <ul className={"nav-menu"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                left: isLogged ? "20px" : "0px",
              }}
            >
              {isLogged && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  {/* {isMobile && searchMobile === false && 
                  <li onClick={() => setSearchMobile(true)} style={{marginRight: "5px", marginLeft: "3px", position: "relative", top: "-5px", left: "5px"}} className={'nav-item-' + theme.theme + " pinkker-button-more"}>
                      <a className={"nav-links-" + theme.theme} onClick={closeMobileMenu}>
                        <i style={{fontSize: "24px"}} class="fas fa-search navbar-search-i"/>
                      </a>
                  </li>
               } */}

                  {/* {searchMobile === false && <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Amigos</h1>}>
                  <li onClick={onMouseEnterFriends} style={{marginRight: "5px", marginLeft: "3px"}} className={'nav-item-' + theme.theme + " pinkker-button-more"}>
                      <a className={"nav-links-" + theme.theme} onClick={closeMobileMenu}>
                        {user && user.userFriendsNotifications != 0 && <div className='navbar-numbers'>{user.userFriendsNotifications}</div>}
                        <img style={{width: isMobile ? "35px" : "23px"}} src="/images/iconos/comunidad.png"  />
                      </a>
                  </li>
      </Tippy>}
                 */}

                  {searchMobile === true && (
                    <Tippy
                      placement="bottom"
                      theme="pinkker"
                      content={
                        <h1
                          style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                        >
                          Notificaciones
                        </h1>
                      }
                    >
                      <li
                        onClick={onMouseEnterNotifications}
                        className={
                          "nav-item-" + theme.theme + " pinkker-button-more"
                        }
                      >
                        <a
                          className={"nav-links-" + theme.theme}
                          onClick={closeMobileMenu}
                        >
                          {donations && donations.length != 0 && (
                            <div className="navbar-numbers">
                              {donations.length}
                            </div>
                          )}
                          <img
                            style={{ width: isMobile ? "30px" : "17px" }}
                            src="/images/iconos/notificacion.png"
                          />
                        </a>
                      </li>
                    </Tippy>
                  )}

                  {searchMobile === true && (
                    <Tippy
                      placement="bottom"
                      theme="pinkker"
                      content={
                        <h1
                          style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                        >
                          Mensajes
                        </h1>
                      }
                    >
                      <li
                        onClick={onMouseEnterMessage}
                        className={
                          "nav-item-" + theme.theme + " pinkker-button-more"
                        }
                      >
                        <a
                          className={"nav-links-" + theme.theme}
                          onClick={closeMobileMenu}
                        >
                          {messages && messages.length != 0 && (
                            <div className="navbar-numbers">
                              {messages.length}
                            </div>
                          )}
                          <img
                            style={{ width: isMobile ? "30px" : "17px" }}
                            src="/images/iconos/mensaje.png"
                          />
                        </a>
                      </li>
                    </Tippy>
                  )}
                  {isLogged && userLink()}

                  {/* {searchMobile === false && <button className='button-purchase-pixels' onClick={onMouseEnterPurchase}><img style={{width: isMobile ? "25px" : "17px", marginRight: "5px"}} src="/images/pixel.png" alt="" /> Comprar Pixeles</button>} */}
                </div>
              )}

              {!isLogged && (
                <h6
                  onClick={() => togglePopupAuth(0)}
                  className="button-navbar-login"
                >
                  Iniciar Sesión
                </h6>
              )}

              {!isLogged && (
                <h6
                  onClick={() => togglePopupAuth(1)}
                  className="button-navbar-register"
                >
                  Registrarse
                </h6>
              )}
            </div>

            {dropdownBalance && (
              <DropdownBalance closeNavbar={closeMobileMenu} />
            )}

            {dropdownNews && <DropdownNews closeNavbar={closeMobileMenu} />}
            {dropdownNotifications && (
              <DropdownNotifications closeNavbar={closeMobileMenu} />
            )}
            {dropdownFriends && (
              <DropdownFriends
                isMobile={isMobile}
                closeNavbar={closeMobileMenu}
              />
            )}

            {dropdownMessage && (
              <DropdownMessage
                handleMessage={(e) => handleMessage(e)}
                closeNavbar={closeMobileMenu}
              />
            )}
            {dropdownPurchase && (
              <DropdownPurchase closeNavbar={closeMobileMenu} />
            )}

            {/* {isLogged && userLink()} */}
            {dropdownAccount && (
              <DropdownAccount
                user={user}
                toggleLang={() => {
                  setDropdownLang(true);
                  setDropdownAccount(false);
                }}
                closeNavbar={() => {
                  setDropdownLang(false);
                  setDropdownAccount(false);
                }}
                callback={() => setDropdownAccount(false)}
              />
            )}

            {dropdownLang && (
              <DropdownLang
                closeNavbar={closeMobileMenu}
                close={() => setDropdownLang(false)}
                callback={() => setDropdownAccount(false)}
              />
            )}
          </ul>

          {showPopupAuth === true && (
            <Auth
              isMobile={isMobile}
              typeDefault={type}
              closePopup={() => togglePopupAuth()}
            />
          )}
        </nav>
      );
    } else {
      return (
        <nav className={"navbar-" + theme.theme}>
          <a className={"navbar-logo-" + theme.theme} onClick={closeMobileMenu}>
            <i
              onClick={tyExpanded}
              style={{ fontSize: "16px" }}
              class="fas fa-bars"
            ></i>
          </a>
        </nav>
      );
    }
  }

  // return <>{location?.pathname == "/" ? getNavbar() : null}</>;
  return <>{getNavbar()}</>;
}

export default Navbar;
