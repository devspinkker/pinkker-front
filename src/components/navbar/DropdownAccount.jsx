import React, { useState, useEffect, useRef, useCallback } from "react";
import "./DropdownAccount.css";
import { Link } from "react-router-dom";

import Switch from "@mui/material/Switch";

import { styled } from "@mui/material/styles";
import { compradePixeles } from "../../services/backGo/user";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      if (event.target.parentElement.className === "navbar-image-avatar") {
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
const comprarPixeles = async () => {
  try {
    let token = window.localStorage.getItem("token");
    const res = await compradePixeles(token);
    if (res?.init_point) {
      window.location.href = res?.init_point;
    }
  } catch (error) {
    console.log(error);
  }
};

function DropdownAccount({ closeNavbar, callback, toggleLang, user }) {
  const [click, setClick] = useState(false);

  const divRef = useRef();
  const handler = useCallback(() => {
    closeNavbar();
  }, []);
  useOnClickOutside(divRef, handler, closeNavbar);
  const handleLogout = async () => {
    // window.location.href = "/";
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("_id");
    window.localStorage.removeItem("avatar");
  };

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16,
      },
      "&:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      "&:after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  return (
    <>
      <ul
        ref={divRef}
        className={
          click ? "dropdownaccount-menu clicked" : "dropdownaccount-menu"
        }
      >
        <div className="dropdowncomunidad-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to={"/" + user?.NameUser} onClick={closeNavbar}>
              <img
                style={{
                  width: "45px",
                  boxShadow: "0.5px 0.5px 7px 0.5px #f36196",
                  borderRadius: "100px",
                  marginLeft: "15px",
                  marginRight: "10px",
                  marginTop: "10px",
                }}
                src={user.Avatar}
                alt=""
              />
            </Link>

            <div style={{ textAlign: "justify" }}>
              <Link
                style={{ textDecoration: "none" }}
                to={"/" + user.NameUser}
                onClick={closeNavbar}
              >
                <h3
                  className="droppdownaccount-name"
                  style={{
                    marginLeft: "5px",
                    fontSize: "14px",
                    marginTop: "15px",
                  }}
                >
                  {user.NameUser}
                </h3>
              </Link>

              <Link
                onClick={closeNavbar}
                style={{ textDecoration: "none" }}
                to={"/" + user.NameUser + "/settings"}
              >
                <h4
                  className="dropdownaccount-pink-text-hover"
                  style={{
                    marginLeft: "5px",
                    color: "#f36196",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  Ajustes de tu cuenta
                </h4>
              </Link>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <li>
            <Link
              className="dropdownaccount-link"
              to={"/" + user.NameUser}
              onClick={closeNavbar}
            >
              <i style={{ marginRight: "10px" }} class="fas fa-user"></i>
              Tu canal
            </Link>
          </li>

          <li>
            <a
              className="dropdownaccount-link"
              href={"/" + user.NameUser + "/dashboard/stream"}
              onClick={closeNavbar}
            >
              <i style={{ marginRight: "10px" }} class="fas fa-sliders-h"></i>
              Panel de control del creador
            </a>
          </li>

          <li>
            <a
              className="dropdownaccount-link"
              /*href="/plataform/achievement"*/ onClick={closeNavbar}
            >
              <i style={{ marginRight: "10px" }} class="fas fa-trophy"></i>
              Logros y recompensas
            </a>
          </li>

          <div
            style={{
              width: "100%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <li>
            <Link
              className="dropdownaccount-link"
              to="/plataform/cartera"
              onClick={closeNavbar}
            >
              <i style={{ marginRight: "10px" }} class="fas fa-wallet"></i>
              Cartera
            </Link>
          </li>

          <li onClick={comprarPixeles}>
            <a
              className="dropdownaccount-link"
              oncl
              /*to="/plataform/subscriptions"*/ onClick={closeNavbar}
            >
              <i style={{ marginRight: "15px" }} class="fas fa-dollar-sign"></i>
              Compras y suscripciones
            </a>
          </li>

          <div
            style={{
              width: "100%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <li onClick={() => toggleLang()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                paddingTop: "15px",
                paddingBottom: "15px",
                width: "100%",
              }}
            >
              <i
                style={{ marginRight: "10px", color: "white" }}
                class="fas fa-globe"
              ></i>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "white" }}>Idioma</p>
                <i
                  style={{ color: "white", marginRight: "15px" }}
                  class="fas fa-chevron-right"
                />
              </div>
            </div>
          </li>

          {
            <li>
              <Link className="dropdownaccount-link" onClick={handleLogout}>
                <i
                  style={{ marginRight: "10px" }}
                  class="fas fa-sign-out-alt"
                ></i>{" "}
                Cerrar sesión
              </Link>
            </li>
          }
        </div>
      </ul>
    </>
  );
}

export default DropdownAccount;
