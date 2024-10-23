import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BuyadCreate,
  BuyadMuroCommunity,
  CreateAdsClips,
} from "../../../../../services/backGo/advertisements";
import { useNotification } from "../../../../Notifications/NotificationProvider";
import "./PurchaseBuyAds.css";
import { Grid, TextField, Button, Typography, IconButton } from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import { FindCommunityByName } from "../../../../../services/backGo/communities";

export default function PurchaseBuyAds({ selectedAd, onClose }) {
  const token = localStorage.getItem("token");
  const [Communities, setCommunities] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [days, setDays] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");

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
      color: state.isSelected ? "#ff53da" : "#ffffff",
      backgroundColor: state.isSelected ? "#190f17" : "#190f17",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "#190f17",
      borderColor: "#ff69c4",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ff69c4",
      },
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#190f17",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ff53da",
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
  const handleDateChange = (e) => {
    const inputDate = e.target.value; // Mantener el formato "YYYY-MM-DD"

    const selectedDate = new Date(`${inputDate}T00:00:00Z`);

    const today = new Date();

    const todayUTC = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );

    const timeDiff = selectedDate.getTime() - todayUTC.getTime();

    const calculatedDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (calculatedDays > 0) {
      setDays(calculatedDays);
      setSelectedDate(inputDate + "T00:00:00Z");
    } else {
    }
  };

  const handleCreate = async () => {
    if (token) {
      const adData = {
        ...form,
        ImpressionsMax: parseFloat(form.ImpressionsMax),
        ClicksMax: parseInt(form.ClicksMax),
        CommunityId: Communities?.id,
        Days: selectedDate,
      };
      let res;

      if (form.Destination == "ClipAds") {
        const formData = new FormData();
        formData.append("video", form.video);
        formData.append("id", form.id);
        formData.append("Name", form.Name);
        formData.append("Destination", form.Destination);
        formData.append("ReferenceLink", form.ReferenceLink);
        formData.append("ImpressionsMax", parseInt(form.ImpressionsMax));
        formData.append("totp_code", form.totp_code);
        formData.append("clipTitle", form.clipTitle);

        res = await CreateAdsClips(token, formData);
      } else if (form.Destination === "Comunidades") {
        res = await BuyadMuroCommunity(token, adData);
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
  useEffect(() => {
    calculateAvailablePixels();
  }, [days]);
  const calculateAvailablePixels = () => {
    let pixels = 0;

    if (form.Destination === "Streams") {
      pixels = form.ImpressionsMax * 20;
    } else if (form.Destination === "Muro") {
      pixels = form.ClicksMax * 75;
    } else if (form.Destination === "ClipAds") {
      pixels = form.ImpressionsMax * 20;
    } else if (form.Destination === "Comunidades") {
      pixels = Communities?.AdPricePerDay * days;
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

  const handleFindCommunityByName = async () => {
    if (searchQuery.trim()) {
      const res = await FindCommunityByName({
        CommunityID: searchQuery,
        token,
      });
      if (res?.data?.length > 0) {
        const foundCommunity = res.data[0];
        setCommunities(foundCommunity);
      }
    }
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
            className="inputsStyles custom-textfield"
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
                  color: "#212725",
                }}
                label="Documento por Anunciar"
                id="DocumentToBeAnnounced"
                name="DocumentToBeAnnounced"
                value={form.DocumentToBeAnnounced}
                onChange={handleInputChange}
                fullWidth
                className="inputsStyles custom-textfield"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                style={{
                  background: "#212725",
                }}
                label="Máximo de Clicks"
                className="inputsStyles custom-textfield"
                type="number"
                id="ClicksMax"
                name="ClicksMax"
                value={form.ClicksMax}
                onChange={handleInputChange}
                //               fullWidth
                //                 InputLabelProps={{
                //   style: { color: "#ff69c4" }, // Cambia el color del label aquí
                // }}
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
            className="inputsStyles custom-textfield"
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
                className="inputsStyles custom-textfield"
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
                style={{ background: "#212725" }}
                className="inputsStyles custom-textfield"
                label="Título del Clip"
                // id="clipTitle"
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
                className="inputsStyles custom-textfield"
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
                className="inputsStyles custom-textfield"
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
                className="inputsStyles custom-textfield"
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
        {form.Destination === "Comunidades" && (
          <Grid item xs={12}>
            <Grid item xs={12}>
              <TextField
                style={{
                  color: "#212725",
                }}
                label="Documento por Anunciar"
                id="DocumentToBeAnnounced"
                name="DocumentToBeAnnounced"
                value={form.DocumentToBeAnnounced}
                onChange={handleInputChange}
                fullWidth
                className="inputsStyles custom-textfield"
                variant="outlined"
              />
            </Grid>
            <TextField
              className="inputsStyles custom-textfield"
              label="Buscar comunidad"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={handleFindCommunityByName}
              fullWidth
            />

            {/* {Communities.map((community) => (
              <Button
                key={community._id}
                onClick={() => handleSelectCommunity(community)}
              >
                Seleccionar {community.name}
              </Button>
            ))} */}
            <Grid item xs={12}>
              <TextField
                className="inputsStyles custom-textfield"
                label="Selecciona una Fecha"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                fullWidth
              />
            </Grid>
          </Grid>
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
            className="inputsStyles custom-textfield"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Precio Total: ${pixels.toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button className="buy-button" onClick={handleCreate} fullWidth>
            Crear Anuncio
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
