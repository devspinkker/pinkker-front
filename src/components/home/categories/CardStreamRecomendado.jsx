import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

export default function CardStreamRecomendado(props) {
  const tags = [];

  getTagsWithLimit(props.tags, 2);

  async function getTagsWithLimit(tag, limit) {
    for (let i = 0; i < tag?.length; i++) {
      if (i < limit) {
        tags.push(tag[i]);
      }
    }
  }

  function getCard() {
    return (
      <div
        style={{
          position: props.isLoading && "absolute",
          opacity: props.isLoading && "0",
          margin: "3px",
        }}
        className="home-categories-car-recomendado"
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
          <div className="home-categories-span-2">
            <span style={{ fontSize: "15px", cursor: "pointer" }}>
              {props.ViewerCount} espectadores
            </span>
          </div>
        </div>
        <div className="user_data_contain">
          <div className="user_data_contain_avatar_name">
            <img
              src={props.avatarStreamer}
              alt=""
              style={{
                width: "41px",
                borderRadius: " 50%",
                marginRight: " 15px",
              }}
            />

            <div className="home-categories-p-1">
              <Link
                className="home-categories-link-hover"
                style={{ textDecoration: "none" }}
                to={"/" + props.name}
              >
                <p className="home-categories-p-1-name">{props.name}</p>
              </Link>
            </div>
          </div>
          <div className="stream_data_card">
            <div className="home-categories-p-2">
              <p style={{ fontSize: "17px", cursor: "pointer" }}>
                {props.title}
              </p>
            </div>

            <div className="categories-card-tag-container">
              {tags.map((tag) => (
                <a style={{ fontSize: "12px" }} className="categorie-card-tag">
                  {tag}
                </a>
              ))}
              <Link to={"/categorie/" + props.categorie}>
                <span
                  style={{
                    fontSize: "12px",
                  }}
                  className="categorie-card-tag"
                >
                  {props.categorie}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{getCard()}</>;
}