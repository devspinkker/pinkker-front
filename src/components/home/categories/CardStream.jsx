import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

export default function CardStream(props) {
  const tags = [];

  //Pre render image from props
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
          className="home-categories-card"
        >
          <div className="home-categories-card-contain">
            <Link to={"/" + props.name}>
              <img
                className="home-categories-card-contain-img"
                src={props.image}
                loading={"lazy"}
                alt=""
              />
            </Link>
          </div>
          <div className="user_data_contain">
            <div className="user_data_contain_avatar_name">
              <img
                src={props.avatarStreamer}
                alt=""
                style={{
                  width: "51px",
                  borderRadius: " 50%",
                  marginRight: " 15px",
                }}
              />

              <div className="home-categories-p-1">
                <Link
                  className="home-categories-link-hover"
                  style={{ textDecoration: "none" }}
                  to={"/categorie/" + props.name}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "300",
                      letterSpacing: "0.6px",
                      marginTop: "3px",
                      cursor: "pointer",
                    }}
                  >
                    {props.name}
                  </p>
                </Link>
              </div>
            </div>
            <div className="stream_data_card">
              <div className="home-categories-p-2">
                <p style={{ fontSize: "17px", cursor: "pointer" }}>
                  {props.title}
                </p>
              </div>
              <div className="home-categories-p-2">
                <p style={{ fontSize: "15px", cursor: "pointer" }}>
                  {props.ViewerCount} espectadores
                </p>
              </div>
              <div className="categories-card-tag-container">
                {tags.map((tag) => (
                  <a
                    style={{ fontSize: "12px" }}
                    className="categorie-card-tag"
                  >
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
