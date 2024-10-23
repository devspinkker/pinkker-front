import React from "react";
import { useHistory } from "react-router";

export default function ComunidadFollow({ ComunidadFollow }) {
  const routerHistory = useHistory();
  console.log(ComunidadFollow);

  function onClickChangeRoute(communityId) {
    routerHistory.push(`/plataform/communities/${communityId}`);
  }

  return (
    <div className="muro-tweet-secondary-follow-card">
      <div style={{ display: "flex" }}>
        <img
          onClick={() => onClickChangeRoute(ComunidadFollow?.id)}
          style={{
            width: "25px",
            height: "25px",
            borderRadius: "50px",
            marginRight: "10px",
            marginTop: "5px",

            cursor: "pointer",
          }}
          src={ComunidadFollow?.creator?.avatar}
          alt="Community Avatar"
        />
        <div>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => onClickChangeRoute(ComunidadFollow?.id)}
          >
            {ComunidadFollow?.communityName}
          </h3>
          <p style={{ color: "darkgray", fontSize: "13px" }}>
            {ComunidadFollow?.membersCount} miembros
          </p>
        </div>
      </div>
    </div>
  );
}
