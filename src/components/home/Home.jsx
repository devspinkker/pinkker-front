import React, { useState, useEffect } from "react";

import "./Home.css";

import Categories from "./categories/Categories";
import DirectosRecommended from "./recommended/Recommended";
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
import CardCategorie from "../home/categories/CardCategorie";
import { Skeleton } from "@mui/material";

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

    if (location && location?.pathname != "/") {
      setStreamerPlayerPopup(location?.pathname.split("/")[1]);

      streamerPlayerPop = location?.pathname.split("/")[1];

      setActivePlayerPopup(true);
    }
  }, [location]);

  const [random, setRandom] = useState([]);
  const [randomBanner, setRandomBanner] = useState([]);
  const [Categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const getCategoriesWithLimitData = await getCategoriesWithLimit();
      if (getCategoriesWithLimitData?.message == "ok") {
        setCategories(getCategoriesWithLimitData.data);
      }
    };

    fetchData();
  }, []);
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
  const [currentIndex, setCurrentIndex] = useState(0);


  const fetchMoreData = (direction) => {
    const increment = direction === "right" ? 1 : -1;
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < streams.length) {
      setCurrentIndex(newIndex);
    }
  };

  const [color, setColor] = useState("")

  const generateColor = () => {
    setColor(Math.random().toString(16).substr(-6));
  };

  useEffect(() => {
    generateColor()
  }, [])
  return (
    <div
      style={{
        padding: isMobile ? "0rem 0rem 0rem 4rem" : "",
      }}
      className={"home-body-" + theme.theme}
    >
      {/* <div className="home-img">
        {!isMobile && (
          <div className="home-img-content">
            <h1
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
            </p>
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
      </div> */}
      {/* {!isMobile && <Categories isMobile={isMobile} />} */}


      <DirectosRecommended
        isMobile={isMobile}
        socketMain={socketMain}
        handleMessage={handleMessage}
        expanded={expanded}

      />

      <div className="categories-home-container">
        <div className="categories-home-manager">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '80%' }}>
            <img src="/images/original.svg" style={{ width: '2.5%' }} />
            <h2 style={{ fontFamily: 'Inter', color: 'white' }}>Categorias</h2>
          </div>

          <div className="manager-recommended-actions">
            <div className="manager-recommended-actions-ver-todos">
              <Link to="/plataform/explore?tipo=categories">
                <span style={{ fontFamily: 'Signika Negative' }}>Ver todos</span>
              </Link>
            </div>
            <div className="manager-recommended-actions-arrow">
              <i
                style={{ margin: "0px 10px", cursor: "pointer" }}
                className="fas fa-chevron-left"
                onClick={() => fetchMoreData("left")}
              ></i>
              <i
                style={{ cursor: "pointer" }}
                className="fas fa-chevron-right"
                onClick={() => fetchMoreData("right")}
              ></i>
            </div>
          </div>
        </div>
        <div
          className="categories-home"
          style={{
            transition: "transform 0.5s ease",
            transform: `translateX(${currentIndex * -10}%)`,
          }}
        >
          {!Categories[1] && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {[...Array(8)].map((_, index) => (
                <div
                  style={{ marginRight: "9px", marginTop: "30px" }}
                  key={index}

                >
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={199}
                    style={{ backgroundColor: "#" + color, borderRadius: '5px' }}
                  />

                </div>
              ))}
            </div>
          )}
          {Categories &&
            Categories.map((categorie) => (
              <CardCategorie
                width={isMobile ? "160px" : "160px"}
                isLoading={isLoading}
                name={categorie.nombre}
                image={categorie.img ?? "/images/pinkker-stream.png"}
                spectators={categorie.spectators}
                tags={categorie.tags}
                TopColor={categorie.TopColor}
              />
            ))}
        </div>
      </div>

      {!isMobile && <Clips isMobile={isMobile} />}

      {/* <Vods /> */}
      {!isMobile && <Clips isMobile={isMobile} />}

      {/* {showPopupAuth === true && <Auth typeDefault={1} closePopup={() => togglePopupAuth()} />} */}
      {/*activePlayerPopup === true && <CustomPlayer expanded={expanded} width="100%" height="160px" popup={true} style={{zIndex: "99999"}} streamerName={streamerPlayerPopup} closePopup={() => setActivePlayerPopup(false)}/> */}
      {/* <div className="pinkker-scrollbar">
        <div style={{ top: scroll }} className="pinkker-scrollbar-tab" />
      </div> */}
    </div>
  );
};

export default Home;
