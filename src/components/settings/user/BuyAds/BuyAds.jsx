import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import "./BuyAds.css";
import PurchaseBuyAds from "./popup/PurchaseBuyAds";

export default function BuyAds() {
  const [selectedAd, setSelectedAd] = useState(null);

  const handleAdSelect = (adType) => {
    setSelectedAd(adType);
  };

  const onClose = () => {
    setSelectedAd(null);
  };

  return (
    <div className="buy-ads-container">
      {!selectedAd ? (
        <>
          <div className="info-section">
            <Typography variant="h4" className="section-title">
              Compra de Anuncios
            </Typography>
            <Typography variant="body1" className="section-description">
              Explora nuestras opciones de anuncios y elige la que mejor se
              adapte a tus necesidades.
            </Typography>
          </div>

          <div className="ads-options">
            <Typography variant="h5" className="options-title">
              Opciones de Anuncios
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card className="ad-card muro">
                  <CardContent>
                    <Typography variant="h6" className="card-title">
                      Anuncio en Muro
                    </Typography>
                    <Typography variant="body2" className="card-description">
                      Promociona tu publicación en el muro. Ideal para aumentar
                      la visibilidad de tus publicaciones.
                    </Typography>
                    <Typography variant="body1" className={`price muro`}>
                      Precio: $75 por clic
                    </Typography>
                    <Typography variant="body2" className="ad-details">
                      <strong>Muro:</strong> Este tipo de anuncio promociona una
                      publicación. Cada clic en el enlace de referencia cuesta
                      75 píxeles. La campaña termina cuando se alcanza el número
                      máximo de clics.
                    </Typography>
                    <Button
                      onClick={() => handleAdSelect("Muro")}
                      variant="contained"
                      className="buy-button"
                    >
                      Comprar Ahora
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="ad-card streams">
                  <CardContent>
                    <Typography variant="h6" className="card-title">
                      Anuncio en Streams
                    </Typography>
                    <Typography variant="body2" className="card-description">
                      Muestra tu anuncio en los streams de nuestros creadores.
                      Ideal para alcanzar una audiencia amplia.
                    </Typography>
                    <Typography variant="body1" className={`price streams`}>
                      Precio: $20 por impresión
                    </Typography>
                    <Typography variant="body2" className="ad-details">
                      <strong>Streams:</strong> Estos anuncios se muestran en
                      los streams de los streamers. Se cuentan únicamente en
                      base a impresiones. También puedes incluir un enlace de
                      referencia y dirigir el anuncio a una categoría específica
                      de stream.
                    </Typography>
                    <Button
                      onClick={() => handleAdSelect("Streams")}
                      variant="contained"
                      className="buy-button"
                    >
                      Comprar Ahora
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>

          <div className="faq-section">
            <Typography variant="h5" className="faq-title">
              Preguntas Frecuentes
            </Typography>
            <Typography variant="body1" className="faq-description">
              <strong>¿Cómo funciona el sistema de anuncios?</strong> <br />
              Los anuncios se muestran según el tipo seleccionado. Los precios
              varían según el tipo y el alcance del anuncio.
            </Typography>
            <Typography variant="body1" className="faq-description">
              <strong>
                ¿Puedo cambiar el contenido del anuncio después de comprarlo?
              </strong>{" "}
              <br />
              No, una vez que el anuncio ha sido creado, no se puede modificar
              el contenido.
            </Typography>
          </div>
        </>
      ) : (
        <PurchaseBuyAds onClose={onClose} selectedAd={selectedAd} />
      )}
    </div>
  );
}
