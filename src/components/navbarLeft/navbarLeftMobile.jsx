import React, { useState } from "react";

import Auth from "../auth/Auth";
import "./navbarLeftMobile.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavbarLeftMobile({ streamer }) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const [dropdownLang, setDropdownLang] = useState(false);
  const [dropdownAccount, setDropdownAccount] = useState(false);

  const [active, setActive] = useState(0);
  const onMouseEnterAccount = () => {
    if (dropdownAccount === true) {
      setDropdownAccount(false);
    } else {
      setDropdownLang(false);
      setDropdownAccount(true);
    }
  };

  return (
    <div className="navbar-left-mobile">
      <div className="navbar-left-mobile-container">
        <div onClick={() => setActive(1)} className="navbar-left-mobile-card">
          <Link
            style={{
              textDecoration: "none",
              color: active === 1 ? "#ff60b2" : "white",
            }}
            to="/"
          >
            <i
              style={{ position: "relative", fontSize: "28px" }}
              class="fa fa-home"
            />
            <h1
              style={{
                fontSize: "22px",
                fontFamily: "Cairo",
                position: "relative",
                top: "4px",
              }}
            >
              Home
            </h1>
          </Link>
        </div>
        <div onClick={() => setActive(2)} className="navbar-left-mobile-card">
          <Link
            style={{
              textDecoration: "none",
              color: active === 2 ? "#ff60b2" : "white",
            }}
            to="/plataform/explore"
          >
            <i
              style={{ position: "relative", fontSize: "28px" }}
              class="fa fa-search"
            />
            <h1
              style={{
                fontSize: "22px",
                fontFamily: "Cairo",
                position: "relative",
                top: "4px",
              }}
            >
              Explorar
            </h1>
          </Link>
        </div>
        <div onClick={() => setActive(4)} className="navbar-left-mobile-card">
          <Link
            style={{
              textDecoration: "none",
              color: active === 4 ? "#ff60b2" : "white",
            }}
            to="/plataform/clips"
          >
            <i
              style={{ position: "relative", fontSize: "28px" }}
              class="fas fa-film"
            />
            <h1
              style={{
                fontSize: "22px",
                fontFamily: "Cairo",
                position: "relative",
                top: "4px",
              }}
            >
              Clips
            </h1>
          </Link>
        </div>
        <div onClick={() => setActive(5)} className="navbar-left-mobile-card">
          <Link
            style={{
              textDecoration: "none",
              color: active === 5 ? "#ff60b2" : "white",
            }}
            to="/plataform/muro"
          >
            <i
              style={{ position: "relative", fontSize: "28px" }}
              class="fas fa-edit"
            />
            <h1
              style={{
                fontSize: "22px",
                fontFamily: "Cairo",
                position: "relative",
                top: "4px",
              }}
            >
              Muro
            </h1>
          </Link>
        </div>
        {/* <div onClick={() => setActive(3)} style={{ backgroundColor: active === 3 && "#5f5f5f8f" }} className="navbar-left-mobile-card">
          <Link style={{ textDecoration: "none", color: active === 3 ? "#ff60b2" : "white" }} to="/plataform/tendency">
            <i style={{ position: "relative", fontSize: "28px" }} class="fas fa-fire" />
            <h1 style={{ fontSize: "22px", fontFamily: "Cairo", position: "relative", top: "4px" }}>Tendencias</h1>
          </Link>
        </div> */}

        {isLogged && (
          <div className="navbar-left-mobile-card">
            <Link
              style={{
                textDecoration: "none",
                color: active === 5 ? "#ff60b2" : "white",
              }}
              to={`/${streamer}`}
            >
              <img
                src={user.avatar}
                alt=""
                style={{ width: "70px", height: "70px", borderRadius: "50%" }}
              />
              {/* <h1 style={{ fontSize: "22px", fontFamily: "Cairo" }}>Perfil</h1>               */}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
