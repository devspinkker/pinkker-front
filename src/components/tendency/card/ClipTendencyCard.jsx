import React from "react";

import "./ClipTendencyCard.css";

export default function ClipTendencyCard(props) {
  function timeSince(date) {
    const date2 = new Date(date).getTime();

    var seconds = Math.floor((new Date().getTime() - date2) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " años";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " meses";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " días";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " horas";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutos";
    }
    return Math.floor(seconds) + " segundos";
  }

  return (
    <div className="cliptendencycard-body">
      <div className="cliptendencycard-image">
        <img
          style={{
            width: "380px",
            height: "224px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
          src={props.image}
          alt=""
        />
      </div>
      <div className="cliptendencycard-info">
        {props.tendencyRequired && (
          <h4 style={{ color: "#f36196" }}>#{props.tendency} EN TENDENCIAS</h4>
        )}

        <p style={{ color: "darkgray", fontSize: "13px", display: "flex" }}>
          <img
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "30px",
              padding: "5px 10px 0px 0px",
            }}
            src={props.Avatar}
            alt=""
          />
          {props.streamer} • {props.views} de vistas • hace{" "}
          {timeSince(props.createdAt)}
        </p>
        <h3 style={{ margin: "5px auto" }}>{props.title}</h3>

        <p style={{ marginTop: "5px", color: "darkgray", fontSize: "13px" }}>
          {props.categorie}
        </p>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          {props.tags != null &&
            props.tags.map((tag) => (
              <h4 className="video-tag gray-button">{tag}</h4>
            ))}
        </div>
      </div>
    </div>
  );
}
