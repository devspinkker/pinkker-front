import React, { useState, useEffect } from "react";
import "./DropdownEmotes.css";
import { useSelector } from "react-redux";

import {
  GetEmoteUserandType,
  GetGlobalEmotes,
  GetPinkkerEmotes,
} from "../../../../../services/backGo/Emotes";

function DropdownEmotes({
  ImgStreamer,
  closeNavbar,
  clickEmoticon,
  muro,
  idStreamer,
  SubStateAct,
}) {
  const [click, setClick] = useState(false);
  const [PinkkerEmotes, setPinkkerEmotes] = useState(null);
  const [GlobalEmotes, setGlobalEmotes] = useState(null);
  const [GetEmotesidStreamer, setGetEmotesidStreamer] = useState(null);
  const [GetEmotesSubsidStreamer, setGetEmotesSubsidStreamer] = useState(null);
  const [selectedEmoteType, setSelectedEmoteType] = useState("Pinkker");

  const token = window.localStorage.getItem("token");
  const fetchData = async () => {
    const ress = await GetPinkkerEmotes();
    if (ress.message === "ok" && ress.data !== null) {
      setPinkkerEmotes(ress.data);
    }
    const ressGetPinkkerEmotes = await GetGlobalEmotes();

    if (ressGetPinkkerEmotes.message === "ok" && ressGetPinkkerEmotes.data) {
      setGlobalEmotes(ressGetPinkkerEmotes.data);
    }

    const responsesubs = await GetEmoteUserandType(idStreamer, "subs", token);
    if (responsesubs != null && responsesubs.data) {
      setGetEmotesSubsidStreamer(responsesubs.data);
    }
    const responseFree = await GetEmoteUserandType(idStreamer, "", token);
    if (responseFree != null && responseFree.data) {
      setGetEmotesidStreamer(responseFree.data);
    }
  };

  useEffect(() => {
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
    if (!GlobalEmotes) return null;

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
          {GlobalEmotes[0]?.emotes?.map((emote) => (
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

  function renderGlobalesEmotesidStreamers() {
    if (!GetEmotesidStreamer) return null;

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
          Emotes libres del canal
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "scroll",
            height: "180px",
          }}
        >
          {GetEmotesidStreamer?.emotes?.map((emote) => (
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

  function renderGlobalesEmotesidStreamersSubs() {
    if (!GetEmotesSubsidStreamer) return null;

    return (
      <div className="dropdownemotes-primary">
        <hr
          style={{
            border: "1px solid #4b4b4b8f",
            width: "95%",
            // marginBottom: "10px",
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
          Emotes de subs
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "scroll",
            height: "180px",
          }}
        >
          {GetEmotesSubsidStreamer?.emotes?.map((emote) => (
            <div
              key={emote.name}
              onClick={SubStateAct ? () => clickEmoticon(emote) : undefined}
              className="dropdownemotes-emote"
              style={{ position: "relative" }}
            >
              <img style={{ width: "25px" }} src={emote.url} alt={emote.name} />
              {!SubStateAct && (
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "5px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.75 6.25V1H4.75V6.25H3V15H13.5V6.25H11.75ZM6.5 2.75H10V6.25H6.5V2.75ZM10.4375 10.625H9.125V12.375H7.375V10.625H6.0625V8.875H10.4375V10.625Z" />
                  </svg>
                </div>
              )}
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
            {/* <div
              style={{ marginRight: "70px" }}
              className="dropdownemotes-input"
            >
              <i style={{ fontSize: "14px" }} className="fas fa-search" />
              <input placeholder="Buscar emote" type="text" />
            </div> */}
            <i
              onClick={closeNavbar}
              style={{ marginLeft: "10px", cursor: "pointer" }}
              className="fas fa-times pinkker-button-more"
            ></i>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "10px",
            }}
          >
            <button
              className={"DropDownButton"}
              style={{
                background:
                  selectedEmoteType === "Pinkker" ? "#4c0b39" : "none",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedEmoteType("Pinkker");
              }}
            >
              <i style={{ fontSize: "14px" }} className="fas fa-clock" />
            </button>
            <button
              style={{
                background:
                  selectedEmoteType === "Globales" ? "#4c0b39" : "none",
              }}
              className="DropDownButton"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedEmoteType("Globales");
              }}
            >
              <i style={{ fontSize: "14px" }} className="fas fa-globe" />
            </button>
            <button
              style={{
                background:
                  selectedEmoteType === "Streamers" ? "#4c0b39" : "none",
              }}
              className="DropDownButton"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedEmoteType("Streamers");
              }}
            >
              <img src={ImgStreamer} alt="imgStreamer" />
            </button>
            <button
              style={{
                background:
                  selectedEmoteType === "StreamersSubs" ? "#4c0b39" : "none",
              }}
              className="DropDownButton"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedEmoteType("StreamersSubs");
              }}
            >
              <i style={{ fontSize: "14px" }} className="fas fa-unlock" />
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {selectedEmoteType === "Pinkker" && renderPinkkerEmotes()}
              {selectedEmoteType === "Globales" && renderGlobalesEmotes()}
              {selectedEmoteType === "Streamers" &&
                renderGlobalesEmotesidStreamers()}
              {selectedEmoteType === "StreamersSubs" &&
                renderGlobalesEmotesidStreamersSubs()}
            </div>
            {/* <div className="dropdown-secondary">
              <div className="dropdown-secondary-card">
                <i style={{ fontSize: "14px" }} className="fas fa-clock" />
              </div>
              <div className="dropdown-secondary-card">
                <i style={{ fontSize: "14px" }} className="fas fa-unlock" />
              </div>
              <div className="dropdown-secondary-card">
                <i style={{ fontSize: "14px" }} className="fas fa-globe" />
              </div>
            </div> */}
          </div>
        </div>
      </ul>
    </>
  );
}

export default DropdownEmotes;
