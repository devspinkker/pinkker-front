import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { Palette, getPalette } from "react-palette";
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

  // Pre render image from props
  const [image, setImage] = useState(false);
  const [dominantColor, setDominantColor] = useState("#FFFFFF"); // Color predeterminado

  useEffect(() => {
    const img = new Image();
    img.src = props.image;
    img.onload = async () => {
      setImage(true);
      // const { data } = await getPalette(img); // Obtiene el color predominante
      // setDominantColor(data.vibrant || "#FFFFFF"); // Establece el color predominante o uno predeterminado si no se encuentra
    };
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
              <div className="custom-categories-card-contain-pinkker">
                <span>PINKKER</span>
              </div>
              <img
                style={{
                  border: "3px solid black",
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
