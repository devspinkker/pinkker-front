import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import "./NavbarLeft.css";

import UserOnline from "./UserOnline";

import { getAllFollowers } from "../../services/follow";
import { useSelector } from "react-redux";

import useTheme from "../../theme/useTheme";

import {
  GetAllsStreamsOnline,
  GetAllsStreamsOnlineThatUserFollows,
} from "../../services/backGo/streams";
import NavbarLeftMobile from "./navbarLeftMobile";
import { getUserByIdTheToken } from "../../services/backGo/user";
import Search from "../../components/navbar/search/Search";
import MainDeshboard from "./dashboard/MainDeshboard";

var activeNormal = 0;

export default function NavbarLeft({
  isMobile,
  tyExpand,
  tyExpanded,
  setExpanded,
  tyDashboard,
  user,
}) {
  const [activeNormal, setactiveNormal] = useState(0);

  const [recommended, setRecommended] = useState([]);
  const [
    AllsStreamsOnlineThatUserFollows,
    setAllsStreamsOnlineThatUserFollows,
  ] = useState([]);
  const [dashboard, setDashboard] = useState(tyDashboard);

  const [dropdownSettings, setDropdownSettings] = useState(false);

  const theme = useTheme();

  const [active, setActive] = useState(null);

  const [click, setClick] = useState(false);
  const [tyExpandedFollowStreams, setTyExpandedFollowStreams] = useState(false);
  const [tyExpandedRecomStreams, settyExpandedRecomStreams] = useState(false);
  const handleToggleExpandFollowStreams = () => {
    setTyExpandedFollowStreams(!tyExpandedFollowStreams);
  };
  const handleToggleExpandRecomStreams = () => {
    settyExpandedRecomStreams(!tyExpandedRecomStreams);
  };
  const closeMobileMenu = () => {
    setClick(false);
  };

  const [pulse, setPulse] = useState(false);

  function clickPulsedButton() {
    setPulse(!pulse);
    setExpanded(!tyExpanded);
  }

  //UseEffect execute with the route change
  useEffect(() => {
    if (window.location?.pathname === "/") {
      setDashboard(false);
    }

    if (window.location?.pathname.split("/")[1] === user?.NameUser) {
      setDashboard(false);
    }

    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/streammanager"
    ) {
      setDashboard(true);
    }
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/home"
    ) {
      setDashboard(true);
    }

    if (window.location?.pathname != "/plataform/clips") {
      //Cancel window scroll event
      window.onscroll = function (e) {
        console.log("");
      };
    }
  }, [window.location?.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      let token = window.localStorage.getItem("token");

      let resGetAllsStreamsOnlineThatUserFollows;
      if (token) {
        resGetAllsStreamsOnlineThatUserFollows =
          await GetAllsStreamsOnlineThatUserFollows(token);
        if (resGetAllsStreamsOnlineThatUserFollows.message === "ok") {
          setAllsStreamsOnlineThatUserFollows(
            resGetAllsStreamsOnlineThatUserFollows.data
          );
          resGetAllsStreamsOnlineThatUserFollows =
            resGetAllsStreamsOnlineThatUserFollows.data;
        }
      }

      const result = await GetAllsStreamsOnline();
      if (result.message === "ok" && result.data) {
        if (resGetAllsStreamsOnlineThatUserFollows?.length > 0) {
          const usersOnlineAndFollowed = resGetAllsStreamsOnlineThatUserFollows
            ? resGetAllsStreamsOnlineThatUserFollows?.map(
                (stream) => stream.streamerId
              )
            : [];

          const recommendedFiltered = result.data.filter(
            (user) => !usersOnlineAndFollowed.includes(user.streamerId)
          );

          setRecommended(recommendedFiltered);
        } else {
          setRecommended(result.data);
        }
      }
    };

    fetchData();
  }, [user]);

  const onMouseEnterSettings = () => {
    if (dropdownSettings === true) {
      setDropdownSettings(false);
    } else {
      setDropdownSettings(true);
    }
  };

  function getNormalNavbar() {
    if (dashboard === true) {
      return (
        <MainDeshboard
          user={user}
          tyExpanded={tyExpanded}
          setExpanded={setExpanded}
        />
      );
    } else {
      return (
        <div className="conteiner-navbar-dashboardfalse">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: !tyExpanded ? "center" : "",
              marginTop: !tyExpanded ? "14px" : "",
              padding: "2px 9px",
            }}
          >
            <i
              onClick={() => clickPulsedButton()}
              style={{
                cursor: "pointer",
                fontSize: tyExpanded ? "18px" : "22px",
                zIndex: "1000",
                marginLeft: "5px",
                // transform: expanded === false && "rotate(90deg)",
                transition: "0.2s",
                color: "#ededed",
              }}
              className="fas fa-bars"
            />
            <Link
              to="/"
              className={"navbar-logo-" + theme.theme}
              onClick={closeMobileMenu}
              style={{ margin: "0px" }}
            >
              {tyExpanded && (
                <img src="/images/logo.png" style={{ width: "145px" }} alt="" />
              )}
            </Link>
          </div>
          <div style={{ height: "91vh", overflow: "auto" }}>
            <div
              className="container-search-navbarleft"
              style={{
                borderBottom: tyExpanded ? "" : "none",
                padding: tyExpanded ? "" : "0px",
              }}
            >
              {tyExpanded && <Search isMobile={isMobile} />}
            </div>
            <div
              className={
                tyExpanded
                  ? "pixel-coming-soon-navbarLeft"
                  : "pixel-coming-soon-navbarLeft-noexpand"
              }
            >
              <div className="pixel-coming-soon-navbarLeft-img-pixel-container">
                <img
                  className="pixel-coming-soon-navbarLeft-img-pixel"
                  style={{
                    width: "38px",
                  }}
                  src="/images/pixel.png"
                />
              </div>
              <div className="pixel-coming-soon-text-container">
                <div className="pixel-coming-soon-text">
                  <span className="pixel-coming-soon-text-pixel">Pinkker</span>
                  <span className="pixel-coming-soon-text-pxl">(Prime)</span>
                </div>
                <span className="pixel-coming-soon-navbarLeft-Comming-soon">
                  Ver beneficios!
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "10px 0px",
              }}
              className="conteiner-navbarLeft-custom"
            >
              <Link
                onClick={() => setactiveNormal(2)}
                className="navbarleft-link"
                to="/plataform/explore?tipo=categories"
              >
                <li
                  style={{
                    // backgroundColor: activeNormal === 2 && "#3b3b3b",
                    borderLeft: activeNormal === 2 && "3px solid #2a2e38",

                    width: tyExpanded ? "" : "126px",
                  }}
                  class={
                    activeNormal === 2
                      ? "navbaraccount-li has-subnav nav-active"
                      : "navbaraccount-li has-subnav"
                  }
                >
                  <div
                    style={{
                      width: "30%",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    <i class="fab fa-google-play" />
                  </div>
                  {tyExpanded && <span class="nav-text">Explorar</span>}
                </li>
              </Link>

              <Link
                onClick={() => setactiveNormal(1)}
                className="navbarleft-link"
                to="/plataform/tendency"
              >
                <li
                  style={{
                    // backgroundColor: activeNormal === 1 && "#3b3b3b",
                    borderLeft: activeNormal === 1 && "3px solid #f36196",
                    width: tyExpanded ? "" : "126px",
                  }}
                  class={
                    activeNormal === 1
                      ? "navbaraccount-li has-subnav nav-active"
                      : "navbaraccount-li has-subnav"
                  }
                >
                  <div style={{ width: "30%", textAlign: "center" }}>
                    <img
                      style={{ width: "18px" }}
                      src="/images/iconos/navbar/tendencia.png"
                    />
                  </div>
                  {tyExpanded && <span class="nav-text">Tendencias</span>}
                </li>
              </Link>

              {/* <Link
              onClick={() => setactiveNormal(5)}
              className="navbarleft-link"
              to="/plataform/tendency"
            >
              <li
                style={{
                  backgroundColor: activeNormal === 5 && "#3b3b3b",
                  borderLeft: activeNormal === 5 && "3px solid #f36196",
                }}
                class={
                  activeNormal === 5
                    ? "navbaraccount-li has-subnav nav-active"
                    : "navbaraccount-li has-subnav"
                }
              >
                <div
                  style={{ width: "30%", textAlign: "center", color: "white" }}
                >
                  <i
                    style={{ position: "relative", left: "5px" }}
                    class="fas fa-images"
                  />
                </div>
                <span class="nav-text">Galeria</span>
              </li>
            </Link> */}

              <Link
                onClick={() => setactiveNormal(3)}
                className="navbarleft-link"
                to="/plataform/clips"
              >
                <li
                  style={{
                    // backgroundColor: activeNormal === 3 && "#3b3b3b",
                    borderLeft: activeNormal === 3 && "3px solid #f36196",
                    width: tyExpanded ? "" : "126px",
                  }}
                  class={
                    activeNormal === 3
                      ? "navbaraccount-li has-subnav nav-active"
                      : "navbaraccount-li has-subnav"
                  }
                >
                  <div style={{ width: "30%", textAlign: "center" }}>
                    <img
                      style={{ width: "18px" }}
                      src="/images/iconos/navbar/clips.png"
                    />
                  </div>
                  {tyExpanded && <span class="nav-text">Clips</span>}
                </li>
              </Link>

              <Link
                onClick={() => setactiveNormal(4)}
                className="navbarleft-link"
                to="/plataform/muro"
              >
                <li
                  style={{
                    // backgroundColor: activeNormal === 4 && "#3b3b3b",
                    borderLeft: activeNormal === 4 && "3px solid #f36196",
                    width: tyExpanded ? "" : "126px",
                  }}
                  class={
                    activeNormal === 4
                      ? "navbaraccount-li has-subnav nav-active"
                      : "navbaraccount-li has-subnav"
                  }
                >
                  <div style={{ width: "30%", textAlign: "center" }}>
                    <img
                      style={{ width: "18px" }}
                      src="/images/iconos/navbar/muro.png"
                    />
                  </div>
                  {tyExpanded && <span class="nav-text">Muro</span>}
                </li>
              </Link>
            </div>
            <div />
            {AllsStreamsOnlineThatUserFollows &&
              AllsStreamsOnlineThatUserFollows.length > 0 &&
              tyExpanded && (
                <div
                  className={
                    tyExpandedFollowStreams
                      ? "container-AllsStreamsOnlineThatUserFollows"
                      : "container-AllsStreamsOnlineThatUserFollows_expand"
                  }
                >
                  <div className="navbarleft-title">
                    <div className="navbarleft-title-sigo">
                      <h5 className={tyExpanded === false && "notvisible"}>
                        Canales que sigo
                      </h5>
                      <i
                        onClick={() => handleToggleExpandFollowStreams()}
                        className="fas fa-chevron-right "
                        style={{
                          transform: tyExpandedFollowStreams
                            ? "rotate(-90deg)"
                            : "rotate(90deg)",
                        }}
                      ></i>
                    </div>
                  </div>
                  {AllsStreamsOnlineThatUserFollows.slice(
                    0,
                    tyExpandedFollowStreams ? undefined : 1
                  ).map((streamer) => (
                    <div
                      key={streamer.id}
                      className={`container-userOnline${
                        tyExpanded ? " fade-in" : " fade-out"
                      }`}
                    >
                      <UserOnline
                        tyExpanded={tyExpanded}
                        thumb={streamer.stream_thumbnail}
                        viewers={streamer.ViewerCount}
                        image={streamer.streamer_avatar}
                        streamer={streamer.streamer}
                        title={streamer.stream_title}
                        category={streamer.stream_category}
                        thum={streamer.stream_thumbnail}
                      />
                    </div>
                  ))}
                </div>
              )}

            {/* {usersOnline &&
            usersOnline.map(
              (streamer) =>
                user.following &&
                user.following.map(
                  (follower) =>
                    streamer.streamerId === follower && (
                      <UserOnline
                        tyExpanded={tyExpanded}
                        viewers={streamer.viewers}
                        thumb={streamer.stream_thumbnail}
                        image={streamer.streamer_avatar}
                        streamer={streamer.streamer}
                        title={streamer.stream_title}
                        category={streamer.stream_category}
                        thum={streamer.stream_thumbnail}
                      />
                    )
                )
            )}
          {usersOnline &&
            usersOnline.map(
              (you) =>
                you.streamerId === user._id && (
                  <UserOnline
                    tyExpanded={tyExpanded}
                    viewers={you.viewers}
                    image={user.avatar}
                    streamer={you.streamer}
                    title={you.stream_title}
                    category={you.stream_category}
                    thum={you.stream_thumbnail}
                  />
                )
            )} */}

            {recommended && recommended.length > 0 && tyExpanded && (
              <div
                className={
                  tyExpandedFollowStreams
                    ? "container-AllsStreamsOnlineThatUserFollows"
                    : "container-AllsStreamsOnlineThatUserFollows_expand"
                }
              >
                <div className="navbarleft-title">
                  <div className="navbarleft-title-sigo">
                    <h5 className={tyExpanded === false && "notvisible"}>
                      Recomendados
                    </h5>
                    <i
                      onClick={() => handleToggleExpandRecomStreams()}
                      className="fas fa-chevron-right "
                      style={{
                        transform: tyExpandedFollowStreams
                          ? "rotate(-90deg)"
                          : "rotate(90deg)",
                      }}
                    ></i>
                  </div>
                </div>
                {recommended
                  .slice(0, tyExpandedRecomStreams ? undefined : 1)
                  .map((streamer) => (
                    <div
                      key={streamer.id}
                      className={`container-userOnline${
                        tyExpanded ? " fade-in" : " fade-out"
                      }`}
                    >
                      <UserOnline
                        tyExpanded={tyExpanded}
                        thumb={streamer.stream_thumbnail}
                        viewers={streamer.ViewerCount}
                        image={streamer.streamer_avatar}
                        streamer={streamer.streamer}
                        title={streamer.stream_title}
                        category={streamer.stream_category}
                        thum={streamer.stream_thumbnail}
                      />
                    </div>
                  ))}
              </div>
            )}
            <div className={tyExpanded ? "navbarleft-footer" : "notvisible"}>
              <div
                style={{
                  width: "96%",
                  height: "1px",
                  backgroundColor: "#ffffff1a",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />

              <div className="navbarleft-terms">
                <p style={{ fontSize: "12px" }}>
                  <a style={{ cursor: "pointer" }}>Política de privacidad</a>{" "}
                  <a class="vl" />{" "}
                  <a style={{ cursor: "pointer" }}>Términos de servicio</a>{" "}
                  <a class="vl" />{" "}
                  <a style={{ cursor: "pointer" }}>
                    Términos de Servicio de Streamers
                  </a>{" "}
                </p>
              </div>
              <div className="navbarleft-social">
                <p>Siguenos</p>
                <i class="fab fa-facebook p-facebook" />
                <i class="fab fa-twitter p-twitter" />
                <i class="fab fa-instagram p-instagram" />
                <i class="fab fa-tiktok p-tiktok" />
              </div>
              <div className="navbarleft-copyright">
                <p>Pinkker 2022 ©️ All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  function getNavbarLeft() {
    if (isMobile) {
      return <NavbarLeftMobile streamer={"user.NameUser"} />;
    } else {
      return (
        <aside
          class={
            tyExpanded
              ? "main-menu-" + theme.theme + " expanded"
              : "main-menu-" + theme.theme
          }
        >
          <ul
            className={
              tyExpanded ? "navbaraccount-ul" : "navbaraccount-ul-expanded"
            }
          >
            {getNormalNavbar()}
          </ul>
          {}
        </aside>
      );
    }
  }

  return getNavbarLeft();
}
