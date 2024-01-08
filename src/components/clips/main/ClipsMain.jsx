import React, { useEffect, useState } from "react";

import "./ClipsMain.css";

import { useSelector } from "react-redux";
import ReactDOM from "react-dom";

import { getClips, getClipsWithAuth } from "../../../services/vods";

import ClipCard from "./card/ClipCard";

import Auth from "../../auth/Auth";
import { GetClipsCategory } from "../../../services/backGo/clip";

export default function ClipsMain() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [clips, setClips] = useState(null);

  const [viewedClip, setViewedClip] = useState(0);

  const [viewAuth, setViewAuth] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //  useEffect(() => {
  //         if(token != null && token != undefined && token != "") {

  //             const fetchData = async () => {
  //                 const data = await getClipsWithAuth(token, 5);
  //                 if(data != null && data != undefined) {
  //                     setClips(data);
  //                 }
  //             }
  //             fetchData()

  //             window.onscroll = function(e) {myFunction(e)};
  //         }
  //     }, [token])

  useEffect(() => {
    if (!isLogged) {
      const fetchData = async () => {
        try {
          const res = await GetClipsCategory("Charlando", 1);
          if (res.data.message == "ok") {
            setClips(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      //window.onscroll = function(e) {myFunction(e)};
    }
  }, []);

  let isScrolling = false;

  const nextClip = () => {
    setViewedClip(viewedClip + 1);
    var pos = window.pageYOffset;
    window.scrollTo(0, pos + 905);
    isScrolling = true;
    if (clips != null) {
      if (!isLogged) {
        if (viewedClip >= clips.length) {
          setViewAuth(true);
        }
      }
    }
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  };

  const previewClip = () => {
    setViewedClip(viewedClip - 1);
    var pos = window.pageYOffset;
    window.scrollTo(0, pos - 975);
    isScrolling = true;
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  };

  var lastScrollTop = 0;

  function myFunction(e) {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    e.preventDefault();
    document.documentElement.style.overflow = "hidden";

    if (clips != null) {
      if (!isLogged) {
        if (viewedClip >= clips.length) {
          setViewAuth(true);
        }
      }
    }
    if (st > lastScrollTop) {
      if (isScrolling === false) {
        isScrolling = true;
        setViewedClip(viewedClip + 1);
        var pos = window.pageYOffset;
        window.scrollTo(0, pos + 975);

        setTimeout(() => {
          isScrolling = false;
          document.documentElement.style.overflow = "scroll";
          document.documentElement.style.overflowX = "hidden";
        }, 500);
      }
    } else {
      if (isScrolling === false) {
        isScrolling = true;
        setViewedClip(viewedClip - 1);

        var pos = window.pageYOffset;
        window.scrollTo(0, pos - 975);
        setTimeout(() => {
          isScrolling = false;
          document.documentElement.style.overflow = "scroll";
          document.documentElement.style.overflowX = "hidden";
        }, 500);
      }
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }

  return (
    <div className="clipsmain-body">
      <div>
        {clips &&
          clips.map((clip, index) =>
            index <= 0 ? (
              <ClipCard type={0} clip={clip} />
            ) : (
              <ClipCard type={1} clip={clip} />
            )
          )}
      </div>

      <div style={{ top: "80px" }} className="clipsmain-right-buttons">
        <div
          style={{
            height: "47%",
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
            class="fas fa-arrow-up"
          />
        </div>
        <div
          style={{
            height: "47%",
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
            class="fas fa-arrow-down"
          />
        </div>
      </div>

      {viewAuth && (
        <Auth typeDefault={0} closePopup={() => setViewAuth(false)} />
      )}

      {/* <div
        style={{
          height: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ width: "200px" }}
            src="https://res.cloudinary.com/pinkker/image/upload/v1679518300/pinkker-trabajando_ky0e2t.png"
          />
          <h1 style={{ color: "white" }}>
            Estamos trabajando en esto... estará pronto!
          </h1>
        </div>
      </div> */}
    </div>
  );
}
