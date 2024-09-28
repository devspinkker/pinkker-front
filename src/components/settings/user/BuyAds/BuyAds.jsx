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
              adapte a tus necesidades. También podrás ver estadísticas
              detalladas de los anuncios para evaluar su rendimiento.
            </Typography>
          </div>

          <div className="ads-options">
            <Typography variant="h5" className="options-title">
              Opciones de Anuncios
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
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
                      <strong>Muro:</strong> Este tipo de anuncio selecciona una
                      publicación a promocionar mediante su ID, permitiendo
                      incluir imagen, texto y un enlace de referencia. Cada clic
                      en el enlace cuesta 75 píxeles. La campaña termina cuando
                      se alcanza el número máximo de clics únicos.
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

              <Grid item xs={12} md={4}>
                <Card className="ad-card streams">
                  <CardContent>
                    <Typography variant="h6" className="card-title">
                      Anuncio en Streams
                    </Typography>
                    <Typography variant="body2" className="card-description">
                      Muestra tu anuncio en los streams de nuestros creadores,
                      quienes podrán decidir cuándo mostrarlo.
                    </Typography>
                    <Typography variant="body1" className={`price streams`}>
                      Precio: $20 por impresión
                    </Typography>
                    <Typography variant="body2" className="ad-details">
                      <strong>Streams:</strong> Los anuncios se muestran durante
                      los streams en formato de video con un enlace a una página
                      específica. Los streamers controlan cuándo mostrar los
                      anuncios, y las impresiones se cuentan cada vez que se
                      muestra el anuncio,Se mostrará todo el video, pero con la
                      posibilidad de omitirlo 3 segundos después de su inicio.
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

              <Grid item xs={12} md={4}>
                <Card className="ad-card clips">
                  <CardContent>
                    <Typography variant="h6" className="card-title">
                      Anuncio en Clips
                    </Typography>
                    <Typography variant="body2" className="card-description">
                      Tu anuncio se mostrará como un clip regular, pero con
                      funcionalidades específicas para anuncios.
                    </Typography>
                    <Typography variant="body1" className={`price muro`}>
                      Precio: $75 por clic
                    </Typography>
                    <Typography variant="body2" className="ad-details">
                      <strong>Restricciones:</strong> Los anuncios no permiten
                      comentarios. Sin embargo, los usuarios pueden dar "like" a
                      los anuncios.
                    </Typography>
                    <Typography variant="body2" className="ad-details">
                      <strong>Clics:</strong> Cada clic en el enlace de
                      referencia asociado costará $75 y se registrará como único
                      por usuario.
                    </Typography>
                    <Typography variant="body2" className="ad-details">
                      <strong>Estadísticas:</strong> Tendrás acceso a
                      estadísticas detalladas sobre el rendimiento, incluyendo
                      clics totales y conversiones.
                    </Typography>
                    <Button
                      onClick={() => handleAdSelect("ClipAds")}
                      variant="contained"
                      className="buy-button"
                    >
                      Comprar Anuncio en Clips
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
                ¿Cómo se muestran los anuncios en los streams y el muro?
              </strong>{" "}
              <br />
              En los streams, los streamers deciden cuándo mostrar el anuncio.
              Cada impresión incluye un video publicitario con un enlace de
              referencia. En el muro, los anuncios son publicaciones
              seleccionadas, mostradas cada cierta cantidad de posts, con clics
              contados solo una vez por usuario.
            </Typography>
            <Typography variant="body1" className="faq-description">
              <strong>
                ¿Puedo ver estadísticas sobre el rendimiento de mi anuncio?
              </strong>{" "}
              <br />
              Sí, ofrecemos estadísticas detalladas para que puedas medir el
              rendimiento de tu campaña, incluyendo la cantidad de clics,
              impresiones y conversiones.
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
