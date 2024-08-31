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
  const [dashboard, setDashboard] = useState(true);

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
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/stream"
    ) {
      setDashboard(true);
    }
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/Configuraci%C3%B3n"
    ) {
      setDashboard(true);
    }
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/Clave"
    ) {
      setDashboard(true);
    }
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/community"
    ) {
      setDashboard(true);
    }
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/community"
    ) {
      setDashboard(true);
    }
    if (
      window.location?.pathname ===
      "/" + user?.NameUser + "/dashboard/analytics"
    ) {
      setDashboard(true);
    }
    if (window.location?.pathname != "/plataform/clips") {
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
    console.log('dashboard', dashboard)
    
      return (
        <MainDeshboard
          user={user}
          tyExpanded={tyExpanded}
          setExpanded={setExpanded}
        />
      );
    
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