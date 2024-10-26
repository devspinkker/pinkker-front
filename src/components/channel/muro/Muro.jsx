import React, { useState, useEffect, useRef } from "react";

import "./Muro.css";

import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";

import TweetCard from "../../muro/tweet/TweetCard";
import { getTweetUser, getUserFollow } from "../../../services/backGo/tweet";

import FollowCard from "../../muro/FollowCard";
import { GetRecommendedUsers } from "../../../services/backGo/user";
import ComunidadFollow from "../../muro/ComunidadFollow";
import { GetTop10CommunitiesByMembersNoMember } from "../../../services/backGo/communities";

export default function Muro({ streamer }) {
  const [tweets, setTweets] = useState([]);
  const [comunidad, setComunidadFollow] = useState(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [userFollows, setUserFollows] = useState(false);
  let token = window.localStorage.getItem("token");
  const UserFollowsFunc = async (e) => {
    const ExcludeIDs = [];
    const res = await GetRecommendedUsers(token, ExcludeIDs);
    console.log(res);
    if (res.message === "ok" && res.data) {
      console.log(res.data);
      setUserFollows(res.data);
    }
  };
  useEffect(() => {
    UserFollowsFunc();
  }, []);

  const intervalRef = useRef(null);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const ComunidadHandleFollow = async (e) => {
    const res = await GetTop10CommunitiesByMembersNoMember(token);
    console.log(res);

    if (res.message === "ok" && res.data) {
      setComunidadFollow(res.data);
    }
  };
  useEffect(() => {
    ComunidadHandleFollow();
  }, []);
  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if (!intervalRef.current) {
        intervalRef.current = setTimeout(async () => {
          setPage((prevPage) => prevPage + 1);
          await fetchDataScroll(page + 1);
          intervalRef.current = null;
        }, 2000);
      }
    }
  };

  const fetchDataScroll = async (pageP) => {
    try {
      const data = await getTweetUser(streamer?.id, pageP, 1);
      if (data?.message == "ok") {
        if (data.data == null) {
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
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("");
    }
  };

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
  }, []);

  return (
    <div className="channel-muro-body">
      <div className="channel-muro-container">
        <div
          onScroll={handleScroll}
          style={{
            overflowY: "scroll",
            width: "90%",
          }}
          className="channel-muro-tweet-container"
        >
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
                  style={{
                    width: "9.5rem",
                  }}
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1725927463/logos/Chancho_skull_jdtg05.png"
                  alt="Chancho skull"
                />
                <h2 style={{ color: "white" }}>
                  UPS! {streamer.NameUser} no tiene contenido que mostrar
                </h2>
              </div>
            )}
          </div>
        </div>
        {/* <div
          style={{
            width: "25%",
            marginTop: "0px",
            marginRight: "50px",
            backgroundColor: "#0404048f",
          }}
          className="muro-tweet-secondary-follow"
        >
          <h3>A quien seguir</h3>


          {comunidad &&
            comunidad.map((Comunidad) => (
              <ComunidadFollow ComunidadFollow={Comunidad} />
            ))}
        </div> */}
      </div>
    </div>
  );
}
