import React, { useEffect } from "react";
import { Typography, Avatar, Box, Button } from "@mui/material";
import { AddMember } from "../../../services/backGo/communities";

const CommunityInfo = ({ community }) => {
  const token = window.localStorage.getItem("token");
  useEffect(() => {
    AddMember({ community_id: community.id, token });
  }, []);

  return (
    <Box
      style={{
        backgroundColor: "#2a2e38",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        position: "relative",
      }}
    >
      {/* Banner */}
      <Box
        style={{
          backgroundImage: `url(${community?.creator.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "200px",
          borderRadius: "10px 10px 0 0",
          position: "relative",
        }}
      >
        {/* Avatar */}
        <Avatar
          src={community?.creator.avatar}
          alt={community?.communityName}
          style={{
            width: "100px",
            height: "100px",
            position: "absolute",
            bottom: "-50px",
            left: "20px",
            border: "5px solid #2a2e38",
          }}
        />
      </Box>

      {/* Community Info */}
      <Box style={{ paddingTop: "60px", paddingLeft: "140px" }}>
        <Typography variant="h4" style={{ color: "white" }}>
          {community?.communityName}
        </Typography>
        <Typography variant="subtitle1" style={{ color: "gray" }}>
          {community?.description}
        </Typography>
        <Typography
          variant="body2"
          style={{ color: "gray", marginBottom: "10px" }}
        >
          {community?.membersCount} miembros
        </Typography>

        <button>Unirse</button>
      </Box>
    </Box>
  );
};

export default CommunityInfo;
