import React, { useState, useEffect } from "react";
import "./DropdownEmotes.css";
import { useSelector } from "react-redux";
import {
  GetPinkkerEmotes,
  GetGlobalEmotes,
} from "../../../../../services/backGo/user";

function DropdownEmotes({ closeNavbar, clickEmoticon, muro }) {
  const [click, setClick] = useState(false);
  const [PinkkerEmotes, setPinkkerEmotes] = useState(null);
  const [GlobalEmotes, setGlobalEmotes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ress = await GetPinkkerEmotes();
      if (ress.message === "ok" && ress.data !== null) {
        setPinkkerEmotes(ress.data);
      }
      const ressGetPinkkerEmotes = await GetGlobalEmotes();

      if (ressGetPinkkerEmotes.message === "ok" && ressGetPinkkerEmotes.data) {
        setGlobalEmotes(ressGetPinkkerEmotes.data);
      }
    };
    fetchData();
  }, []);

  function renderPinkkerEmotes() {
    if (!PinkkerEmotes) return null;

    return (
      <div className="dropdownemotes-primary">
        <hr
          style={{
            border: "1px solid #4b4b4b8f",
            width: "95%",
            marginBottom: "10px",
          }}
        />
        <p
          style={{
            fontFamily: "Inter",
            color: "darkgray",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "5px",
          }}
        >
          Emotes de Pinkker
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "scroll",
            height: "180px",
          }}
        >
          {PinkkerEmotes[0]?.emotes?.map((emote) => (
            <div
              key={emote.name}
              onClick={() => clickEmoticon(emote)}
              className="dropdownemotes-emote"
            >
              <img style={{ width: "25px" }} src={emote.url} alt={emote.name} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  function renderGlobalesEmotes() {
    if (!PinkkerEmotes) return null;

    return (
      <div className="dropdownemotes-primary">
        <hr
          style={{
            border: "1px solid #4b4b4b8f",
            width: "95%",
            marginBottom: "10px",
          }}
        />
        <p
          style={{
            fontFamily: "Inter",
            color: "darkgray",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "5px",
          }}
        >
          Emotes Globales
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "scroll",
            height: "180px",
          }}
        >
          {GlobalEmotes &&
            GlobalEmotes[0]?.emotes?.map((emote) => (
              <div
                key={emote.name}
                onClick={() => clickEmoticon(emote)}
                className="dropdownemotes-emote"
              >
                <img
                  style={{ width: "25px" }}
                  src={emote.url}
                  alt={emote.name}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <>
      <ul
        className={
          click
            ? "dropdownemotes-menu clicked"
            : muro
            ? "dropdownemotes-muro-menu"
            : "dropdownemotes-menu"
        }
      >
        <div style={{ width: "100%" }} className="dropdownemotes-container">
          <div className="dropdownemotes-link">
            <div
              style={{ marginRight: "70px" }}
              className="dropdownemotes-input"
            >
              <i style={{ fontSize: "14px" }} class="fas fa-search" />
              <input placeholder="Buscar emote" type="text" />
            </div>
            <i
              // onClick={() => setClick(!click)}
              onClick={closeNavbar}
              style={{ marginLeft: "10px", cursor: "pointer" }}
              class="fas fa-times pinkker-button-more"
            ></i>
          </div>

          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "300px",
              }}
            >
              {renderPinkkerEmotes()}
              {renderGlobalesEmotes()}
            </div>
            <div className="dropdown-secondary">
              <div className="dropdown-secondary-card">
                <i style={{ fontSize: "14px" }} class="fas fa-clock" />
              </div>

              <div className="dropdown-secondary-card">
                <i style={{ fontSize: "14px" }} class="fas fa-unlock" />
              </div>

              <div className="dropdown-secondary-card">
                <i style={{ fontSize: "14px" }} class="fas fa-globe" />
              </div>
            </div>
          </div>
        </div>
      </ul>
    </>
  );
}

export default DropdownEmotes;
