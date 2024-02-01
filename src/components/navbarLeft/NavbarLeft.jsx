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

var activeNormal = 0;

export default function NavbarLeft({
  isMobile,
  tyExpand,
  tyExpanded,
  setExpanded,
  tyDashboard,
  user,
}) {
  const token = useSelector((state) => state.token);
  const usersOnline = useSelector((state) => state.streamers);

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
    setExpanded();
  }

  //UseEffect execute with the route change
  useEffect(() => {
    if (window.location.pathname === "/") {
      setDashboard(false);
    }

    if (window.location.pathname.split("/")[1] === user?.NameUser) {
      setDashboard(false);
    }

    if (
      window.location.pathname ===
      "/" + user?.NameUser + "/dashboard/streammanager"
    ) {
      setDashboard(true);
    }
    if (window.location.pathname === "/" + user?.NameUser + "/dashboard/home") {
      setDashboard(true);
    }

    if (window.location.pathname != "/plataform/clips") {
      //Cancel window scroll event
      window.onscroll = function (e) {
        console.log("");
      };
    }
  }, [window.location.pathname]);

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
        }
      }

      const result = await GetAllsStreamsOnline();

      if (result.message === "ok" && result.data) {
        if (AllsStreamsOnlineThatUserFollows?.length > 0) {
          const usersOnlineAndFollowed = AllsStreamsOnlineThatUserFollows
            ? AllsStreamsOnlineThatUserFollows?.map(
                (stream) => stream.streamerId
              )
            : [];

          const recommendedFiltered = result.data.filter(
            (user) => !usersOnlineAndFollowed.includes(user.streamerId)
          );

          console.log(recommendedFiltered);
          setRecommended(recommendedFiltered);
        } else {
          console.log("sas");
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
        <div>
          <div
            style={{ display: "flex", alignItems: "center", height: "105px" }}
            className="navbarleft-dashboard-title"
          >
            <div
              style={{ textAlign: "center", position: "relative", top: "5px" }}
              className="other-div-nav"
            >
              <img
                style={
                  tyExpanded
                    ? {
                        cursor: "pointer",
                        position: "relative",
                        width: "65px",
                        borderRadius: "200px",
                      }
                    : { borderRadius: "100px", width: "40px" }
                }
                src={user?.Avatar}
                alt=""
              />
            </div>
            <div
              style={{
                marginLeft: "15px",
                textAlign: "left",
                position: "relative",
                top: "5px",
              }}
            >
              <h3 style={{ fontWeight: "800", fontSize: "16px" }}>
                {user && user.NameUser}
              </h3>
              <h1
                style={{ fontSize: "18px", marginTop: "5px", color: "#ededed" }}
              >
                {user?.Followers && user?.Followers.length}
              </h1>
              <p
                style={{
                  fontSize: "11px",
                  marginTop: "5px",
                  color: "lightgray",
                }}
              >
                Total de seguidores
              </p>
            </div>
          </div>

          <div
            style={{
              width: "88%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <Link
            to={"/" + user?.NameUser + "/dashboard/home"}
            onClick={() => (activeNormal = 0)}
            className="navbarleft-link"
          >
            <li
              style={{
                backgroundColor: activeNormal === 0 && "#3b3b3b",
                borderLeft: activeNormal === 0 && "3px solid #f36196",
              }}
              class={
                active === 0
                  ? "navbaraccount-li has-subnav nav-active"
                  : "navbaraccount-li has-subnav"
              }
            >
              <i
                style={{
                  fontSize: "14px",
                  marginTop: "13px",
                  color: "#ededed",
                }}
                class="fa fa-home fa-2x"
              />
              <span
                style={{ color: activeNormal === 0 && "#f36196" }}
                class="nav-text"
              >
                Inicio
              </span>
            </li>
          </Link>

          <Link
            to={"/" + user?.NameUser + "/dashboard/streammanager"}
            onClick={() => (activeNormal = 1)}
            className="navbarleft-link"
          >
            <li
              style={{
                backgroundColor: activeNormal === 1 && "#3b3b3b",
                borderLeft: activeNormal === 1 && "3px solid #f36196",
              }}
              class={
                active === 1
                  ? "navbaraccount-li has-subnav nav-active"
                  : "navbaraccount-li has-subnav"
              }
            >
              <i
                style={{
                  fontSize: "14px",
                  marginTop: "13px",
                  color: "#ededed",
                }}
                class="fa fa-signal fa-2x"
              />
              <span
                style={{ color: activeNormal === 1 && "#f36196" }}
                class="nav-text"
              >
                Gestor de transmisión
              </span>
            </li>
          </Link>

          {/*<Link to={"/" + user.name + "/dashboard/analytics"} onClick={() => activeNormal = 2} className="navbarleft-link">
                        <li style={{backgroundColor: activeNormal === 2 && "#3b3b3b", borderLeft: activeNormal === 2 && "3px solid #f36196"}} class={active === 2 ? "navbaraccount-li has-subnav nav-active" : "navbaraccount-li has-subnav"}>
                            <i style={{fontSize: "14px", marginTop: "13px", color: "#ededed"}} class="fa fa-chart-line fa-2x"/>
                            <span style={{color: activeNormal === 2 && "#f36196"}} class="nav-text">
                                Estadisticas
                            </span>
                        </li>
                    </Link>

                    <Link to={"/" + user.name + "/dashboard/content"} onClick={() => activeNormal = 3} className="navbarleft-link">
                        <li style={{backgroundColor: activeNormal === 3 && "#3b3b3b", borderLeft: activeNormal === 3 && "3px solid #f36196"}} class={active === 3 ? "navbaraccount-li has-subnav nav-active" : "navbaraccount-li has-subnav"}>
                            <i style={{fontSize: "14px", marginTop: "13px", color: "#ededed"}} class="fa fa-video fa-2x"/>
                            <span style={{color: activeNormal === 3 && "#f36196"}} class="nav-text">
                                Contenido
                            </span>
                        </li>
            </Link>*/}

          {/*<Link onClick={() => activeNormal = 4} className="navbarleft-link">
                        <li style={{backgroundColor: activeNormal === 4 && "#3b3b3b", borderLeft: activeNormal === 4 && "3px solid #f36196"}} class={active === 4 ? "navbaraccount-li has-subnav nav-active" : "navbaraccount-li has-subnav"}>
                            <i style={{fontSize: "14px", marginTop: "13px", color: "#ededed"}} class="fa fa-dollar-sign fa-2x"/>
                            <span style={{color: activeNormal === 4 && "#f36196"}} class="nav-text">
                                Monetización
                            </span>
                        </li>
            </Link>*/}

          {/*<Link to={"/" + user.name + "/dashboard/community"} onClick={() => activeNormal = 5} className="navbarleft-link">
                        <li style={{backgroundColor: activeNormal === 5 && "#3b3b3b", borderLeft: activeNormal === 5 && "3px solid #f36196"}} class={active === 5 ? "navbaraccount-li has-subnav nav-active" : "navbaraccount-li has-subnav"}>
                            <i style={{fontSize: "14px", marginTop: "13px", color: "#ededed"}} class="fa fa-users fa-2x"/>
                            <span style={{color: activeNormal === 5 && "#f36196"}} class="nav-text">
                                Comunidad
                            </span>
                        </li>
        </Link>*/}

          {/* {user.role === 1 && (
            <Link
              to={"/admin/general"}
              onClick={() => (activeNormal = 6)}
              className="navbarleft-link"
            >
              <li
                style={{
                  backgroundColor: activeNormal === 6 && "#3b3b3b",
                  borderLeft: activeNormal === 6 && "3px solid #f36196",
                }}
                class={
                  active === 7
                    ? "navbaraccount-li has-subnav nav-active"
                    : "navbaraccount-li has-subnav"
                }
              >
                <i
                  style={{
                    fontSize: "14px",
                    marginTop: "13px",
                    color: "#ededed",
                  }}
                  class="fa fa-user-cog fa-2x"
                />
                <span
                  style={{ color: activeNormal === 6 && "#f36196" }}
                  class="nav-text"
                >
                  Admin
                </span>
              </li>
            </Link>
          )} */}
        </div>
      );
    } else {
      return (
        <div className="conteiner-navbar-dashboardfalse">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "17px",
            }}
          >
            <i
              onClick={() => clickPulsedButton()}
              style={{
                cursor: "pointer",
                fontSize: "18px",
                zIndex: "1000",
                marginLeft: "5px",
                // transform: expanded === false && "rotate(90deg)",
                transition: "0.2s",
                color: "#ededed",
              }}
              class="fas fa-bars"
            />
            <Link
              to="/"
              className={"navbar-logo-" + theme.theme}
              onClick={closeMobileMenu}
              style={{ margin: "0px" }}
            >
              <img src="/images/logo.png" style={{ width: "145px" }} alt="" />
            </Link>
          </div>
          <div style={{ height: "91vh", overflow: "auto" }}>
            <div className="container-search-navbarleft">
              <Search isMobile={isMobile} />
            </div>
            <Link
              onClick={() => (activeNormal = 2)}
              className="navbarleft-link"
              to="/plataform/explore"
            >
              <li
                style={{
                  backgroundColor: activeNormal === 2 && "#3b3b3b",
                  borderLeft: activeNormal === 2 && "3px solid #f36196",
                }}
                class={
                  activeNormal === 2
                    ? "navbaraccount-li has-subnav nav-active"
                    : "navbaraccount-li has-subnav"
                }
              >
                <div
                  style={{ width: "30%", textAlign: "center", color: "white" }}
                >
                  <i class="fab fa-google-play" />
                </div>
                <span class="nav-text">Explorar</span>
              </li>
            </Link>

            <Link
              onClick={() => (activeNormal = 1)}
              className="navbarleft-link"
              to="/plataform/tendency"
            >
              <li
                style={{
                  backgroundColor: activeNormal === 1 && "#3b3b3b",
                  borderLeft: activeNormal === 1 && "3px solid #f36196",
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
                <span class="nav-text">Tendencias</span>
              </li>
            </Link>

            <Link
              onClick={() => (activeNormal = 5)}
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
            </Link>

            <Link
              onClick={() => (activeNormal = 3)}
              className="navbarleft-link"
              to="/plataform/clips"
            >
              <li
                style={{
                  backgroundColor: activeNormal === 3 && "#3b3b3b",
                  borderLeft: activeNormal === 3 && "3px solid #f36196",
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
                <span class="nav-text">Clips</span>
              </li>
            </Link>

            <Link
              onClick={() => (activeNormal = 4)}
              className="navbarleft-link"
              to="/plataform/muro"
            >
              <li
                style={{
                  backgroundColor: activeNormal === 4 && "#3b3b3b",
                  borderLeft: activeNormal === 4 && "3px solid #f36196",
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
                <span class="nav-text">Muro</span>
              </li>
            </Link>

            <div />
            {AllsStreamsOnlineThatUserFollows &&
              AllsStreamsOnlineThatUserFollows.length > 0 && (
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

            {recommended && recommended.length > 0 && (
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
