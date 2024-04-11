import React, { useState, useEffect } from "react";

import "./Muro.css";

import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";

import TweetCard from "../../muro/tweet/TweetCard";
import { getTweetUser, getUserFollow } from "../../../services/backGo/tweet";

import FollowCard from "../../muro/FollowCard";

export default function Muro({ streamer }) {
  const [tweets, setTweets] = useState([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [userFollows, setUserFollows] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTweetUser(streamer?.id, page, 1);
      if (data?.message == "ok") {
        if (data.data == null) {
          setTweets(null);
          setLoading(false);
          return;
        }
        setTweets((prev) => {
          return [...prev, ...data.data];
        });

        setHasMore(data.hasMore);
        setLoading(true);
        return;
      } else {
        setTweets(null);
        setLoading(false);
        return;
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tweets]);

  const handleScroll = async () => {
    // if (
    //   window.innerHeight + document.documentElement.scrollTop + 1 >=
    //   document.documentElement.scrollHeight
    // ) {
    //   setLoading(true);
    //   setPage((prev) => prev + 1);
    // }
  };

  return (
    <div className="channel-muro-body">
      <div className="channel-muro-container">
        <div style={{ width: "90%" }} className="channel-muro-tweet-container">
          <div
            style={{
              width: "95%",
              backgroundColor: "#0404048f",
              borderRadius: "10px",
            }}
          >
            {tweets != null &&
              tweets.map((tweet) => <TweetCard tweet={tweet} />)}
            {/* {loading && (
              <div
                style={{
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScaleLoader width={4} height={20} color="#f36197d7" />
              </div>
            )} */}
            {loading === false && tweets === null && (
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "100px" }}
                  src="https://res.cloudinary.com/pinkker/image/upload/v1679518811/pinkker-ups_iqucmd.png"
                />
                <h2 style={{ color: "white" }}>
                  UPS! {streamer.NameUser} no tiene contenido que mostrar
                </h2>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: "25%",
            marginTop: "0px",
            marginRight: "50px",
            backgroundColor: "#0404048f",
          }}
          className="muro-tweet-secondary-follow"
        >
          <h3>A quien seguir</h3>

          {userFollows &&
            userFollows.map((follow) => <FollowCard followData={follow} />)}
          {userFollows === null && <ScaleLoader color="#f36197d7" />}
        </div>
      </div>
    </div>
  );
}
