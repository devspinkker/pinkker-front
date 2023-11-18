import React, { useState, useEffect } from "react";

import "./Home.css";

import Categories from "./categories/Categories";
import Recommended from "./recommended/Recommended";
import Clips from "./clips/Clips";
import { useSelector } from "react-redux";

import useTheme from "../../theme/useTheme";

import { useLocation } from "react-router-dom";

import { useLastLocation } from "react-router-last-location";

import CustomPlayer from "../customPlayer/customPlayer";

import { useNotification } from "../Notifications/NotificationProvider";

import Vods from "./vods/Vods";

import DropdownSettings from "./dropdown/DropdownSettings";

import { getCategoriesWithLimit } from "../../services/backGo/streams";

import "react-multi-carousel/lib/styles.css";

import { Link } from "react-router-dom";
import { getUserByIdTheToken } from "../../services/backGo/user";

const Home = ({
  socketMain,
  expanded,
  cancelExpand,
  isMobile,
  handleMessage,
}) => {
  const [streams, setStreams] = useState(null);
  const [user, isLogged] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getCategoriesWithLimit(25);
      console.log(response);
      if (response != null && response != undefined) {
        setStreams(response.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let token = window.localStorage.getItem("token");
      let res = await getUserByIdTheToken("token");
      if (res.error) {
        console.log("no logeado");
      }
      if (res != null && res != undefined) {
        isLogged(res.data);
      }
    };
    fetchData();
  }, []);
  const [userFollow, setUserFollow] = useState();
  // useEffect(() => {
  //     const fetchData = async () => {
  //         const response = await getStreamerFollowers(user)
  //         console.log('getStreamerFollowers', response)
  //         if (response != null && response != undefined) {
  //             setUserFollow(response)

  //         }
  //     }
  //     fetchData()
  // }, [])

  const [isLoading, setIsLoading] = useState(false);
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  const theme = useTheme();

  const location = useLastLocation();

  const alert = useNotification();

  const [showPopupAuth, setShowPopupAuth] = useState(false);
  function togglePopupAuth() {
    setShowPopupAuth(!showPopupAuth);
  }

  const [activePlayerPopup, setActivePlayerPopup] = useState(false);
  const [streamerPlayerPopup, setStreamerPlayerPopup] = useState(null);

  //Get query from url
  const locationSearch = new URLSearchParams(useLocation().search);
  const register = locationSearch.get("register");
  const reset = locationSearch.get("reset");

  const [imageActive, setImageActive] = useState(0);

  let streamerPlayerPop = null;

  useEffect(() => {
    document.title = "Pinkker";
    window.scrollTo(0, 0);
    isMobile ? cancelExpand(false) : cancelExpand(true);

    if (register === "true") {
      alert({ type: "SUCCESS", message: "Registrado correctamente" });
    }
    if (reset === "true") {
      alert({ type: "SUCCESS", message: "Contraseña cambiada correctamente" });
    }

    if (location && location.pathname != "/") {
      setStreamerPlayerPopup(location.pathname.split("/")[1]);

      streamerPlayerPop = location.pathname.split("/")[1];

      setActivePlayerPopup(true);
    }
  }, [location]);

  const [random, setRandom] = useState([]);
  const [randomBanner, setRandomBanner] = useState([]);
  const [randomAnimation, setRandomAnimation] = useState([]);

  function getStyleFromRandom() {
    return;
  }

  function shuffle(o) {
    for (
      var j, x, i = o.length;
      i;
      j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
    );
    return o;
  }

  useEffect(() => {
    var random = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var randomBanner = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var randomAnimation = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    setRandom(random);
    setRandomBanner(randomBanner);
    //setRandomAnimation(randomAnimation)
  }, []);

  /*async function getNewRandom() {
     var randomAnimation = await shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     setRandomAnimation(randomAnimation)
 
    }
 
 
    setInterval(() => {
     getNewRandom()
    }, 30000)*/

  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = (event) => {
      if (window.scrollY >= 825) {
        setScroll(825);
      } else {
        setScroll(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let imagesNormal = [
    "amongus.jpg",
    "apex.jpg",
    "axie.jpg",
    "battlefield.jpg",
    "callofduty.jpeg",
    "callofduty-warzone.jpg",
    "chatting.jpg",
    "clashroyale.jpeg",
    "crypto.jpg",
    "csgo.jpeg",
    "dota2.jpg",
    "fifa22.jpeg",
  ];
  let imagesBanner = [
    "battlefield.png",
    "callofduty.png",
    "chatting.jpg",
    "clashroyale.png",
    "csgo.png",
    "deporte.jpg",
    "dota2.png",
    "fifa22.png",
    "food.jpg",
    "fornite.png",
    "freefire.png",
    "godofwar.png",
    "gta5.png",
    "lol.png",
    "minecraft.png",
  ];

  function getUrlFromBanner(image) {
    if (image === "chatting.jpg") {
      return "Charlando";
    }
    if (image === "amongus.jpg") {
      return "Among Us";
    }
    if (image === "battlefield.png") {
      return "Battlefield";
    }
    if (image === "callofduty.png") {
      return "Call of Duty";
    }
    if (image === "clashroyale.png") {
      return "Clash Royale";
    }
    if (image === "deporte.jpg") {
      return "Deporte";
    }
    if (image === "food.jpg") {
      return "Food and Drink";
    }
    if (image === "fornite.png") {
      return "Fornite";
    }
    if (image === "freefire.png") {
      return "Free Fire";
    }
    if (image === "godofwar.png") {
      return "God of War";
    }
    if (image === "gta5.png") {
      return "Grand Theft Auto";
    }
    if (image === "minecraft.png") {
      return "Minecraft";
    }
    if (image === "csgo.png") {
      return "Counter Strike";
    }
    if (image === "dota2.png") {
      return "Dota 2";
    }
    if (image === "fifa22.png") {
      return "FIFA 22";
    }
  }

  function getUrlFromImage(image) {
    if (image === "chatting.jpg") {
      return "Charlando";
    }
    if (image === "amongus.jpg") {
      return "Among Us";
    }
    if (image === "apex.jpg") {
      return "Apex";
    }
    if (image === "axie.jpg") {
      return "Axie Infinity";
    }
    if (image === "battlefield.jpg") {
      return "Battlefield";
    }
    if (image === "callofduty.jpeg") {
      return "Call of Duty";
    }
    if (image === "callofduty-warzone.jpg") {
      return "Call of Duty - Warzone";
    }
    if (image === "clashroyale.jpeg") {
      return "Clash Royale";
    }
    if (image === "crypto.jpg") {
      return "Crypto";
    }
    if (image === "csgo.jpg") {
      return "Counter Strike";
    }
    if (image === "dota2.jpg") {
      return "Dota 2";
    }
    if (image === "fifa22.jpeg") {
      return "FIFA 22";
    }
  }

  const categorias = [
    {
      nombre: "Free Fire",
      img: "data:image/jpeg;base64,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",
    },
    {
      nombre: "Fortnite",
      img: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000010192/f2aceaa07354abfa1652dbfb5acede2f4b2844db3c37780d538020f51814d510",
    },
    {
      nombre: "League of Legends",
      img: "https://fotos.perfil.com/2022/02/01/trim/720/410/conoce-todos-los-detalles-acerca-de-lol-y-enterate-como-se-juega-1306879.jpg",
    },
    {
      nombre: "Call of duty",
      img: "https://i.blogs.es/9af117/cod1/840_560.jpg",
    },
    {
      nombre: "Slots",
      img: "https://todosport.pe/wp-content/uploads/2022/03/aprender-conceptos-de-slots.jpg",
    },
    {
      nombre: "Gta V",
      img: "https://assets.xboxservices.com/assets/0b/17/0b179504-412d-4af7-9e00-3e3d92633577.jpg?n=GTA-V_GLP-Page-Hero-1084_1920x1080.jpg",
    },
    {
      nombre: "Fifa 22",
      img: "https://img.redbull.com/images/c_limit,w_1500,h_1000,f_auto,q_auto/redbullcom/2021/7/28/pmjkmhqo940brpe98wz6/fifa-22-logo-mbappe",
    },
    {
      nombre: "League of Legends",
      img: "https://fotos.perfil.com/2022/02/01/trim/720/410/conoce-todos-los-detalles-acerca-de-lol-y-enterate-como-se-juega-1306879.jpg",
    },
  ];

  return (
    <div className={"home-body-" + theme.theme}>
      <div className="home-img">
        {!isMobile && (
          <div className="home-img-content">
            {/* <h1
              style={{
                fontWeight: "800",
                fontFamily: "Poppins",
                fontSize: "44px",
              }}
            >
              Directos, clips ilimitados y <br /> mucho más.
            </h1>
            <p style={{ fontSize: "20px", marginBottom: "10px" }}>
              Descubre las mejores transmisiones en directo allá donde estés.
            </p> */}
          </div>
        )}

        {isMobile && (
          <div
            style={{
              width: "100%",
              height: "10%",
              display: "flex",
              marginTop: "35px",
              overflowX: "scroll",
            }}
          >
            {false
              ? streams?.map((stream) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100px",
                        alignItems: "center",
                      }}
                    >
                      <Link to={`/categorie/" + ${stream.nombre}`}>
                        <img
                          src={stream.img}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <span style={{ color: "white", textAlign: "center" }}>
                          {stream.nombre}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              : categorias.map((categorias, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: index === 0 ? "2%" : "5%",
                      justifyContent: "center",
                    }}
                  >
                    <Link to={`/categorie/${categorias.nombre}`}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100px",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={categorias.img}
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <span style={{ color: "white", textAlign: "center" }}>
                          {categorias.nombre}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        )}

        {isLogged && !isMobile && (
          <div className="test">
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[0]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: "-60px",
                  right: "255px",
                  width: "265px",
                  height: "257px",
                  animation:
                    randomAnimation[0] === 0
                      ? "translateAnimation 5s infinite"
                      : "translateAnimation 4s infinite",
                  zIndex: "1000",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[0]]}
              />
            </Link>
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[1]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: "188px",
                  right: "477px",
                  width: "225px",
                  height: "190px",
                  animation:
                    randomAnimation[0] === 1 &&
                    "translateAnimation 7s infinite",
                  zIndex: randomAnimation[0] === 1 && "1000",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[1]]}
              />
            </Link>
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[2]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: "163px",
                  right: "705px",
                  width: "225px",
                  height: "190px",
                  animation:
                    randomAnimation[0] === 2 &&
                    "translateAnimation 8s infinite",
                  zIndex: randomAnimation[0] === 2 && "1000",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[2]]}
              />
            </Link>
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[3]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: "-60px",
                  right: "528px",
                  width: "235px",
                  height: "227px",
                  animation:
                    randomAnimation[0] === 3 &&
                    "translateAnimation 4s infinite",
                  zIndex: randomAnimation[0] === 3 && "1000",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[3]]}
              />
            </Link>
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[4]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: "-50px",
                  right: "1228px",
                  width: "180px",
                  height: "147px",
                  animation:
                    randomAnimation[0] === 4 &&
                    "translateAnimation 5s infinite",
                  zIndex: "1200",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[4]]}
              />
            </Link>
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[5]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: "87px",
                  right: "1430px",
                  width: "180px",
                  height: "187px",
                  animation:
                    randomAnimation[0] === 5 &&
                    "translateAnimation 6s infinite",
                  filter: randomAnimation[0] === 5 && "brightness(65%)",
                  boxShadow:
                    randomAnimation[0] === 5 &&
                    "#ff85d9 1px 1px, #ff85d9 2px 2px, #ff85d9 3px 3px, #ff85d9 4px 4px, #ff85d9 5px 5px, #ff85d9 6px 6px, #ff85d9 7px 7px, #ff85d9 8px 8px",
                  zIndex: randomAnimation[0] === 5 && "1000",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[5]]}
              />
            </Link>
            <Link to={"/categorie/" + getUrlFromImage(imagesNormal[random[6]])}>
              <img
                style={{
                  borderRadius: "5px",
                  top: expanded ? "315px" : "308px",
                  right: "-365px",
                  width: "210px",
                  height: "177px",
                  position: "relative",
                  animation:
                    randomAnimation[0] === 6 &&
                    "translateAnimation 7s infinite",
                  zIndex: randomAnimation[0] === 6 && "1000",
                }}
                className="home-image-effect"
                src={"/images/categories/" + imagesNormal[random[6]]}
              />
            </Link>

            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[0]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: "51px",
                  right: "1615px",
                  width: "480px",
                  height: "187px",
                  animation:
                    randomAnimation[0] === 0 &&
                    "translateAnimation 5s infinite",
                  zIndex: randomAnimation[0] === 0 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[0]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[1]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: "123px",
                  right: "931px",
                  width: "500px",
                  height: "190px",
                  animation:
                    randomAnimation[0] === 1
                      ? "translateAnimation 6s infinite"
                      : "translateAnimation 6s infinite",
                  zIndex: "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[1]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[2]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: expanded ? "229px" : "230px",
                  right: expanded ? "-1000px" : "-1090px",
                  position: "relative",
                  width: "525px",
                  height: "190px",
                  animation:
                    randomAnimation[0] === 2 &&
                    "translateAnimation 9s infinite",
                  zIndex: randomAnimation[0] === 2 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[2]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[3]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: "7px",
                  right: "-220px",
                  width: "480px",
                  height: "230px",
                  animation:
                    randomAnimation[0] === 3 &&
                    "translateAnimation 4s infinite",
                  zIndex: randomAnimation[0] === 3 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[3]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[4]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: "-60px",
                  right: "770px",
                  width: "450px",
                  height: "190px",
                  animation:
                    randomAnimation[0] === 4 &&
                    "translateAnimation 8s infinite",
                  zIndex: randomAnimation[0] === 4 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[4]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[5]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: "-57px",
                  right: "1415px",
                  width: "452px",
                  height: "120px",
                  animation:
                    randomAnimation[0] === 5 &&
                    "translateAnimation 11s infinite",
                  zIndex: randomAnimation[0] === 5 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[5]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[6]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: expanded ? "280px" : "275px",
                  right: expanded ? "820px" : "825px",
                  width: "450px",
                  height: "180px",
                  position: "relative",
                  animation:
                    randomAnimation[0] === 6 &&
                    "translateAnimation 4s infinite",
                  zIndex: randomAnimation[0] === 6 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[6]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[7]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: expanded ? "415px" : "412px",
                  right: "50px",
                  width: "480px",
                  height: "180px",
                  position: "relative",
                  animation:
                    randomAnimation[0] === 7 &&
                    "translateAnimation 3s infinite",
                  zIndex: randomAnimation[0] === 7 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[7]]
                }
              />
            </Link>
            <Link
              to={
                "/categorie/" + getUrlFromBanner(imagesBanner[randomBanner[8]])
              }
            >
              <img
                style={{
                  borderRadius: "5px",
                  top: expanded ? "175px" : "170px",
                  right: "-25px",
                  width: "560px",
                  height: "180px",
                  position: "relative",
                  animation:
                    randomAnimation[0] === 8 &&
                    "translateAnimation 5s infinite",
                  zIndex: randomAnimation[0] === 8 && "1000",
                }}
                className="home-image-banner-effect"
                src={
                  "/images/categories/banners/" + imagesBanner[randomBanner[8]]
                }
              />
            </Link>
          </div>
        )}
      </div>
      <div style={{ width: "100%", height: "1px", backgroundColor: "a" }} />
      {!isMobile && <Categories isMobile={isMobile} />}

      <div
        style={{ width: "100%", height: "1px", backgroundColor: "#ffffff1a" }}
      />
      {isMobile && (
        <Recommended
          isMobile={isMobile}
          socketMain={socketMain}
          handleMessage={handleMessage}
        />
      )}
      {!isMobile && <Clips isMobile={isMobile} />}

      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#ffffff1a",
          marginTop: "19px",
        }}
      />
      <Vods />

      {/* {showPopupAuth === true && <Auth typeDefault={1} closePopup={() => togglePopupAuth()} />} */}
      {/*activePlayerPopup === true && <CustomPlayer expanded={expanded} width="100%" height="160px" popup={true} style={{zIndex: "99999"}} streamerName={streamerPlayerPopup} closePopup={() => setActivePlayerPopup(false)}/> */}

      <div className="pinkker-scrollbar">
        <div style={{ top: scroll }} className="pinkker-scrollbar-tab" />
      </div>
    </div>
  );
};

export default Home;
