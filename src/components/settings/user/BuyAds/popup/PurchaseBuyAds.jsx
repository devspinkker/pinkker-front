import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  BuyadCreate,
  CreateAdsClips,
} from "../../../../../services/backGo/advertisements";
import { useNotification } from "../../../../Notifications/NotificationProvider";
import "./PurchaseBuyAds.css";
import { Grid, TextField, Button, Typography, IconButton } from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";

export default function PurchaseBuyAds({ selectedAd, onClose }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    id: "",
    Name: "",
    Destination: selectedAd,
    Categorie: "",
    UrlVideo: "",
    ReferenceLink: "",
    ImpressionsMax: 0.0,
    ClicksMax: 0,
    DocumentToBeAnnounced: "",
    clipTitle: "",
    totp_code: "",
    video: null,
  });

  const alert = useNotification();
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#ffffff" : "#007bff",
      backgroundColor: state.isSelected ? "#212725" : "#212725",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "#212725",
      borderColor: "#212725",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#0056b3",
      },
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#007bff",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#007bff",
    }),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "ClicksMax"
          ? parseInt(value) || 0
          : name === "ImpressionsMax"
          ? parseFloat(value) || 0
          : value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prevForm) => ({
      ...prevForm,
      video: file,
    }));
  };

  const handleCreate = async () => {
    if (token) {
      const adData = {
        ...form,
        ImpressionsMax: parseFloat(form.ImpressionsMax),
        ClicksMax: parseInt(form.ClicksMax),
      };
      let res;
      if (form.Destination == "ClipAds") {
        const formData = new FormData();
        formData.append("video", form.video);
        formData.append("id", form.id);
        formData.append("Name", form.Name);
        formData.append("Destination", form.Destination);
        formData.append("ReferenceLink", form.ReferenceLink);
        formData.append("ClicksMax", parseInt(form.ClicksMax));
        formData.append("totp_code", form.totp_code);
        formData.append("clipTitle", form.clipTitle);

        res = await CreateAdsClips(token, formData);
      } else {
        res = await BuyadCreate(token, adData);
      }

      if (res.message === "ok") {
        setForm({
          id: "",
          Name: "",
          Destination: "Muro",
          Categorie: "",
          UrlVideo: "",
          ReferenceLink: "",
          ImpressionsMax: 0.0,
          ClicksMax: 0,
          DocumentToBeAnnounced: "",
          totp_code: "",
          clipTitle: "",
        });
        alert({
          type: "SUCCESS",
          message: "Anuncio creado exitosamente.",
        });
      } else {
        console.error("Error al crear anuncio", res);
        alert({
          type: "ERROR",
          message: "Error al crear el anuncio.",
        });
      }
    }
  };

  const calculateAvailablePixels = () => {
    let pixels = 0;

    if (form.Destination === "Streams") {
      pixels = form.ImpressionsMax * 20;
    } else if (form.Destination === "Muro") {
      pixels = form.ClicksMax * 75;
    } else if (form.Destination === "ClipAds") {
      pixels = form.ClicksMax * 75;
    }

    return { pixels };
  };

  const { pixels } = calculateAvailablePixels();

  const destinationOptions = [
    { value: "Muro", label: "Muro" },
    { value: "Streams", label: "Streams" },
    { value: "ClipAds", label: "Clip Ads" },
  ];

  const handleDestinationChange = (selectedOption) => {
    console.log(selectedOption.value);
    setForm((prevForm) => ({
      ...prevForm,
      Destination: selectedOption.value,
    }));
  };

  return (
    <div className="purchase-ads">
      <div className="header">
        <Typography
          style={{ margin: "0px" }}
          variant="h4"
          className="title"
          gutterBottom
        >
          Compra Paquetes de Publicidad
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon style={{ color: "red" }} />
        </IconButton>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            style={{
              background: "#212725",
            }}
            label="Nombre"
            id="Name"
            name="Name"
            value={form.Name}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            options={destinationOptions}
            value={destinationOptions.find(
              (option) => option.value === form.Destination
            )}
            onChange={handleDestinationChange}
            styles={customStyles}
            placeholder="Selecciona Destino"
          />
        </Grid>

        {form.Destination === "Muro" && (
          <>
            <Grid item xs={12}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="Documento por Anunciar"
                id="DocumentToBeAnnounced"
                name="DocumentToBeAnnounced"
                value={form.DocumentToBeAnnounced}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="Máximo de Clicks"
                type="number"
                id="ClicksMax"
                name="ClicksMax"
                value={form.ClicksMax}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <TextField
            style={{
              background: "#212725",
            }}
            label="Enlace de Referencia"
            id="ReferenceLink"
            name="ReferenceLink"
            value={form.ReferenceLink}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        {form.Destination === "ClipAds" && (
          <>
            <Grid item xs={12}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="Máximo de Clicks"
                type="number"
                id="ClicksMax"
                name="ClicksMax"
                value={form.ClicksMax}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                style={{ background: "#212725" }}
                label="Título del Clip"
                id="clipTitle"
                name="clipTitle"
                value={form.clipTitle}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ color: "#007bff" }}
              />
            </Grid>
          </>
        )}
        {form.Destination === "Streams" && (
          <>
            <Grid item xs={12}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="URL del Video"
                id="UrlVideo"
                name="UrlVideo"
                value={form.UrlVideo}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="Máximo de Impresiones"
                type="number"
                id="ImpressionsMax"
                name="ImpressionsMax"
                value={form.ImpressionsMax}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="Categoria Destino"
                id="Categorie"
                name="Categorie"
                value={form.Categorie}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            label="Código TOTP"
            id="totp_code"
            name="totp_code"
            value={form.totp_code}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            inputProps={{ maxLength: 6 }}
            style={{
              background: "#212725",
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Precio Total: ${pixels.toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            fullWidth
          >
            Crear Anuncio
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
