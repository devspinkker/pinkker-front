import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CreateCommunity,
  GetTop10CommunitiesByMembers,
} from "../../../services/backGo/communities";
import comunidadImg from "../imagencomunidad.jpg";
import "./Communities.css";
import ListCommunities from "./ListCommunities";

export default function Communities({ isMobile }) {
  const token = window.localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [categories, setCategories] = useState("");
  const [totpCode, setTotpCode] = useState("");

  const [topCommunities, setGetTop10CommunitiesByMembers] = useState([]);

  const FuncGetTop10CommunitiesByMembers = async () => {
    const res = await GetTop10CommunitiesByMembers(token);
    console.log(res);

    if (res?.data) {
      setGetTop10CommunitiesByMembers(res.data);
    }
  };

  useEffect(() => {
    FuncGetTop10CommunitiesByMembers();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateCommunity = async () => {
    try {
      const cat = [categories];
      const response = await CreateCommunity({
        community_name: communityName,
        description,
        is_private: isPrivate,
        categories: cat,
        totp_code: totpCode,
        token,
      });

      console.log("Community created:", response.data);
      handleClose(); // Cerrar el modal después de la creación
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  return (
    <div className={`communities-container ${isMobile ? "mobile" : ""}`}>
      <div className="header">
        <Typography variant="h4" className="title" gutterBottom>
          Comunidades
        </Typography>
      </div>

      {/* Botón para abrir el pop-up */}
      <Button
        variant="contained"
        onClick={handleOpen}
        className="create-button"
      >
        Crear Comunidad
      </Button>

      <div>
        {open && (
          <div onClose={handleClose}>
            <DialogTitle>
              <div className="header">
                <Typography variant="h6" className="title">
                  Crear una nueva comunidad
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon style={{ color: "red" }} />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent className="dialog-content">
              <TextField
                autoFocus
                margin="dense"
                label="Nombre de la comunidad"
                type="text"
                fullWidth
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="inputsStyles custom-textfield"
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Descripción"
                type="text"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="inputsStyles custom-textfield"
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Categorías (separadas por comas)"
                type="text"
                fullWidth
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="inputsStyles custom-textfield"
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Código TOTP"
                type="number"
                fullWidth
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="inputsStyles custom-textfield"
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </DialogContent>
            <DialogActions className="dialog-actions">
              <Button onClick={handleClose} className="create-button">
                Cancelar
              </Button>
              <Button onClick={handleCreateCommunity} className="create-button">
                Crear
              </Button>
            </DialogActions>
          </div>
        )}
      </div>
      <div>
        <ListCommunities communities={topCommunities} />
      </div>
    </div>
  );
}
