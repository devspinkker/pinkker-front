import React, { useEffect, useState } from "react";
import "./ClipsMain.css";
import { useSelector } from "react-redux";
import ClipCard from "./card/ClipCard";
import Auth from "../../auth/Auth";
import {
  ClipsRecommended,
  GetClipsCategory,
} from "../../../services/backGo/clip";
import { ScaleLoader, BarLoader } from "react-spinners";

export default function ClipsMain({ tyExpanded }) {
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;

  const [clips, setClips] = useState(null);
  const [viewedClip, setViewedClip] = useState(0);
  const [viewAuth, setViewAuth] = useState(false);
  const [loadingMoreClips, setLoadingMoreClips] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadClips();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const loadClips = async () => {
    try {
      let token = window.localStorage.getItem("token");
      if (token) {
        const idsExclude = [];
        const res = await ClipsRecommended(token, idsExclude);
        if (res.data.message === "ok") {
          setClips(res.data.data);
        }
      } else {
        const res = await GetClipsCategory("", 1, "");
        if (res.data.message === "ok") {
          setClips(res.data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreClips = async () => {
    if (!isLogged && clips) {
      try {
        let token = window.localStorage.getItem("token");
        if (token) {
          // Extraer los IDs de los clips actuales
          const idsExclude = clips.map((clip) => clip._id);
          const res = await ClipsRecommended(token, idsExclude);
          if (res.data.message === "ok") {
            setClips((prevClips) => [...prevClips, ...res.data.data]);
          }
        } else {
          const res = await GetClipsCategory("", 1, "");
          if (res.data.message === "ok") {
            setClips((prevClips) => [...prevClips, ...res.data.data]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    setLoadingMoreClips(false);
  };

  const handleScroll = async () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;

    const body = document.body;
    const html = document.documentElement;
    const documentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    const offset = 100;

    if (
      scrollTop + windowHeight + offset >= documentHeight &&
      !loadingMoreClips
    ) {
      setLoadingMoreClips((prevLoading) => {
        if (!prevLoading) {
          loadMoreClips().then(() => {
            // Restablecer el estado de loadingMoreClips después de cargar los clips
            setLoadingMoreClips(false);
          });
        }
        return true; // Establecer loadingMoreClips en true independientemente de su valor anterior
      });
    }
  };

  const nextClip = () => {
    setViewedClip((prevViewedClip) => prevViewedClip + 1);
    var pos = window.pageYOffset;
    window.scrollTo(0, pos + 855);
  };

  const previewClip = () => {
    setViewedClip((prevViewedClip) => prevViewedClip - 1);
    var pos = window.pageYOffset;
    window.scrollTo(0, pos - 855);
  };
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);
  return (
    <div
      className="clipsmain-body"
      style={{
        padding: "0px",
      }}
    >
      {isLoading ? (
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
      ) : (
        <>
          <div>
            {clips &&
              clips.map((clip, index) =>
                index <= 0 ? (
                  <ClipCard
                    tyExpanded={tyExpanded}
                    key={clip.id}
                    type={0}
                    clip={clip}
                  />
                ) : (
                  <ClipCard
                    tyExpanded={tyExpanded}
                    key={clip.id}
                    type={1}
                    clip={clip}
                  />
                )
              )}
          </div>

          <div style={{ top: "120px" }} className="clipsmain-right-buttons">
            <div
              style={{
                height: "40%",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <i
                onClick={previewClip}
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  color: "darkgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
                className="fas fa-arrow-up"
              />
            </div>
            <div
              style={{
                height: "40%",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <i
                onClick={nextClip}
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  color: "darkgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
                className="fas fa-arrow-down"
              />
            </div>
          </div>

          {viewAuth && (
            <Auth typeDefault={0} closePopup={() => setViewAuth(false)} />
          )}
        </>
      )}
      =======
      {isLoading ? (
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
      ) : (
        <>
          <div>
            {clips &&
              clips.map((clip, index) =>
                index <= 0 ? (
                  <ClipCard
                    tyExpanded={tyExpanded}
                    key={clip.id}
                    type={0}
                    clip={clip}
                  />
                ) : (
                  <ClipCard
                    tyExpanded={tyExpanded}
                    key={clip.id}
                    type={1}
                    clip={clip}
                  />
                )
              )}
          </div>

          <div style={{ top: "120px" }} className="clipsmain-right-buttons">
            <div
              style={{
                height: "40%",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <i
                onClick={previewClip}
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  color: "darkgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
                className="fas fa-arrow-up"
              />
            </div>
            <div
              style={{
                height: "40%",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <i
                onClick={nextClip}
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  color: "darkgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
                className="fas fa-arrow-down"
              />
            </div>
          </div>

          {viewAuth && (
            <Auth typeDefault={0} closePopup={() => setViewAuth(false)} />
          )}
        </>
      )}
    </div>
  );
}
