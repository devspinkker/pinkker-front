import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NavbarLeft from "../navbarLeft/NavbarLeft";
import Search from "../navbar/search/Search";
import "./NLayout.css";
import DropdownBalance from "../navbar/balance/DropdownBalance";
import DropdownPurchase from "../navbar/purchase/DropdownPurchase";
import CanalesRecomendados from "./CanalesRecomendados";
import Auth from "../auth/Auth";
import { Link } from "react-router-dom";
import { GetAllsStreamsOnline } from "../../services/backGo/streams";
import { GrHomeRounded } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { AiOutlineMenu, AiOutlinePlayCircle } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { CgTennis } from "react-icons/cg";
import { ImDice } from "react-icons/im";
function NLayout(props) {
  const [pulse, setPulse] = useState(false);
  const [abrir, setAbrir] = useState(true);
  const [aparecer, setAparcer] = useState(false)
  const [showPopupAuth, setShowPopupAuth] = useState(false);
  const [type, setType] = useState(0);
  function clickPulsedButton() {
    setPulse(!pulse);
    props.setExpanded(!props.tyExpanded);
    setTimeout(() => {
      if (pulse) {
        setAparcer(true)
      } else {
        setAparcer(false)

      }
    }, 500)
  }

  function cerrarCanalesRecomendados() {
    setAbrir(!abrir);
  }

  function togglePopupAuth(type) {
    setShowPopupAuth(!showPopupAuth);
    setType(type);
  }
  const handleToggleExpandFollowStreams = () => {
    setTyExpandedFollowStreams(!tyExpandedFollowStreams);
  };
  const [tyExpandedFollowStreams, setTyExpandedFollowStreams] = useState(false);

  let expandido = pulse;
  const [streams, setStreams] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllsStreamsOnline();
      if (response != null && response != undefined) {

        setStreams(response.data);
      }
    };
    fetchData();
  }, [props.tyExpanded]);

  let online = streams;

  console.log('online', online);

  const [subMenu, setSubMenu] = useState(false);
  const habilitarSubMenu = (valor) => {

    setTimeout(() => {
      setSubMenu(valor);

    }, [100])
  }
  const handleLogout = async () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("_id");
    window.localStorage.removeItem("avatar");
    window.location.href = "/";
  };
  return (
    <Grid style={{ display: 'flex', flexDirection: 'row', width: '105% !important' }}>
      {/* GRID ASIDE */}
      <Grid style={{ width: props.tyExpanded ? '13%' : '4%', transition: 'width .2s ease-in-out', border: '1px solid #2a2e38', height: '100vh', backgroundColor: '#121418', position: 'sticky', top: 0 }}>

        <Grid style={{ padding: props.tyExpanded ? '.98rem 5px' : '1.72rem 5px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {/* <i
            onClick={() => clickPulsedButton()}
            style={{
              cursor: "pointer",
              fontSize: props.tyExpanded ? "30px" : "30px",
              zIndex: "1000",

              // transform: expanded === false && "rotate(90deg)",

              color: "#ededed",
            }}
            className="fas fa-bars"
          /> */}
          {/* <img  src="/images/menu.svg" className="img-bars" /> */}


          <AiOutlineMenu style={{ color: 'white', fontSize: '26px' }} onClick={() => clickPulsedButton()} className="img-bars" />

          {


            props.tyExpanded &&

            <Grid style={{ display: 'flex', textAlign: 'center', alignItems: 'center', borderRadius: '.375rem', backgroundColor: '#2a2e38', border: '1px solid #343843' }} className="contenedor-directos-cat">
              <Link style={{ textDecoration: 'none', padding: 0 }}
                to="/">
                <Grid className='button-casino' style={{ height: '3rem', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70px', background: ' url("/images/mobile-tab-background-press.svg") #2a2e38', padding: '.5rem', borderRadius: '.375rem', animation: !props.tyExpanded && "ease-in-out 1.5s linear" }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, textShadow: '0 1px 0 #000' }}>Directos </span>
                </Grid>
              </Link>

              <Link
                style={{ textDecoration: 'none', padding: 0 }}
                to="/plataform/explore?tipo=categories"
              >
                <Grid style={{ height: '3rem', color: 'white', display: 'flex', alignItems: 'center', padding: '.5rem', borderRadius: '.375rem', width: '70px', justifyContent: 'center', animation: !props.tyExpanded && "ease-in-out 1.5s linear" }} className='button-sports'>
                  <span style={{ fontSize: '12px', fontWeight: 600, textShadow: '0 1px 0 #000' }}>Categorias</span>
                </Grid>
              </Link>
            </Grid>


          }


        </Grid>

        <Grid
          style={{
            padding: "1.3rem 15px",
            border: "1px solid #2a2e38",
            borderRight: "none",
            borderLeft: "none",
            width: "100%",
            display: "flex",
            flexDirection: props.tyExpanded ? "row" : "column",
            alignItems: "center",
            justifyContent: "space-around",
            gap: '15px'
          }}
        >
          {!props.tyExpanded && (

            <Grid style={{ display: "flex", flexDirection: "column" }}>
              <Grid
                style={{
                  height: "100%",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgb(119, 23, 255)",
                  borderTopLeftRadius: ".375rem",
                  borderTopRightRadius: ".375rem",
                  padding: '.4rem',
                }}
                className="button-casino"
              >

                {/* <img src="/images/dice.svg" /> */}
                <Link
                  style={{ textDecoration: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  to="/"
                >
                  <ImDice />
                </Link>
              </Grid>


              <Grid
                style={{
                  height: "100%",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#343843",
                  borderBottomLeftRadius: ".375rem",
                  borderBottomRightRadius: ".375rem",
                  padding: '.4rem',
                }}
                className="button-sports"
              >

                {/* <img src="/images/tennis.svg" /> */}
                <Link
                  style={{ textDecoration: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  to="/plataform/explore?tipo=categories"
                >
                  <CgTennis style={{ transform: 'rotate(-45deg)', fontSize: '20px' }} />
                </Link>
              </Grid>


            </Grid>
          )}

          <Search tyExpanded={props.tyExpanded} setExpanded={props.setExpanded} />
        </Grid>

        <Grid>
          <Grid
            className="pixel-li"
                
                style={{transition: 'all 1s ease', animation: !props.tyExpanded && "ease-in-out 1s linear"}}
          >

            <div
              className={
                props.tyExpanded
                  ? "pixel-coming-soon-navbarLeft"
                  : "pixel-coming-soon-navbarLeft-noexpand"
              }
            >
              <div className="pixel-coming-soon-navbarLeft-img-pixel-container">
                <img
                  className="pixel-coming-soon-navbarLeft-img-pixel"
                  style={{
                    width: "36px",
                    padding: '5px'
                  }}
                  src="/images/pixel.png"
                />
              </div>
              {props.tyExpanded && (
                <div className="pixel-coming-soon-text-container">

                  <div className="pixel-coming-soon-text">
                    <span className="pixel-coming-soon-text-pixel">
                      Pixel
                    </span>
                    <span className="pixel-coming-soon-text-pxl">(PXL)</span>
                  </div>
                  <span className="pixel-coming-soon-navbarLeft-Comming-soon">
                    Proximamente
                  </span>
                </div>
              )}
            </div>

          </Grid>

          <Grid
            style={{
              margin: '.625rem 0',
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >


            <ul
              style={{
                listStyle: "none",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                transition: 'all 1s ease'
              }}
            >
              <Link
                style={{ textDecoration: "none" }}
                className="menu-aside-option"
                to="/"
              >
                <li
                  style={{
                    color: "white",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    width: "100% !important",
                    padding: props.tyExpanded ? "0rem 15px" : "0px",
                    justifyContent: !props.tyExpanded && "center",
                    animation: !props.tyExpanded && "ease-in-out 1s linear"

                  }}
                  className="item-li"
                >
                  <GrHomeRounded />
                  {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-home"
                  /> */}
                  {props.tyExpanded && <span>Inicio</span>}
                </li>
              </Link>
              <Link
                style={{ textDecoration: "none" }}
                className="menu-aside-option"
                to="/plataform/explore?tipo=categories"
              >
                <li
                  style={{
                    color: "white",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    padding: props.tyExpanded ? "0rem 15px" : "0px",
                    justifyContent: !props.tyExpanded && "center",
                    animation: !props.tyExpanded && "ease-in-out 1s linear"

                  }}
                  className="item-li"
                >
                  {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fa fa-search"
                  /> */}
                  <FiSearch />
                  {props.tyExpanded && <span>Explorar</span>}
                </li>
              </Link>

              <Link
                style={{ textDecoration: "none" }}
                className="menu-aside-option"
                to="/plataform/clips"
              >
                <li
                  style={{
                    color: "white",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    padding: props.tyExpanded ? "0rem 15px" : "0px",
                    justifyContent: !props.tyExpanded && "center",
                    animation: !props.tyExpanded && "ease-in-out 1s linear"

                  }}
                  className="item-li"
                >
                  <AiOutlinePlayCircle />
                  {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fas fa-film"
                  /> */}
                  {props.tyExpanded && <span>Clips</span>}
                </li>
              </Link>

              <Link
                style={{ textDecoration: "none" }}
                className="menu-aside-option"
                to="/plataform/muro"
              >
                <li
                  style={{
                    color: "white",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    padding: props.tyExpanded ? "0rem 15px" : "0px",
                    justifyContent: !props.tyExpanded && "center",
                    animation: !props.tyExpanded && "ease-in-out 3s linear"
                  }}
                  className="item-li"
                >
                  <BsChatSquareText />
                  {/* <i
                    style={{ position: "relative", fontSize: "20px" }}
                    class="fas fa-edit"
                  /> */}
                  {props.tyExpanded && <span>Muro</span>}
                </li>
              </Link>
            </ul>





          </Grid>
          <Grid
            style={{
              backgroundColor: "#080808",
              padding: streams?.length ? "0.5rem 15px" : 0,
              borderTop: "1px solid #2a2e38",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >


            {props.tyExpanded && streams?.length ? (
              <>

                <Grid
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    padding: "5px",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontFamily: "Inter",
                      fontWeight: "normal",
                      fontSize: "14px",
                    }}
                  >
                    CANALES RECOMENDADOS
                  </span>
                  <i
                    style={{
                      color: "white",
                      marginLeft: "5px",
                      backgroundColor: "#080808",
                      cursor: "pointer",
                      transform: abrir ? "rotate(0deg)" : "rotate(-180deg)",
                      transition: "all 0.5s ",
                    }}
                    class={
                      props.abrir ? "fas fa-chevron-down" : "fas fa-chevron-up"
                    }
                    onClick={() => cerrarCanalesRecomendados()}
                  />
                </Grid>

                <Grid
                  style={{
                    display: abrir ? "flex" : "none",
                    flexDirection: "column",
                    gap: "15px",
                    maxHeight: abrir ? "100% !important" : "0px !important",
                    transition: "all 0.5s ease-out",
                  }}
                >
                  {[...Array(streams?.length)].map((_, index) => (
                    <CanalesRecomendados
                      abrir={true}
                      streamer={streams[index]?.streamer ?? 'Cargando..'}
                      categorie={streams[index]?.stream_category ?? 'Cargando..'}
                      avatarStreamer={streams[index]?.streamer_avatar ?? 'Cargando..'}
                      spectators={streams[index]?.ViewerCount ?? ''}
                      title={streams[index]?.stream_title ?? 'Cargando..'}
                    />
                  ))}
                </Grid>
              </>
            ) : (
              streams?.length &&
              <>

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  style={{ margin: "0 auto" }}
                  className="icono-recomendados"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.002 3.999a2 2 0 0 1 2 2v2L18 6v8l-3.998-2v2a2 2 0 0 1-2 1.999h-8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8zM12 6H4v8h8V6z"
                    clip-rule="evenodd"
                    fill="#fff"
                  ></path>
                </svg>
                {[...Array(streams?.length)].map((_, index) => (
                  <CanalesRecomendados
                    abrir={false}
                    streamer={streams[index]?.streamer ?? 'Cargando..'}
                    categorie={streams[index]?.stream_category ?? 'Cargando..'}
                    avatarStreamer={streams[index]?.streamer_avatar ?? 'Cargando..'}
                    spectators={streams[index]?.ViewerCount ?? ''}
                    title={streams[index]?.stream_title ?? 'Cargando..'}
                  />
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* GRID NAV - MAIN */}

      <Grid
        style={{
          width: props.tyExpanded ? "85%" : "95%",
          display: "flex",
          flexDirection: "column",
          zIndex: 99999,
        }}
      >
        {!props.user.NameUser ? (
          <Grid
            style={{
              borderBottom: "1px solid #2a2e38",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 5.8rem",
              position: "sticky",
              top: 0,
              zIndex: 9999,
              backgroundColor: "#080808",
              width: "102%",
            }}
          >
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                style={{ width: "12.5%" }}
                alt=""
              />
            </Link>
            <Grid style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <h6
                onClick={() => togglePopupAuth(0)}
                className="button-navbar-login"
              >
                Login
              </h6>
              <h6
                onClick={() => togglePopupAuth(1)}
                className="button-navbar-register"
              >
                Register
              </h6>
            </Grid>
          </Grid>
        ) : (
          <Grid
            style={{
              borderBottom: "1px solid #2a2e38",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 5.8rem",
              position: "sticky",
              top: 0,
              zIndex: 9999,
              backgroundColor: "#080808",
              width: "102%",

            }}
          >
            <Link to="/" style={{ width: "200px" }}>
              <img
                src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                style={{ width: "60%" }}
                alt=""
              />
            </Link>

            <Grid style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                }}
              >
                <Link to="/plataform/cartera">
                  <div
                    style={{
                      // width: "500px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                    className="button-purchase-pixels"
                  >
                    <button>
                      {props.user?.Pixeles ?? "0"}
                      <img
                        style={{
                          width: props.isMobile ? "25px" : "17px",
                          marginRight: "-5px",
                          marginTop: "3px",
                          padding: "15px",
                        }}
                        src="/images/pixel.png"
                        alt=""
                      />{" "}
                    </button>
                  </div>
                </Link>

                <div>
                  <button
                    style={{
                      borderRadius: "0px 5px 5px 0px",
                      fontFamily: "inter",
                      fontWeight: "bolder",
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </Grid>

            <Grid>
              <div className="navbar-image-avatar-container">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f36196",
                    position: "relative",
                    left: "  ",
                    top: "2px",
                  }}
                  className="navbar-image-avatar"
                  onMouseEnter={() => habilitarSubMenu(true)}
                  onMouseLeave={() => habilitarSubMenu(false)}
                >
                  <img src={"/images/pixel.png"} alt="" />
                </div>
              </div>

              {subMenu && (
                <Grid
                  onMouseEnter={() => habilitarSubMenu(true)}
                  onMouseLeave={() => habilitarSubMenu(false)}
                  style={{
                    backgroundColor: "#121418",
                    height: "50vh",
                    position: "absolute",
                    padding: "1rem",
                    width: "16.25rem",
                    right: "105px",
                    borderRadius: "5px",
                    zIndex: 99999,
                  }}
                >
                  <Grid
                    style={{
                      backgroundColor: "#202329",
                      borderRadius: "5px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "1rem",
                    }}
                  >
                    <Grid
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: 10,
                        borderBottom: "1px solid #2a2e38",
                      }}
                    >
                      <img
                        src={props.user?.Avatar ?? "/images/pixel.png"}
                        alt=""
                        style={{
                          width: "20%",
                          height: "20%",
                          borderRadius: "50%",
                        }}
                      />
                      <Link
                        style={{
                          textDecoration: "none",
                          margin: 0,
                          padding: 0,
                        }}
                        to={"/" + props.user.NameUser}
                      >
                        <Typography
                          style={{
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: 500,
                          }}
                        >
                          {props.user?.NameUser ?? "Usuario"}
                        </Typography>
                      </Link>
                    </Grid>

                    <Grid style={{ marginTop: "5px" }}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={"/" + props.user.NameUser + "/settings"}
                      >
                        <Typography
                          style={{
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          Ajustes de tu cuenta{" "}
                        </Typography>
                      </Link>
                    </Grid>
                  </Grid>

                  <Grid
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <Grid>
                      <Link
                        className="dropdownaccount-link"
                        to={"/" + props.user.NameUser}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <i
                          style={{ marginRight: "10px" }}
                          class="fas fa-user"
                        ></i>
                        Tu canal
                      </Link>
                    </Grid>
                    <Grid>
                      <Link
                        className="dropdownaccount-link"
                        to={"/" + props.user.NameUser + "/dashboard/stream"}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <i
                          style={{ marginRight: "10px" }}
                          class="fas fa-sliders-h"
                        ></i>
                        Panel de control del creador
                      </Link>
                    </Grid>
                    <Grid>
                      <Link
                        className="dropdownaccount-link"
                        to="/plataform/cartera"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <i
                          style={{ marginRight: "10px" }}
                          class="fas fa-wallet"
                        ></i>
                        Cartera
                      </Link>
                    </Grid>
                    <Grid>
                      <div
                        className="dropdownaccount-link"
                        onClick={() => handleLogout()}
                      >
                        <i
                          style={{ marginRight: "10px" }}
                          class="fas fa-sign-out-alt"
                        ></i>{" "}
                        Cerrar sesión
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}

        <Grid style={{ padding: "2rem 5.8rem", width: "102%" }}>
          {props.children}

          {showPopupAuth === true && (
            <Auth
              isMobile={props.isMobile}
              typeDefault={type}
              closePopup={() => togglePopupAuth()}
            />
          )}
        </Grid>
        {/* FOOTER */}

        <Grid style={{
          width: '105%',
          display: "flex",
          flexDirection: "column",
          padding: "1.3rem 5rem",
          zIndex: 99999,
          backgroundColor: "rgb(18, 20, 24)",
          gap: '2rem',
          position: "relative",
          bottom: 0
        }}>
          <Grid style={{ display: 'flex', alignItems: 'center' }}>


            {/* COLUMNA LOGO */}

            <Grid style={{ width: '20%' }}>
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                  style={{ width: "70%" }}
                  alt=""
                />
              </Link>
            </Grid>
            {/* COLUMNA SUPPORT*/}
            <Grid style={{ display: 'flex', alignItems: 'flexStart', flexDirection: 'column', justifyContent: 'center', width: '20%', color: 'white' }}>
              <Typography style={{ fontWeight: 800, fontSize: '1rem', textShadow: '0 1px 0 #000' }}>Support</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Live Support</Typography>
              <Typography style={{ color: '#828998' , fontFamily:'Inter'}}>Help Center</Typography>
              <Typography style={{ color: '#828998' , fontFamily:'Inter'}}>Game Responsibly</Typography>
            </Grid>
            {/* COLUMNA PLATFORM*/}
            <Grid style={{ display: 'flex', alignItems: 'flexStart', flexDirection: 'column', justifyContent: 'center', width: '20%', color: 'white' }}>
              <Typography style={{ fontWeight: 800, fontSize: '1rem', textShadow: '0 1px 0 #000' }}>Support</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Live Support</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Help Center</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Game Responsibly</Typography>
            </Grid>
            {/* COLUMNA policy*/}
            <Grid style={{ display: 'flex', alignItems: 'flexStart', flexDirection: 'column', justifyContent: 'center', width: '20%', color: 'white' }}>
              <Typography style={{ fontWeight: 800, fontSize: '1rem', textShadow: '0 1px 0 #000' }}>Support</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Live Support</Typography>
              <Typography style={{ color: '#828998' , fontFamily:'Inter'}}>Help Center</Typography>
              <Typography style={{ color: '#828998' , fontFamily:'Inter'}}>Game Responsibly</Typography>
            </Grid>
            {/* COLUMNA cOMMUNITY*/}
            <Grid style={{ display: 'flex', alignItems: 'flexStart', flexDirection: 'column', justifyContent: 'center', width: '20%', color: 'white' }}>
              <Typography style={{ fontWeight: 800, fontSize: '1rem', textShadow: '0 1px 0 #000' }}>Support</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Live Support</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Help Center</Typography>
              <Typography style={{ color: '#828998', fontFamily:'Inter' }}>Game Responsibly</Typography>
            </Grid>
            {/* COLUMNA cOMMUNITY*/}
            <Grid style={{ display: 'flex', alignItems: 'flexStart', flexDirection: 'column', justifyContent: 'center', width: '10%', color: 'white' }}>
              <select style={{ width: '100%', height: '100%', backgroundColor: '#2a2e38', borderRadius: '5px', color: 'white', padding: '10px' }} name="cars" id="cars">
                <option value="Publico"> Español</option>
                <option value="Privado"> Inglés</option>

              </select>
            </Grid>
          </Grid>

          <Grid >
            <p style={{ color: '#828998', fontSize:'14px', fontFamily:'Inter' }}>
              Shuffle is owned and operated by Natural Nine B.V., Curaçao company registration number 160998, with its registered address at Fransche Bloemweg 4, Willemstad, Curaçao. Shuffle is authorized and regulated by the Government of Curaçao and operates under License No. 8048/JAZ issued to Antillephone. Shuffle’s payment agent company is River Card Limited, Cyprus company registration number HE 431566, with its registered address at 50 Spyrou Kyprianou Avenue, Irida Tower 3, Floor 6, 6057 Larnaca, Cyprus. Contact us at support@shuffle.com.

            </p>
          </Grid>


          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderTop: '1px solid gray', paddingTop: '20px', paddingBottom: '20px' }}>
            <p style={{ color: '#828998' , fontSize:'14px', fontFamily:'Inter'}}>
              1 ETH = $3,561.37
            </p>

            <p style={{ color: '#828998', fontSize:'14px', fontFamily:'Inter' }}>
              © 2024 Pinkker.tv | All Rights Reserved
            </p>
          </Grid>

        </Grid>
      </Grid>



    </Grid>
  );
}

export default NLayout;
