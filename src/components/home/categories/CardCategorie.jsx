import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import "./CardCategorie.css";

export default function CustomCard(props) {
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
            width: props.width ? props.width : "140px",
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
            <div>
              <div className="custom-categories-p-1">
                <Link
                  className="custom-categories-link-hover"
                  style={{ textDecoration: "none" }}
                  to={"/categorie/" + props.name}
                >
                  <p className="custom-categories-p-1-name">{props.name}</p>
                </Link>
              </div>
              <div className="custom-categories-p-2">
                <p style={{ fontSize: "15px", cursor: "pointer" }}>
                  {props.spectators} espectadores
                </p>
              </div>
              <div className="categories-card-tag-container">
                {tags.map((tag, index) => (
                  <a key={index} className="custom-card-tag">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{getCard()}</>;
}
