import React, { useState, useEffect } from "react";

import "./Search.css";

import {
  fetchSearchPage,
  dispatchGetSearch,
} from "../../redux/actions/searchAction";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import ClipCard from "../card/ClipCard";
import { ScaleLoader } from "react-spinners";
import { useLocation } from "react-router-dom";

export default function Search() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const [search, setSearch] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  let term = urlParams.get("term");
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    const fetchData = async () => {
      setLoading(true);
      await handleChange(term);
    };

    fetchData();
  }, [token, location]);

  const handleChange = async (value) => {
    if (value?.length <= 0) {
      setSearch(null);
    } else {
      const getUser = () => {
        return fetchSearchPage(value).then((res) => {
          setLoading(false);
          if (res?.data?.message == "ok") {
            setSearch(res.data.data);
          }
        });
      };
      getUser();
    }
  };

  function getSearch() {
    if (loading === false && term?.length <= 2) {
      return (
        <div
          style={{
            height: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            padding: "3rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              style={{ width: "150px" }}
              src="https://res.cloudinary.com/pinkker/image/upload/v1679518811/pinkker-ups_iqucmd.png"
            />
            <h2 style={{ color: "white", textAlign: "center" }}>
              Introduce al menos 3 caracteres
            </h2>
          </div>
        </div>
      );
    }
    if (loading === false && term?.length > 2) {
      return (
        <div className="search-container">
          {search && search.length > 0 && (
            <div>
              <h2 style={{ color: "white" }}>Canales</h2>
              <div className="search-info-canales">
                {search &&
                  search.map((user) => (
                    <Link
                      style={{ textDecoration: "none" }}
                      to={"/" + user.NameUser}
                    >
                      <div className="search-info-canales-card">
                        <div className="search-info-canales-card-image">
                          <img
                            style={{ borderRadius: "100px", maxWidth: "140px" }}
                            src={user.Avatar}
                          />
                          {user.Online === true && (
                            <h5
                              className="channel-avatar-text"
                              style={{
                                color: "#ededed",
                                padding: "2px",
                                borderRadius: "5px",
                                position: "absolute",
                                width: "85px",
                                marginTop: "130px",
                                marginLeft: "10px",
                              }}
                            >
                              EN DIRECTO
                            </h5>
                          )}
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <h3
                            style={{
                              color: "white",
                              fontSize: "18px",
                              marginTop: "20px",
                              marginLeft: "10px",
                            }}
                          >
                            {user.NameUser}
                          </h3>
                          <h3
                            style={{
                              color: "darkgray",
                              marginTop: "5px",
                              fontSize: "14px",
                              marginLeft: "10px",
                            }}
                          >
                            Streamer
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* {search && search.categories.length > 0 && (
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ color: "white" }}>Clips</h2>
              <div className="search-info-canales">
                {search &&
                  search.clips.map((user) => (
                    <Link
                      style={{ textDecoration: "none" }}
                      to={"/clip/" + user._id}
                    >
                      <ClipCard
                        width="162px"
                        height="280px"
                        url={user.url}
                        likes={user.totalLikes}
                        comments={user.totalComments}
                        views={user.views}
                        createdAt={user.createdAt}
                        duration={user.duration}
                        image={user.cover}
                        title={user.clipName}
                        categorie={user.stream.stream_category}
                        tags={user.stream.stream_tag}
                      />
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {search && search.categories.length > 0 && (
            <div>
              <h2 style={{ color: "white" }}>Categorias</h2>
              <div className="search-info-canales">
                {search &&
                  search.categories.map((user) => (
                    <Link
                      style={{ textDecoration: "none" }}
                      to={"/categorie/" + user.name}
                    >
                      <div style={{ marginRight: "20px" }}>
                        <img
                          style={{ marginTop: "10px", maxWidth: "140px" }}
                          src={user.image}
                        />
                        <div style={{ marginTop: "10px" }}>
                          <h3 style={{ color: "white", fontSize: "18px" }}>
                            {user.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )} */}
        </div>
      );
    } else {
      return (
        <div
          style={{
            minHeight: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScaleLoader color="#f36197d7" />
        </div>
      );
    }
  }

  return <div className="search-body">{getSearch()}</div>;
}
