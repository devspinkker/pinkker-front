import React, { useState, useEffect, useRef, useCallback } from "react";
import "./DropdownSettings.css";
import { Link } from "react-router-dom";

import axios from "axios";
import { useSelector } from "react-redux";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
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

function DropdownSettings({ streamer, closeNavbar, quality, changeQuality }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;

  const [type, setType] = useState(0);

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);

  function popupwindow(url, title, w, h) {
    var y = window.outerHeight / 2 + window.screenY - h / 2;
    var x = window.outerWidth / 2 + window.screenX - w / 2;
    return window.open(
      url,
      title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        y +
        ", left=" +
        x
    );
  }

  function getDropdownSettings() {
    if (type === 0) {
      return (
        <div>
          <li onClick={handleClick}>
            <div
              style={{
                fontFamily: "Poppins",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="dropdownsettings-link"
              onClick={closeNavbar}
            >
              Cerrar
              <i style={{ marginLeft: "10px" }} class="fas fa-times" />
            </div>
          </li>

          <hr style={{ border: "1px solid #4b4b4b8f", margin: "10px auto" }} />

          {/* <li onClick={() => setType(1)}>
            <div className="dropdownsettings-content">
              <div>
                <h4>Calidad</h4>
              </div>
              <div>
                <h4 style={{ color: "#ff60b2" }}>
                  {quality}{" "}
                  <i
                    style={{ color: "#ededed" }}
                    class="fas fa-chevron-right"
                  ></i>
                </h4>
              </div>
            </div>
          </li> */}

          <li>
            <div className="dropdownsettings-content">
              <div>
                <h4>Opciones Avanzadas</h4>
              </div>

              <div>
                <h4>
                  <i class="fas fa-chevron-right"></i>
                </h4>
              </div>
            </div>
          </li>

          <li
            onClick={() =>
              popupwindow(
                `http://localhost:3000/${streamer}/popout/player`,
                "Player",
                1280,
                720
              )
            }
          >
            <div className="dropdownsettings-content">
              <div>
                <h4>Ventana emergente</h4>
              </div>

              <div>
                <h4>
                  <i class="fas fa-chevron-right"></i>
                </h4>
              </div>
            </div>
          </li>

          <li>
            <div className="dropdownsettings-content">
              <div>
                <h4>Informar de un problema</h4>
              </div>

              <div>
                <h4>
                  <i class="fas fa-chevron-right"></i>
                </h4>
              </div>
            </div>
          </li>

          <li>
            <div className="dropdownsettings-content">
              <div>
                <h4>Ver atajos del teclado</h4>
              </div>

              <div>
                <h4>
                  <i class="fas fa-chevron-right"></i>
                </h4>
              </div>
            </div>
          </li>
        </div>
      );
    }

    if (type === 1) {
      return (
        <div>
          <li onClick={() => setType(0)}>
            <div className="dropdownsettings-content">
              <div>
                <h4>
                  <i
                    style={{ marginRight: "5px" }}
                    class="fas fa-chevron-left"
                  ></i>{" "}
                  Calidad de video
                </h4>
              </div>
            </div>
          </li>

          <hr style={{ border: "1px solid #4b4b4b8f", margin: "10px auto" }} />

          <li onClick={() => changeQuality("auto")}>
            <div className="dropdownsettings-content">
              <div
                className="dropdownsettings-radio"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input type="radio" />
                <span style={{ marginLeft: "5px" }}>Automática</span>
              </div>
            </div>
          </li>
          <li onClick={() => changeQuality("1080")}>
            <div className="dropdownsettings-content">
              <div
                className="dropdownsettings-radio"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input type="radio" checked={quality === "1080"} />
                <span style={{ marginLeft: "5px" }}>1080p</span>
              </div>
            </div>
          </li>
          <li onClick={() => changeQuality("720")}>
            <div className="dropdownsettings-content">
              <div
                className="dropdownsettings-radio"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input type="radio" checked={quality === "720"} />
                <span style={{ marginLeft: "5px" }}>720p</span>
              </div>
            </div>
          </li>

          <li onClick={() => changeQuality("480")}>
            <div className="dropdownsettings-content">
              <div
                className="dropdownsettings-radio"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input type="radio" checked={quality === "480"} />
                <span style={{ marginLeft: "5px" }}>480p</span>
              </div>
            </div>
          </li>

          <li onClick={() => changeQuality("360")}>
            <div className="dropdownsettings-content">
              <div
                className="dropdownsettings-radio"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input type="radio" checked={quality === "360"} />
                <span style={{ marginLeft: "5px" }}>360p</span>
              </div>
            </div>
          </li>
        </div>
      );
    }
  }

  return (
    <>
      <ul
        ref={divRef}
        className={
          click ? "dropdownsettings-menu clicked" : "dropdownsettings-menu"
        }
      >
        <div className="dropdownsettings-container">
          {getDropdownSettings()}
        </div>
      </ul>
    </>
  );
}

export default DropdownSettings;
