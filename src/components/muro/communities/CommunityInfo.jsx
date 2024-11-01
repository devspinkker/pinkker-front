import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AddMember, RemoveMember } from "../../../services/backGo/communities";
import "./Communities.css";

const CommunityInfo = ({ community }) => {
  const token = window.localStorage.getItem("token");

  // Estado para saber si el usuario es miembro de la comunidad
  const [isMember, setIsMember] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false); // Control del modal
  const [actionType, setActionType] = useState(""); // Tipo de acción (unirse o salir)

  useEffect(() => {
    if (token) {
      setIsMember(community?.isUserMember);
    }
  }, [community, token]);

  // Manejar la apertura del modal de confirmación
  const handleOpenConfirm = (action) => {
    setActionType(action);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // Lógica para unirse a la comunidad
  const handleJoin = () => {
    if (token) {
      if (community?.SubscriptionAmount > 0) {
        AddMember({ community_id: community.id, token })
          .then(() => {
            setIsMember(true);
            handleCloseConfirm(); // Cerrar modal después de unirse
          })
          .catch((err) => {
            console.error("Error al unirse a la comunidad:", err);
          });
      } else {
        AddMember({ community_id: community.id, token })
          .then(() => {
            setIsMember(true);
            handleCloseConfirm(); // Cerrar modal después de unirse
          })
          .catch((err) => {
            console.error("Error al unirse a la comunidad:", err);
          });
      }
    }
  };

  // Lógica para salir de la comunidad
  const handleLeave = () => {
    if (token) {
      RemoveMember({ community_id: community.id, token })
        .then(() => {
          setIsMember(false);
          handleCloseConfirm(); // Cerrar modal después de salir
        })
        .catch((err) => {
          console.error("Error al salir de la comunidad:", err);
        });
    }
  };

  // Contenido del modal según la acción (unirse o salir)
  const renderModalContent = () => {
    if (actionType === "join") {
      return community?.SubscriptionAmount > 0 ? (
        <>
          <DialogTitle>Unirse a {community?.communityName}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Unirse a esta comunidad cuesta{" "}
              <strong>${community.SubscriptionAmount}</strong>. El monto será
              descontado de tu cuenta. ¿Deseas continuar?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleJoin} color="primary">
              Confirmar Pago
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Unirse a {community?.communityName}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas unirte a esta comunidad?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleJoin} color="primary">
              Unirse
            </Button>
          </DialogActions>
        </>
      );
    } else if (actionType === "leave") {
      return (
        <>
          <DialogTitle>Salir de {community?.communityName}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas salir de esta comunidad?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleLeave} color="primary">
              Salir
            </Button>
          </DialogActions>
        </>
      );
    }
  };

  return (
    <Box className="CommunityInfo">
      {/* Banner */}
      <Box
        style={{
          backgroundImage: `url(${
            community?.Banner !== ""
              ? community?.Banner
              : community?.creator.banner
          })`,
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
        <Typography className="text-Community title">
          {community?.communityName}
        </Typography>
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Typography className="text-Community">
            {community?.description}
          </Typography>
        </Box>
        {/* Categories */}
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {community?.categories?.map(
            (category, index) =>
              category != "" && (
                <Box key={index} className="community-categorie">
                  {category}
                </Box>
              )
          )}
        </Box>

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
            style={{ marginTop: "20px", background: "#351823" }}
            onClick={() => handleOpenConfirm("leave")}
          >
            Salir de la Comunidad
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", background: "#351823" }}
            onClick={() => handleOpenConfirm("join")}
          >
            Unirse a la Comunidad
          </Button>
        )}
      </Box>

      {/* Modal de confirmación */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        className="modal-dialog-info-community"
      >
        {renderModalContent()}
      </Dialog>
    </Box>
  );
};

export default CommunityInfo;
