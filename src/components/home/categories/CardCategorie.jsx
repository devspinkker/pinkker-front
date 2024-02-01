import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
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
  const tags = [];

  // Pre render image from props
  const [image, setImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = props.image;
    img.onload = () => {
      setImage(true);
    };
  }, [props.image]);

  getTagsWithLimit(props.tags, 2);

  async function getTagsWithLimit(tag, limit) {
    for (let i = 0; i < tag?.length; i++) {
      if (i < limit) {
        tags.push(tag[i]);
      }
    }
  }

  function getCard() {
    if (image) {
      return (
        <div
          style={{
            position: props.isLoading && "absolute",
            opacity: props.isLoading && "0",
            margin: "3px",
            height: props?.height,
          }}
          className="custom-categories-card"
        >
          <div className="custom-categories-card-contain">
            <Link to={"/categorie/" + props.name}>
              <img
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
                {/* {props.spectators} espectadores */}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{getCard()}</>;
}
