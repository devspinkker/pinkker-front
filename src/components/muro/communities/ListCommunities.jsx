import React from "react";
import { Typography } from "@mui/material";
import "./Communities.css";
import { useHistory } from "react-router-dom";

export default function ListCommunities({ communities }) {
  const history = useHistory();

  const handleCommunityClick = (communityName) => {
    history.push(`/plataform/communities/${communityName}`);
  };

  return (
    <div className="communities-list">
      {communities?.length > 0 &&
        communities.map((community) => (
          <div
            key={community.id}
            className="community-card"
            onClick={() => handleCommunityClick(community.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="banner-container">
              <img
                src={
                  community.Banner != ""
                    ? community.Banner
                    : community.creatorDetails?.banner
                }
                alt="Community Banner"
                className="community-banner"
              />
            </div>
            <div className="community-name">
              <h4 className="community-title">{community.communityName}</h4>
            </div>
          </div>
        ))}
    </div>
  );
}
