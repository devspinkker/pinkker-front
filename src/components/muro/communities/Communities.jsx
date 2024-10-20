import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CreateCommunity,
  FindCommunityByName,
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
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [categories, setCategories] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [topCommunities, setTopCommunities] = useState([]);
  const [Posts, setPosts] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const handleFindCommunityByName = async () => {
    if (searchQuery.trim()) {
      const res = await FindCommunityByName({
        CommunityID: searchQuery,
        token,
      });
      console.log("Search result:", res);
      if (res?.data?.length > 0) {
        const foundCommunity = res.data[0];
        setTopCommunities((prevCommunities) => [
          foundCommunity,
          ...prevCommunities.filter((c) => c.id !== foundCommunity.id),
        ]);
      }
    }
  };

  const FuncGetTop10CommunitiesByMembers = async () => {
    const res = await GetTop10CommunitiesByMembers(token);
    if (res?.data) {
      setTopCommunities(res.data);
    }
  };

  // useEffect(() => {
  //   FuncGetTop10CommunitiesByMembers();
  // }, []);

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

  const handleCreateCommunity = async () => {
    try {
      const cat = [categories];
      const response = await CreateCommunity({
        community_name: communityName,
        description,
        is_private: isPrivate,
        categories: cat,
        totp_code: totpCode,
        is_paid: isPaid,
        subscription_amount: parseInt(subscriptionAmount),
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
      {/* <div className="header">
        <Typography variant="h4" className="title" gutterBottom>
          Comunidades
        </Typography>
      </div> */}

      {/* Campo para buscar comunidad */}
      <div className="communities-search">
        <TextField
          className="inputsStyles custom-textfield"
          label="Buscar comunidad por nombre"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // className="search-field"
        />
        <button onClick={handleFindCommunityByName} className="search-button">
          Buscar
        </button>

        {/* Botón para abrir el pop-up de creación */}
        <button onClick={handleOpen} className="search-button">
          Crear
        </button>
      </div>

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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    color="primary"
                  />
                }
                label="¿Comunidad privada?"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    color="primary"
                  />
                }
                label="¿Comunidad de pago?"
              />
              {isPaid && ( // Solo mostrar si es de pago
                <TextField
                  margin="dense"
                  label="Monto de la suscripción"
                  type="number"
                  fullWidth
                  value={subscriptionAmount}
                  onChange={(e) => setSubscriptionAmount(e.target.value)}
                  className="inputsStyles custom-textfield"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              )}
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
