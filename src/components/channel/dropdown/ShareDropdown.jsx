import React, { useState } from "react";
import "./ShareDropdown.css";
import { useSelector } from "react-redux";

function ShareDropdown({ closeNavbar, title, streamer, clip, clipId }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;

  const [type, setType] = useState(0);

  let twitterLink = `https://twitter.com/intent/tweet?text=${title}&url=https://www.pinkker.tv/${streamer}`;
  let facebookLink = `https://www.facebook.com/sharer/sharer.php?u=https://www.pinkker.tv/${streamer}`;
  let whatsappLink = `https://api.whatsapp.com/send?text=${title} https://www.pinkker.tv/${streamer}`;
  let instagramStoriesLink = `https://www.instagram.com/stories/create/?title=${encodeURIComponent(
    title
  )}&url=https://www.pinkker.tv/${streamer}`;

  if (clip === true) {
    twitterLink = `https://twitter.com/intent/tweet?text=${title}&url=https://www.pinkker.tv/clip/${clipId}`;
    facebookLink = `https://www.facebook.com/sharer/sharer.php?u=https://www.pinkker.tv/clip/${clipId}`;
    whatsappLink = `https://api.whatsapp.com/send?text=${title} https://www.pinkker.tv/clip/${clipId}`;
    instagramStoriesLink = `https://www.instagram.com/stories/create/?title=${encodeURIComponent(
      title
    )}&url=https://www.pinkker.tv/clip/${clipId}`;
  }

  function copy() {
    const el = document.createElement("textarea");
    if (clip === true) {
      el.value = `https://www.pinkker.tv/clip/${clipId}`;
    } else {
      el.value = `https://www.pinkker.tv/${streamer}`;
    }
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  function getDropdownShare() {
    if (type === 0) {
      return (
        <div>
          <li
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
            onClick={handleClick}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="dropdownchatconfig-link"
              onClick={closeNavbar}
            >
              Cerrar
              <i style={{ marginLeft: "10px" }} className="fas fa-times"></i>
            </div>
          </li>

          <hr
            style={{
              border: "1px solid #4b4b4b8f",
              marginBottom: "10px",
              width: "100%",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "95%",
              margin: "10px auto",
              marginBottom: "10px",
            }}
          >
            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={twitterLink}
            >
              <li>
                <div className="dropdownshare-content">
                  <i
                    style={{ fontSize: "44px", color: "lightblue" }}
                    className="fab fa-twitter"
                  ></i>
                  <p style={{ marginTop: "5px" }}>Twitter</p>
                </div>
              </li>
            </a>

            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={facebookLink}
            >
              <li>
                <div className="dropdownshare-content">
                  <i
                    style={{ fontSize: "44px", color: "#4267B2" }}
                    className="fab fa-facebook"
                  ></i>
                  <p style={{ marginTop: "5px" }}>Facebook</p>
                </div>
              </li>
            </a>

            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={whatsappLink}
            >
              <li>
                <div className="dropdownshare-content">
                  <i
                    style={{ fontSize: "44px", color: "#25D366" }}
                    className="fab fa-whatsapp"
                  ></i>
                  <p style={{ marginTop: "5px" }}>WhatsApp</p>
                </div>
              </li>
            </a>

            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={instagramStoriesLink}
            >
              <li>
                <div className="dropdownshare-content">
                  <i
                    style={{ fontSize: "44px", color: "#bc2a8d" }}
                    className="fab fa-instagram"
                  ></i>
                  <p style={{ marginTop: "5px" }}>Instagram Stories</p>
                </div>
              </li>
            </a>

            <li onClick={() => copy()}>
              <div className="dropdownshare-content">
                <i
                  style={{
                    fontSize: "40px",
                    color: "darkgray",
                    marginBottom: "2px",
                  }}
                  className="fas fa-copy"
                ></i>
                <p style={{ marginTop: "5px" }}>Copiar</p>
              </div>
            </li>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <ul
        style={{ left: clip === true && "0%" }}
        className={click ? "dropdownshare-menu clicked" : "dropdownshare-menu"}
      >
        <div style={{ width: "99%" }} className="dropdownshare-container">
          {getDropdownShare()}
        </div>
      </ul>
    </>
  );
}

export default ShareDropdown;
