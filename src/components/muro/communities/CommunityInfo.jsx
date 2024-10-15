import React, { useEffect, useState } from "react";
import { Typography, Avatar, Box, Button } from "@mui/material";
import { AddMember, RemoveMember } from "../../../services/backGo/communities";
import "./Communities.css";

const CommunityInfo = ({ community }) => {
  const token = window.localStorage.getItem("token");

  // Estado para saber si el usuario es miembro de la comunidad
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    // Aquí puedes hacer una llamada para verificar si el usuario es miembro
    if (token) {
      // Supongamos que community.isUserMember es una propiedad que ya indica si es miembro
      setIsMember(community?.isUserMember);
    }
  }, [community, token]);

  const handleJoin = () => {
    if (token) {
      AddMember({ community_id: community.id, token })
        .then(() => {
          setIsMember(true); // Actualiza el estado a 'miembro'
        })
        .catch((err) => {
          console.error("Error al unirse a la comunidad:", err);
        });
    }
  };

  const handleLeave = () => {
    if (token) {
      RemoveMember({ community_id: community.id, token })
        .then(() => {
          setIsMember(false); // Actualiza el estado a 'no miembro'
        })
        .catch((err) => {
          console.error("Error al salir de la comunidad:", err);
        });
    }
  };

  return (
    <Box className="CommunityInfo">
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
      <Box className="Community-Info">
        <Typography variant="h4" style={{ color: "white" }}>
          {community?.communityName}
        </Typography>

        {/* Categories */}
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {community?.categories?.map((category, index) => (
            <Box
              key={index}
              style={{
                backgroundColor: "#4a4f5a",
                padding: "5px 15px",
                borderRadius: "20px",
                color: "white",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {category}
            </Box>
          ))}
        </Box>

        <Typography variant="subtitle1" style={{ color: "gray" }}>
          {community?.description}
        </Typography>

        <Typography
          variant="body2"
          style={{ color: "gray", marginBottom: "10px" }}
        >
          {community?.membersCount} miembros
        </Typography>

        {/* Botón de Unirse o Salir según si es miembro */}
        {isMember ? (
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "20px" }}
            onClick={handleLeave}
          >
            Salir de la Comunidad
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
            onClick={handleJoin}
          >
            Unirse a la Comunidad
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CommunityInfo;
