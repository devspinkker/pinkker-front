import React, { useState, useEffect } from "react";
import "./Emotes.css";
import {
  GetGlobalEmotes,
  GetPinkkerEmotes,
  UpdateEmoteAut,
} from "../../services/backGo/user";

export default function Emotes({ Code }) {
  const [PinkkerEmotes, setPinkkerEmotes] = useState(null);
  const [GlobalEmotes, setGlobalEmotes] = useState(null);
  const [newEmoteName, setNewEmoteName] = useState("");
  const [newEmoteUrl, setNewEmoteUrl] = useState("");
  const [updatedEmoteName, setUpdatedEmoteName] = useState(""); // Nuevo estado para almacenar el nombre actualizado
  const [expandedPinkker, setExpandedPinkker] = useState(false); // Estado para controlar la expansión del contenido de Pinkker
  const [expandedGlobal, setExpandedGlobal] = useState(false); // Estado para controlar la expansión del contenido global
  const token = window.localStorage.getItem("token");

  const GetEmotes = async () => {
    if (token) {
      const resPinkker = await GetPinkkerEmotes();
      if (resPinkker.message === "ok") {
        setPinkkerEmotes(resPinkker.data[0]);
      } else {
        console.error("Failed to fetch Pinkker emotes", resPinkker);
      }

      const resGlobal = await GetGlobalEmotes();
      if (resGlobal.message === "ok") {
        setGlobalEmotes(resGlobal.data[0]);
      } else {
        console.error("Failed to fetch Global emotes", resGlobal);
      }
    }
  };

  const updateEmotes = async (updatedEmotes, type) => {
    const res = await UpdateEmoteAut({ ...updatedEmotes, Code }, token);
    if (res.message === "ok") {
      if (type === "Pinkker") {
        setPinkkerEmotes(res.data);
      } else if (type === "Global") {
        setGlobalEmotes(res.data);
      }
    } else {
      console.error("Failed to update emotes", res);
    }
  };

  const handleDeleteEmote = async (emoteIndex, type) => {
    const updatedEmotes =
      type === "Pinkker" ? { ...PinkkerEmotes } : { ...GlobalEmotes };
    updatedEmotes.emotes.splice(emoteIndex, 1);
    await updateEmotes(updatedEmotes, type);
  };

  const handleUpdateEmote = async (updatedEmote, emoteIndex, type) => {
    const updatedEmotes =
      type === "Pinkker" ? { ...PinkkerEmotes } : { ...GlobalEmotes };
    updatedEmotes.emotes[emoteIndex] = updatedEmote;
    await updateEmotes(updatedEmotes, type);
  };

  const handleAddEmote = async (type) => {
    const newEmote = {
      name: newEmoteName,
      url: newEmoteUrl,
    };
    const updatedEmotes =
      type === "Pinkker" ? { ...PinkkerEmotes } : { ...GlobalEmotes };
    updatedEmotes.emotes.push(newEmote);
    await updateEmotes(updatedEmotes, type);
    setNewEmoteName("");
    setNewEmoteUrl("");
  };

  useEffect(() => {
    GetEmotes();
  }, []);

  return (
    <div className="emotes-container">
      <h1
        style={{
          color: "#fff",
        }}
      >
        Emotes
      </h1>

      {PinkkerEmotes && (
        <div key={PinkkerEmotes.id}>
          <h2
            style={{
              color: "#fff",
            }}
          >
            {PinkkerEmotes.name}
          </h2>
          <div className="emotes-grid">
            {expandedPinkker &&
              PinkkerEmotes.emotes.map((emote, index) => (
                <div key={index} className="emote-card">
                  <span>{emote.name}</span>
                  <img src={emote.url} alt={emote.name} />
                  <div className="emote-buttons">
                    <button onClick={() => handleDeleteEmote(index, "Pinkker")}>
                      Delete
                    </button>
                    <input
                      type="text"
                      value={updatedEmoteName}
                      onChange={(e) => setUpdatedEmoteName(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleUpdateEmote(
                          { ...emote, name: updatedEmoteName },
                          index,
                          "Pinkker"
                        )
                      }
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={() => setExpandedPinkker(!expandedPinkker)}>
            {!expandedPinkker ? "Expandir Emotes" : "Comprimir Emotes"}
          </button>
          {expandedPinkker && (
            <div>
              <h3
                style={{
                  color: "#fff",
                }}
              >
                Add New Emote
              </h3>
              <input
                type="text"
                placeholder="Emote Name"
                value={newEmoteName}
                onChange={(e) => setNewEmoteName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Emote URL"
                value={newEmoteUrl}
                onChange={(e) => setNewEmoteUrl(e.target.value)}
              />
              <button onClick={() => handleAddEmote("Pinkker")}>
                Add Emote
              </button>
            </div>
          )}
        </div>
      )}

      {GlobalEmotes && (
        <div key={GlobalEmotes.id}>
          <h2
            style={{
              color: "#fff",
            }}
          >
            {GlobalEmotes.name}
          </h2>
          <div className="emotes-grid">
            {expandedGlobal &&
              GlobalEmotes.emotes.map((emote, index) => (
                <div key={index} className="emote-card">
                  <span>{emote.name}</span>
                  <img src={emote.url} alt={emote.name} />
                  <div className="emote-buttons">
                    <button onClick={() => handleDeleteEmote(index, "Global")}>
                      Delete
                    </button>
                    <input
                      type="text"
                      value={updatedEmoteName}
                      onChange={(e) => setUpdatedEmoteName(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleUpdateEmote(
                          { ...emote, name: updatedEmoteName },
                          index,
                          "Global"
                        )
                      }
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={() => setExpandedGlobal(!expandedGlobal)}>
            {!expandedGlobal ? "Expandir Emotes" : "Comprimir Emotes"}
          </button>
          {expandedGlobal && (
            <div>
              <h3
                style={{
                  color: "#fff",
                }}
              >
                Add New Emote
              </h3>
              <input
                type="text"
                placeholder="Emote Name"
                value={newEmoteName}
                onChange={(e) => setNewEmoteName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Emote URL"
                value={newEmoteUrl}
                onChange={(e) => setNewEmoteUrl(e.target.value)}
              />
              <button onClick={() => handleAddEmote("Global")}>
                Add Emote
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
