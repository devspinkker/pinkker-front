import React from "react";
import "./VodCard.css";

export default function VodCard(props) {
  const handleCardClick = () => {
    if (props.User && props.id) {
      const url = `/${props.User.NameUser}/${props.id}`;
      window.open(url, "_blank");
    } else {
      console.error("User or id is missing");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        minWidth: props.width ? props.width : "250px",
        maxWidth: props.width ? props.width : "250px",
      }}
      className="vodcard-body"
    >
      <div className="vodcard-container">
        <div className="vodcard-image">
          <img
            className="img-video"
            style={{
              width: props.width ? props.width : "250px",
              borderRadius: "5px",
            }}
            src={
              props.image
                ? props.image
                : "https://static-cdn.jtvnw.net/previews-ttv/live_user_markitonavaja-440x248.jpg"
            }
            alt=""
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              src={props.User?.Avatar}
              alt={props.User?.NameUser}
            />
            <div
              style={{
                marginTop: "10px",
                marginLeft: "5px",
                display: "flex",
                gap: "2px",
                flexDirection: "column",
              }}
            >
              <h4 style={{ color: "white", fontSize: "14px" }}>
                {props.title}
              </h4>
            </div>
          </div>
          <p
            className="pink-hover"
            style={{ fontSize: "12px", margin: "5px auto" }}
          >
            {props.categorie}
          </p>
        </div>
      </div>
    </div>
  );
}
