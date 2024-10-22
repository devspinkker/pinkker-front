import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CardCategorie.css";
import { Typography } from "@mui/material";

export default function CustomCard(props) {

  const formatViewers = (viewers) => {
    if (viewers >= 1000) {
      return (viewers / 1000).toFixed(1) + "k";
    } else {
      if (!viewers) {
        return 0;
      }
      return viewers;
    }
  };

  const [image, setImage] = useState(false);
  const [dominantColor, setDominantColor] = useState("#8f54a0");

  useEffect(() => {
    // const img = new Image();
    // img.src = props.image;
    // img.onload = async () => {
    setImage(true);
    setDominantColor(props.TopColor);
    // };
  }, [props.image]);

  return (
    <>
      {image && (
        <div

          style={{
            position: props.isLoading && "absolute",
            opacity: props.isLoading && "0",
            height: '100%',
          }}
          className="custom-categories-card"
        >
          <div className="custom-categories-card-contain">
            <Link to={props.titulo ? "/plataform/explore?tipo=categories" : "/categorie/" + props.name}>
              {/* <div
                style={{
                  background: ` ${dominantColor}`,
                }}
                className="custom-categories-card-contain-pinkker"
              >
                <span>PINKKER</span>
              </div> */}
              <img
                style={{
                  border: `1px solid rgb(229, 224, 218)`,
                  width: `${props.width}`,
                  height: `${props.height}`,
                }}
                className="img-categorie-card"
                src={props.image}
                loading={"lazy"}
                alt=""
              />
              {props?.titulo && <span style={{ position: 'relative', top: '-188px', left: '65px' }}>Ver Todos</span>}
            </Link>
          </div>
          <Typography style={{ marginLeft: props.isMobile ? '25%' :'5px', textAlign: 'left', fontSize: 14, fontWeight: 600, width: props.isMobile && '100%' }}>{props.name}</Typography>
          <div className="user_data_contain">
            <div className="custom-categories-p-2">

              {!props.titulo && <span id="pulsatingDot" />}
              <p className="custom-categories-p-2-spectators">
                {!props?.titulo &&

                  <>
                    <span >{formatViewers(props.spectators)}</span>espectadores
                  </>
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
