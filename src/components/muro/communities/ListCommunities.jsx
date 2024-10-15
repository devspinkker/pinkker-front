import React from "react";
import { Typography, Avatar } from "@mui/material";
import "./Communities.css";
import { useHistory } from "react-router-dom";
export default function ListCommunities({ communities }) {
  const history = useHistory();
  const handleCommunityClick = (communityName) => {
    history.push(`/plataform/communities/${communityName}`);
  };
  return (
    <div className="communities-list">
      {communities.length > 0 &&
        communities.map((community) => (
          <div
            key={community.id}
            className="community-card"
            onClick={() => handleCommunityClick(community.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="community-header">
              <Avatar
                src={community.creator?.avatar || "/default-avatar.png"} // Avatar por defecto si no hay
                alt={community.communityName}
                className="community-avatar"
              />
              <div>
                <Typography variant="h6" className="community-title">
                  {community.communityName}
                </Typography>
                <Typography variant="body2" className="community-members">
                  {community.membersCount.toLocaleString()} Miembros
                </Typography>
              </div>
            </div>
            <div className="community-members-list">
              {/* Aquí podrías iterar sobre los miembros y mostrar sus avatares */}
              {community.members &&
                community.members.map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    alt="member avatar"
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
