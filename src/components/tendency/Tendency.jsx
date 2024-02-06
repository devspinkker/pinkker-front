import React, { useState, useEffect } from "react";

import "./Tendency.css";

import TendencyCard from "./card/TendencyCard";
import { useSelector } from "react-redux";

import { getClipTrending, getVodTrending } from "../../services/vods";
import ClipTendencyCard from "./card/ClipTendencyCard";

import { Link } from "react-router-dom";

export default function Tendency() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [type, setType] = useState(0);

  const [vodTendency, setVodTendency] = useState(null);
  const [clipTendency, setClipTendency] = useState(null);

  useEffect(() => {
    document.title = "Tendency - Pinkker";

    const fetchData = async () => {
      const data = await getVodTrending(10);
      if (data != null && data != undefined) {
        setVodTendency(data);
      }

      const dataClip = await getClipTrending(10);
      if (dataClip != null && dataClip != undefined) {
        setClipTendency(dataClip);
      }
    };
    fetchData();
  }, [token]);

  function getType() {
    if (type === 0) {
      return vodTendency.map((vod, index) => (
        <Link style={{ textDecoration: "none" }} to={"/vod/" + vod._id}>
          <TendencyCard
            tendency={index + 1}
            title={vod.stream_title}
            streamer={vod.streamer}
            views={vod.views}
            createdAt={vod.createdAt}
            categorie={vod.stream_category}
            tags={vod.stream_tag}
            image={vod.stream_thumbnail}
          />
        </Link>
      ));
    }

    if (type === 1) {
      return clipTendency.map((vod, index) => (
        <Link style={{ textDecoration: "none" }} to={"/clip/" + vod._id}>
          <ClipTendencyCard
            tendency={index + 1}
            title={vod.clipName}
            streamer={vod.name}
            views={vod.views}
            createdAt={vod.createdAt}
            categorie={vod.stream.stream_category}
            tags={vod.stream_tag}
            image={vod.cover}
          />
        </Link>
      ));
    }
  }

  function getLeftForType() {
    if (type === 0) {
      return "115px";
    }

    if (type === 1) {
      return "201px";
    }

    if (type === 2) {
      return "199px";
    }
  }

  return (
    <div className="tendency-body">
      <div style={{ height: "50px" }} />

      <div className="tendency-container">
        <div className="tendency-title">
          <h2>Tendencias</h2>
        </div>

        <div>
          <div
            style={{ margin: "0", justifyContent: "left", marginTop: "15px" }}
            className="type-set"
          >
            <div className={type === 0 ? "type-card active" : "type-card"}>
              <h3 onClick={() => setType(0)}>Streams</h3>
            </div>
            <div className={type === 1 ? "type-card active" : "type-card"}>
              <h3 onClick={() => setType(1)}>Clips</h3>
            </div>
            <div style={{ left: getLeftForType() }} className="type-line"></div>
          </div>

          <div class="pinkker-tab-line"></div>
        </div>

        <div className="tendency-card-container">
          {vodTendency && clipTendency && getType()}
        </div>
      </div>
    </div>
  );
}
