import React, { useState, useEffect, useRef, useCallback } from "react";

import "./Search.css";
import useTheme from "../../../theme/useTheme";

import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router";

import { fetchSearch } from "../../../redux/actions/searchAction";

import SearchDropdown from "./dropdown/SearchDropdown";

import {
  addHistorySearch,
  existsHistoryChannelName,
  getHistorySearch,
  removeHistorySearch,
} from "../../../helpers/searchHelper";

import { useNotification } from "../../Notifications/NotificationProvider";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      if (
        event.target.parentElement?.className === "dropdownsearch-close-icon"
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function Search({ isMobile }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);

  const [search, setSearch] = useState(null);

  const [text, setText] = useState(null);

  const theme = useTheme();

  const divRef = useRef();
  const handler = useCallback(() => {
    setSearch(null);
  }, []);
  useOnClickOutside(divRef, handler);

  const routerHistory = useHistory();

  const alert = useNotification();

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= 0) {
      setSearch(null);
      setText(null);
    } else {
      setText(value);

      const getUser = () => {
        return fetchSearch(value).then((res) => {
          setSearch(res.data);
        });
      };
      getUser();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      if (text === null) {
        alert({
          type: "ERROR",
          message: "Rellena algo en el campo de busqueda!",
        });
        return;
      }

      routerHistory.push("/plataform/search?term=" + text);
      if (existsHistoryChannelName(text)) {
        return;
      } else {
        const date = new Date();
        addHistorySearch({ text: text, createdAt: date });
      }
      setSearch(null);
    }
  };

  const handleClick = (text, avatar) => {
    if (text === null) {
      alert({
        type: "ERROR",
        message: "Rellena algo en el campo de busqueda!",
      });
      return;
    }

    if (avatar != null) {
      routerHistory.push("/" + text);
    } else {
      routerHistory.push("/plataform/search?term=" + text);
    }

    if (existsHistoryChannelName(text)) {
      return;
    } else {
      const date = new Date();
      addHistorySearch({ text: text, avatar: avatar, createdAt: date });
    }
    setSearch(null);
  };

  const removeHistory = (text) => {
    removeHistorySearch(text);
    setSearch({ history: getHistorySearch() });
  };

  const handleMouseEnter = (e) => {
    const history = getHistorySearch();

    if (text === null) {
      setSearch({ history: history });
    }
  };

  return (
    <div
      ref={divRef}
      className={
        search === null
          ? "navbar-search-" + theme.theme + " navbar-search-margin"
          : "navbar-search-" + theme.theme
      }
      style={{ padding: "2px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: isMobile ? "50px" : "",
        }}
      >
        <i
          style={{ fontSize: "16px", color: "rgb(89 89 89)" }}
          class="fas fa-search navbar-search-i"
        />
        <input
          style={{ fontSize: "16px" }}
          value={text}
          onClickCapture={handleMouseEnter}
          onKeyDown={handleKey}
          onChange={handleChange}
          placeholder="Search"
          type="search"
        />
      </div>

      {search != null && (
        <SearchDropdown
          isMobile={isMobile}
          handleRemove={(e) => removeHistory(e)}
          handleClickHistory={(name, avatar) => handleClick(name, avatar)}
          search={search}
          text={text}
        />
      )}
    </div>
  );
}
