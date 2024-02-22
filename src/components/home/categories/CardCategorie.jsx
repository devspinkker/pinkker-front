import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CardCategorie.css";

function getDominantColor(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      const colorMap = new Map();
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const color = `${r},${g},${b}`;
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }

      let maxCount = 0;
      let dominantColor = "0,0,0";
      colorMap.forEach((count, color) => {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      });

      resolve(dominantColor);
    };

    img.onerror = function () {
      reject(new Error("No se pudo cargar la imagen"));
    };

    img.src = imageSrc;
  });
}

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
    const img = new Image();
    img.src = props.image;
    img.onload = async () => {
      setImage(true);
      // try {
      //   const color = await getDominantColor(img.src);
      //   console.log(color);
      //   setDominantColor(`rgb(${color})`);
      // } catch (error) {
      //   console.error("Error al obtener el color más fuerte:", error);
      // }
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
