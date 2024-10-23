import React, { useState } from "react";
import { AcceptOrDeleteAdvertisement } from "../../../../services/backGo/advertisements";

// Componente para mostrar los anuncios de una comunidad seleccionada
const AnunciosComunidad = ({ anuncios }) => {
  const token = window.localStorage.getItem("token");

  console.log("anuncios");
  console.log(anuncios);

  const handleAcceptPending = async (AdId) => {
    const res = await AcceptOrDeleteAdvertisement({
      action: true,
      AdId,
      token,
    });
    console.log(res);
  };
  const handleRejectPending = async (AdId) => {
    const res = await AcceptOrDeleteAdvertisement({
      action: false,
      AdId,
      token,
    });
    console.log(res);
  };

  return (
    <div>
      <h3>Anuncios de la comunidad</h3>
      <div className="pending-ads">
        {anuncios.length > 0 ? (
          <div className="pending-ads-list">
            {anuncios.map((ad) => (
              <div key={ad.id} className="ad-item">
                <div className="ad-details">
                  <h3>{ad.Name}</h3>
                  <p>NameUser: {ad.NameUser}</p>
                  <p>Destination: {ad.Destination}</p>
                  <p>Categorie: {ad.Categorie}</p>
                  <p>UrlVideo: {ad.UrlVideo}</p>
                  <p>ReferenceLink: {ad.ReferenceLink}</p>
                  <p>ImpressionsMax: {ad.ImpressionsMax}</p>
                  <p>ClicksMax: {ad.ClicksMax}</p>
                  <p>DocumentToBeAnnounced: {ad.DocumentToBeAnnounced}</p>
                </div>
                <button onDoubleClick={() => handleAcceptPending(ad.id)}>
                  Accept
                </button>
                <button onDoubleClick={() => handleRejectPending(ad.id)}>
                  Reject
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending ads available.</p>
        )}
      </div>
    </div>
  );
};
export default AnunciosComunidad;
