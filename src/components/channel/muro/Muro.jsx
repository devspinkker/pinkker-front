import React, { useState, useEffect, useRef } from "react";

import "./Muro.css";

import TweetCard from "../../muro/tweet/TweetCard";
import {
  getPostUserLogueado,
  getTweetUser,
  getUserFollow,
} from "../../../services/backGo/tweet";

import { GetRecommendedUsers } from "../../../services/backGo/user";
import { CommunityOwnerUser } from "../../../services/backGo/communities";
import ListCommunities from "../../muro/communities/ListCommunities";

export default function Muro({ streamer }) {
  const [Posts, setPosts] = useState([]);
  const [comunidad, ComunidadesMember] = useState([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [userFollows, setUserFollows] = useState(false);
  let token = window.localStorage.getItem("token");
  const UserFollowsFunc = async (e) => {
    const ExcludeIDs = [];
    const res = await GetRecommendedUsers(token, ExcludeIDs);
    
    if (res.message === "ok" && res.data) {
      
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
    const res = await CommunityOwnerUser({ UserId: streamer?.id });
    

    if (res.message === "StatusOK" && res.data) {
      ComunidadesMember(res.data);
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
      let data;
      if (token) {
        data = await getPostUserLogueado(streamer?.id, pageP, 1, token);
      } else {
        data = await getTweetUser(streamer?.id, pageP, 1);
      }

      if (data?.message == "ok") {
        if (data.data == null) {
          setLoading(false);
          return;
        }
        setPosts((Prev) => [...Prev, ...data.data]);
        // setPosts((prev) => {
        //   return [...prev, ...data.data];
        // });

        setHasMore(data.hasMore);
        setLoading(true);
        return;
      } else {
        setLoading(false);
        return;
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let data;
      if (token) {
        data = await getPostUserLogueado(streamer?.id, page, 1, token);
      } else {
        data = await getTweetUser(streamer?.id, page, 1);
      }
      if (data?.message == "ok") {
        if (data.data == null) {
          setPosts(null);
          setLoading(false);
          return;
        }
        setPosts((prev) => {
          return [...prev, ...data.data];
        });

        setHasMore(data.hasMore);
        setLoading(true);
        return;
      } else {
        setPosts(null);
        setLoading(false);
        return;
      }
    };
    fetchData();
  }, []);

  return (
    <div className="channel-muro-body">
      <div className="channel-muro-container">
        <div className="channel-muro-tweet-container">
          <ListCommunities communities={comunidad} />
          <div
            onScroll={handleScroll}
            style={{
              overflowY: "scroll",
              maxHeight: "95vh",
              width: "95%",
              backgroundColor: "#0404048f",
              borderRadius: "10px",
            }}
          >
            {Posts != null && Posts.map((tweet) => <TweetCard tweet={tweet} />)}
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
            {loading === false && Posts === null && (
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
                  src="/static/media/Chancho skull.de3b6e78a5dff4a9bfda.png"
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
