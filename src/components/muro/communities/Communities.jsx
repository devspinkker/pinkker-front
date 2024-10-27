import React, { useState, useEffect } from "react";

import {
  GetCommunityRecommended,
  GetTop10CommunitiesByMembers,
} from "../../../services/backGo/communities";
import "./Communities.css";
import ListCommunities from "./ListCommunities";
import { GetRandomPostcommunities } from "../../../services/backGo/tweet";
import TweetCard from "../tweet/TweetCard";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function Communities({ isMobile }) {
  const token = window.localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [ComunidadesRecommended, setComunidadesRecommended] = useState([]);
  const [Posts, setPosts] = useState(null);

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
    const res = await GetRandomPostcommunities(token);
    if (res?.data) {
      console.log(res?.data);

      setPosts(res.data);
    }
  };

  useEffect(() => {
    HandleGetRandomPostcommunities();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={`communities-container ${isMobile ? "mobile" : ""}`}>
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
