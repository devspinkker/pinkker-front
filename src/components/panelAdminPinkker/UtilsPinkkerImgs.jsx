import React, { useState, useEffect } from "react";
import "./Emotes.css";
import {
  GetPinkkerEmotes,
  GetGlobalEmotes,
  AddEmoteAut,
  DeleteEmoteAut,
  AddImgUtilsAut
} from "../../services/backGo/Emotes";

export default function UtilsPinkkerImgs({ Code }) {
  const [PinkkerEmotes, setPinkkerEmotes] = useState({ emotes: [], id: null });
  const [GlobalEmotes, setGlobalEmotes] = useState({ emotes: [], id: null });
  const [newEmoteName, setNewEmoteName] = useState("");
  const [newEmoteImage, setNewEmoteImage] = useState(null);
  const [updatedEmoteName, setUpdatedEmoteName] = useState("");
  const [expandedPinkker, setExpandedPinkker] = useState(false);
  const [expandedGlobal, setExpandedGlobal] = useState(false);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    const fetchEmotes = async () => {
      if (token) {
        const resPinkker = await GetPinkkerEmotes();
        if (resPinkker.message === "ok") {
          setPinkkerEmotes(resPinkker.data[0]);
        } else {
          console.error("Failed to fetch pinkker emotes", resPinkker);
        }

        const resGlobal = await GetGlobalEmotes();
        if (resGlobal.message === "ok") {
          setGlobalEmotes(resGlobal.data[0]);
        } else {
          console.error("Failed to fetch global emotes", resGlobal);
        }
      }
    };

    fetchEmotes();
  }, [token]);

  const handleDeleteEmote = async (name, emoteIndex, type, id) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("Code", Code);
      formData.append("typeEmote", type);
      formData.append("id", id);

      const res = await DeleteEmoteAut(formData, token);
      if (res.message === "OK") {
        if (type === "pinkker") {
          const updatedPinkkerEmotes = { ...PinkkerEmotes };
          updatedPinkkerEmotes.emotes.splice(emoteIndex, 1);
          setPinkkerEmotes(updatedPinkkerEmotes);
        } else if (type === "global") {
          const updatedGlobalEmotes = { ...GlobalEmotes };
          updatedGlobalEmotes.emotes.splice(emoteIndex, 1);
          setGlobalEmotes(updatedGlobalEmotes);
        }
      } else {
        console.error("Failed to delete emote", res);
      }
    } catch (error) {
      console.error("Error deleting emote", error);
    }
  };

  const handleAddEmote = async (type, id) => {
    try {
      const formData = new FormData();
      formData.append("emoteImage", newEmoteImage);
      formData.append("name", newEmoteName);
      formData.append("Code", Code);
      formData.append("type", type); // Adjust if typeEmote is necessary
      formData.append("id", id); // Adjust if typeEmote is necessary

      const res = await AddImgUtilsAut(formData, token);
      if (res.message === "OK") {
        if (type === "pinkker") {
          setPinkkerEmotes(res.data);
        } else if (type === "global") {
          setGlobalEmotes(res.data);
        }
        setNewEmoteName("");
        setNewEmoteImage(null);
      } else {
        console.error("Failed to add emote", res);
      }
    } catch (error) {
      console.error("Error adding emote", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        console.error("Image size exceeds limit (1MB)");
        return;
      }
      setNewEmoteImage(file);
    }
  };

  return (
    <div className="emotes-container">

      <div key={PinkkerEmotes.id}>
  
        <div className="emotes-grid">
          {expandedPinkker &&
            PinkkerEmotes.emotes.map((emote, index) => (
              <div key={index} className="emote-card">
                <span>{emote.name}</span>
                <img src={emote.url} alt={emote.name} />
                <div className="emote-buttons">
                  <button
                    onClick={() =>
                      handleDeleteEmote(
                        emote.name,
                        index,
                        "pinkker",
                        PinkkerEmotes.id
                      )
                    }
                  >
                    Delete
                  </button>
                  <input
                    type="text"
                    value={updatedEmoteName}
                    onChange={(e) => setUpdatedEmoteName(e.target.value)}
                  />
                </div>
              </div>
            ))}
        </div>
        <button onClick={() => setExpandedPinkker(!expandedPinkker)}>
          comprimir 
        </button>

      </div>

    </div>
  );
}
