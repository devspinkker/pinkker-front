import React, { useState, useCallback } from "react";
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
import { CreateCommunity } from "../../../services/backGo/communities";
import "./Communities.css";
import { getCroppedImg } from "../../settings/user/popup/canvasUtils";
import Cropper from "react-easy-crop";

export default function CreateCommunityDialog({ open, onClose, token }) {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [categories, setCategories] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [PriceAd, setPriceAd] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [finalBanner, setFinalBanner] = useState(null); // Guardar la imagen recortada final
  const [showCropper, setShowCropper] = useState(false); // Mostrar/ocultar el cropper

  // Estados para el recorte de la imagen
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(URL.createObjectURL(file));
      setShowCropper(true); // Mostrar el cropper al seleccionar una imagen
    }
  };

  const handleCropAccept = async () => {
    // Procesar el recorte y guardar la imagen final
    if (bannerFile && croppedAreaPixels) {
      const fileCropped = await getCroppedImg(
        bannerFile,
        croppedAreaPixels,
        rotation
      );
      setFinalBanner(fileCropped); // Guardar el resultado final
      setShowCropper(false); // Ocultar el cropper
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const cat = [categories];
      const formData = new FormData();
      formData.append("community_name", communityName);
      formData.append("description", description);
      formData.append("is_private", isPrivate);
      formData.append("categories", cat);
      formData.append("totp_code", totpCode);
      formData.append("is_paid", isPaid);
      formData.append("subscription_amount", subscriptionAmount);
      formData.append("AdPricePerDay", PriceAd);

      if (finalBanner) {
        const croppedBanner = new File([finalBanner], "banner.png", {
          type: "image/png",
          lastModified: new Date().getTime(),
        });
        formData.append("Banner", croppedBanner);
      }

      await CreateCommunity(formData, token);
      onClose();
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  return (
    <div onClose={onClose}>
      <DialogTitle>
        <div className="header">
          <Typography variant="h6" className="title">
            Crear una nueva comunidad
          </Typography>
          <IconButton onClick={onClose}>
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
        {/* <TextField
          margin="dense"
          label="Categorías (separadas por comas)"
          type="text"
          fullWidth
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="inputsStyles custom-textfield"
          variant="outlined"
        /> */}
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
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {showCropper && (
          <div
            className="crop-container"
            style={{
              zIndex: "1000",
            }}
          >
            <Cropper
              image={bannerFile}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              // aspect={4 / 1}
              aspect={186 / 73}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              style={{
                zIndex: "1000",
              }}
            />
            {/* <div className="crop-controls">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
              />
            </div> */}
            <Button
              onClick={handleCropAccept}
              color="primary"
              variant="contained"
              style={{
                zIndex: "100000",
              }}
            >
              Aceptar recorte
            </Button>
          </div>
        )}

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
        <TextField
          margin="dense"
          label="Precio de los anuncios por dia"
          type="number"
          fullWidth
          value={PriceAd}
          onChange={(e) => setPriceAd(e.target.value)}
          className="inputsStyles custom-textfield"
          variant="outlined"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} className="create-button">
          Cancelar
        </Button>
        <Button onClick={handleCreateCommunity} className="create-button">
          Crear
        </Button>
      </DialogActions>
    </div>
  );
}
