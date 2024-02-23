import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CardCategorie.css";

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
            height: props?.height,
          }}
          className="custom-categories-card"
        >
          <div className="custom-categories-card-contain">
            <Link to={"/categorie/" + props.name}>
              <div
                style={{
                  background: ` ${dominantColor}`,
                }}
                className="custom-categories-card-contain-pinkker"
              >
                <span>PINKKER</span>
              </div>
              <img
                style={{
                  border: `3px solid ${dominantColor}`,
                }}
                className="img-categorie-card"
                src={props.image}
                loading={"lazy"}
                alt=""
              />
            </Link>
          </div>
          <div className="user_data_contain">
            <div className="custom-categories-p-2">
              <span id="pulsatingDot" />
              <p className="custom-categories-p-2-spectators">
                <span>{formatViewers(props.spectators)}</span>espectadores
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
