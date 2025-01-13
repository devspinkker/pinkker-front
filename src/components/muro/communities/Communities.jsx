import React, { useState, useEffect, useRef } from "react";

import {
  GetCommunityRecommended,
  GetTop10CommunitiesByMembers,
} from "../../../services/backGo/communities";
import "./Communities.css";
import ListCommunities from "./ListCommunities";
import { GetRandomPostcommunities, PostGets } from "../../../services/backGo/tweet";
import TweetCard from "../tweet/TweetCard";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function Communities({ isMobile }) {
  const [page, setPage] = useState(1);
  const token = window.localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [ComunidadesRecommended, setComunidadesRecommended] = useState([]);
  const [Posts, setPosts] = useState(null);
  const containerRef = useRef(null);

  const FuncGetTop10CommunitiesByMembers = async () => {
    if (token) {
      const res = await GetCommunityRecommended({ token, page: 1 });
      if (res?.data) {
        setComunidadesRecommended(res.data);
      }
    }
    // const res = await GetTop10CommunitiesByMembers(token);
    // if (res?.data) {
    //   setComunidadesRecommended(res.data);
    // }
  };

  useEffect(() => {
    FuncGetTop10CommunitiesByMembers();
  }, []);

  const HandleGetRandomPostcommunities = async () => {
    if (token) {
      
      const res = await GetRandomPostcommunities(token);
      if (res?.data) {
        console.log(res?.data);
  
        setPosts(res.data);
      }
    }else{
      const res = await GetRandomPostcommunities(token);
      if (res?.data) {
        console.log(res?.data);
  
        setPosts(res.data);
      }
      const data = await PostGets();
         if (data.data == null) {
           setPosts(null);
         } else {
           setPosts(data.data);
         }
    }
  };

  useEffect(() => {
    HandleGetRandomPostcommunities();
  }, []);

  const fetchDataScroll = async () => {
    try {
      if (token) {
        const ExcludeIDs = Posts.map((Post) => Post._id);
        const res = await GetRandomPostcommunities(token, ExcludeIDs);
        if (res?.data) {
          setPosts((Prev) => [...Prev, ...res?.data]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Verifica si el usuario llegó al final del contenedor
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        fetchDataScroll();
      }
    }
  };
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        overflowY: "auto",
        maxHeight: "80vh",
        padding: !isMobile && "0px 23px",
        // border: "1px solid #f36197d7",
      }}
      className={`communities-container ${isMobile ? "mobile" : ""}`}
    >
      {/* <div className="header">
        <Typography variant="h4" className="title" gutterBottom>
          Comunidades
        </Typography>
      </div> */}

      {/* Campo para buscar comunidad */}
      <div className="communities-search">
        {/* <TextField
          className="inputsStyles custom-textfield"
          label="Buscar comunidad por nombre"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // className="search-field"
        /> */}
        {/* <button onClick={handleFindCommunityByName} className="search-button">
          Buscar
        </button> */}
      </div>

      <div>
        {/* <CreateCommunityDialog
          open={open}
          onClose={handleClose}
          token={token}
        /> */}
      </div>
      <div>
        <ListCommunities communities={ComunidadesRecommended} />
      </div>

      <div>
        <div className="muro-tweet-container">
          {Posts &&
            Posts.length > 0 &&
            Posts.map((P) => (
              <div>
                <div className="communitiesRedirect-post">
                  <Link to={"/plataform/communities/" + P.CommunityInfo?._id}>
                    <i className="fas fa-user"></i>
                    <span className="muro-post-container-CommunityName">
                      {P.CommunityInfo?.CommunityName}
                    </span>
                  </Link>
                </div>
                <TweetCard tweet={P} isMobile={isMobile} />
              </div>
            ))}

          {!Posts && (
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
          )}
        </div>
      </div>
    </div>
  );
}