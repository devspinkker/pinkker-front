import React, { useState, useEffect } from "react";

import "./Home.css";

import DirectosRecommended from "./recommended/Recommended";
import Clips from "./clips/Clips";

import useTheme from "../../theme/useTheme";

import { useLocation } from "react-router-dom";

import { useLastLocation } from "react-router-last-location";

import { useNotification } from "../Notifications/NotificationProvider";

import Vods from "./vods/Vods";

import { getCategoriesWithLimit } from "../../services/backGo/streams";

import "react-multi-carousel/lib/styles.css";

import SliderLayout from "../layout/SliderLayout";

const Home = ({
  socketMain,
  expanded,
  cancelExpand,
  isMobile,
  handleMessage,
}) => {
  const [streams, setStreams] = useState(null);

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
    // Primero, intenta cargar las categorías desde localStorage
    const storedCategories = localStorage.getItem("categories");

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Si no hay datos en localStorage, realiza la solicitud a la API
      const fetchData = async () => {
        const getCategoriesWithLimitData = await getCategoriesWithLimit();

        if (getCategoriesWithLimitData?.message === "ok") {
          setCategories(getCategoriesWithLimitData.data);
          // Guarda los datos en localStorage para futuras cargas
          localStorage.setItem(
            "categories",
            JSON.stringify(getCategoriesWithLimitData.data)
          );
        }
      };

      fetchData();
    }
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

  const [is1080x1920, setIs1080x1920] = useState(false);

  const handleResize = () => {
    const is1080 = window.innerWidth === 1920;
    const is1920 = window.innerHeight === 1080;
    setIs1080x1920(is1080 && is1920);
  };
  useEffect(() => {
    handleResize(); // Comprobar el tamaño inicial de la pantalla al montar el componente

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const fetchMoreData = (direction) => {
    const increment = direction === "right" ? 1 : -1;
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < (is1080x1920 ? 3 : 4)) {
      setCurrentIndex(newIndex);
    }
  };

  let size = is1080x1920 ? -15 : -20;
  const [color, setColor] = useState("");

  const generateColor = () => {
    setColor(Math.random().toString(16).substr(-6));
  };

  useEffect(() => {
    generateColor();
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.clientX);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const newOffset = event.clientX - startX;
    setOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartX(0);
  };
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 200);
  const [isFullHD, setIsFullHD] = useState(false);
  useEffect(() => {
    const checkScreenResolution = () => {
      if (window.innerWidth === 1920 && window.innerHeight === 1080) {
        setIsFullHD(true);
      } else {
        setIsFullHD(false);
      }
    };

    // Check the resolution on mount
    checkScreenResolution();

    // Add event listener to check resolution on resize
    window.addEventListener("resize", checkScreenResolution);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", checkScreenResolution);
  }, []);
  return (
    <div
      style={{
        padding: isMobile ? "1rem 1rem 10rem 1rem" : "2rem 0rem",
        width: isMobile ? "89%" : "100%",
        maxWidth: !isMobile && 'calc(1200px + 6vw)',
        height: isMobile && "100vh",
        margin: "0 auto",
      }}
      className={"home-body-" + theme.theme}
    >
      {/* {isLoading && (
        <div
          style={{
            height: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader color="#36d7b7" />
        </div>
      )} */}
      <DirectosRecommended
        isMobile={isMobile}
        socketMain={socketMain}
        handleMessage={handleMessage}
        expanded={expanded}
      />

      <div className="categories-home-manager"></div>
      {/* <div className="categories-home">
        {Categories && !Categories[1] && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "21px 0px",
              gap: "10px",
            }}
          >
            {[...Array( isMobile ?  3 : isFullHD ? 8 : 7)].map((_, index) => (
              <div
                style={{
                  marginTop: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3rem",
                }}
                key={index}
              >
                <Skeleton
                  variant="rectangular"
                  width={140}
                  height={180}
                  style={{
                    backgroundColor: "#202329",
                    border: `1px solid #${color}`,
                    borderRadius: "5px",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div> */}

      <SliderLayout
        Categories={Categories}
        Categoria={true}
        clipT={false}
        isMobile={isMobile}
      ></SliderLayout>
      {/* {<Clips isMobile={isMobile} />}

      {<Vods isMobile={isMobile} />} */}

      {/* {<Clips isMobile={isMobile} titulo={"Vods"} />} */}

      {/* {showPopupAuth === true && <Auth typeDefault={1} closePopup={() => togglePopupAuth()} />} */}
      {/*activePlayerPopup === true && <CustomPlayer expanded={expanded} width="100%" height="160px" popup={true} style={{zIndex: "99999"}} streamerName={streamerPlayerPopup} closePopup={() => setActivePlayerPopup(false)}/> */}
      {/* <div className="pinkker-scrollbar">
        <div style={{ top: scroll }} className="pinkker-scrollbar-tab" />
      </div> */}
    </div>
  );
};

export default Home;
