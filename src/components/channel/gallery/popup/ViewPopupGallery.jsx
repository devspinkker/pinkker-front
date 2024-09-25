import React, { useState, useEffect } from "react";
import "./ViewPopupGallery.css";
import { useSelector, useDispatch } from "react-redux";
import { useNotification } from "../../../Notifications/NotificationProvider";
import {
  getAllCommentsInVideo,
  addComment,
} from "../../../../services/commentsGallery";
import { like, userLikeGallery } from "../../../../services/gallery";
import { ScaleLoader } from "react-spinners";
import EmojiPicker, { Theme } from "emoji-picker-react";

export default function ViewPopupGallery({ image, gallery, closePopup }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const alert = useNotification();
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(null);
  const [likes, setLikes] = useState(null);
  const [dropdownEmotes, setDropdownEmotes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLikes(gallery.likesCount);
      const dataLiked = await userLikeGallery(token, gallery._id);
      if (dataLiked != null && dataLiked != undefined) {
        setIsLiked(dataLiked.data);
      }
      const data = await getAllCommentsInVideo(gallery._id);
      if (data != null && data != undefined) {
        setComments(data);
      }
    };
    fetchData();
  }, []);

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
    await like(token, gallery._id);
  };

  function createComment() {
    if (comment.trim() !== "") {
      setDropdownEmotes(false);
      addComment(token, user.name, comment, gallery._id, 1).then((res) => {
        if (res.data != null && res.data != undefined) {
          setComment("");
          handleUpdate();
        }
      });
    }
  }

  function handleUpdate() {
    const fetchData = async () => {
      const data = await getAllCommentsInVideo(gallery._id);
      if (data != null && data != undefined) {
        setComments(data);
      }
    };
    fetchData();
  }

  function clickEmoji(e) {
    setComment(comment + e.emoji);
  }

  function timeSince(date) {
    const date2 = new Date(date).getTime();
    const seconds = Math.floor((new Date().getTime() - date2) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return Math.floor(seconds) + " segundos";
  }

  const onMouseEnterEmotes = () => {
    setDropdownEmotes(!dropdownEmotes);
  };

  return (
    <div className="popupgallery-view-secondary">
      <div className="popupgallery-view-secondary-title">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              width: "30px",
              borderRadius: "100px",
              marginRight: "15px",
            }}
            src={user.avatar}
          />
          <h3>{user.name}</h3>
        </div>
        <i className="fas fa-ellipsis-h" />
      </div>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#ffffff1a",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      />
      <div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <img
            style={{
              width: "30px",
              borderRadius: "100px",
              marginRight: "15px",
            }}
            src={user.avatar}
          />
          <div style={{ textAlign: "left" }}>
            <h4>{user.name}</h4>
            <p style={{ marginTop: "5px" }}>
              Esto es una descripción de una publicación
            </p>
            <p
              style={{
                marginTop: "10px",
                color: "lightgray",
                fontSize: "12px",
              }}
            >
              1 día
            </p>
          </div>
        </div>
      </div>

      <div className="popupgallery-view-secondary-comments-container">
        {comments != null ? (
          comments.map((comment) => (
            <div
              className="popupgallery-view-secondary-comments-card"
              key={comment._id}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  style={{
                    width: "30px",
                    borderRadius: "100px",
                    marginRight: "15px",
                  }}
                  src={comment.avatar}
                />
                <h3>{comment.name}</h3>
              </div>
              <p>{comment.comment}</p>
              <p>{timeSince(comment.createdAt)}</p>
            </div>
          ))
        ) : (
          <div className="popupgallery-loading-comments">
            <ScaleLoader color="#f36197d7" />
          </div>
        )}
      </div>

      <div className="popupgallery-view-secondary-comment-input">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="Añadir un comentario..."
        />
        <i onClick={() => createComment()} className="fas fa-paper-plane" />
        <i onClick={onMouseEnterEmotes} className="fas fa-smile" />
      </div>
      {dropdownEmotes && (
        <div className="popupgallery-emotes-dropdown">
          <EmojiPicker
            theme={Theme.DARK}
            height="300px"
            width="300px"
            onEmojiClick={(e) => clickEmoji(e)}
          />
        </div>
      )}
    </div>
  );
}
