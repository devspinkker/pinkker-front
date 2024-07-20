import React, { useState, useEffect } from "react";

import "./Gallery.css";

import { useSelector } from "react-redux";

import AddPopupGallery from "./popup/AddPopupGallery";

import { useNotification } from "../../Notifications/NotificationProvider";
import ViewPopupGallery from "./popup/ViewPopupGallery";

import Skeleton from "@mui/material/Skeleton";

export default function Gallery({
  unlocked,
  gallerys,
  streamer,
  reloadGallery,
}) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [popupGallery, setPopupGallery] = useState(false);
  const [popupGalleryView, setPopupGalleryView] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);

  const alert = useNotification();

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 300);

  function togglePopupGallery() {
    setPopupGallery(!popupGallery);
  }

  function togglePopupGalleryView(img, gallery) {
    setSelectedImage(img);
    setSelectedGallery(gallery);
    setPopupGalleryView(!popupGalleryView);
  }

  async function reloadData() {}

  return (
    <div className="channel-gallery-body">
      {gallerys && (
        <div className="channel-gallery-container">
          {isLoading === false
            ? gallerys.map((gallery) => (
                <div
                  onClick={() =>
                    togglePopupGalleryView(
                      unlocked ? gallery.photo : gallery.photoBlocked,
                      gallery
                    )
                  }
                  className="channel-gallery-card"
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src={unlocked ? gallery.photo : gallery.photoBlocked}
                    alt=""
                  />
                  <div className="channel-gallery-image-pinkker">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <i style={{ fontSize: "22px" }} class="fas fa-heart" />
                      <h3 style={{ fontFamily: "Poppins", marginLeft: "5px" }}>
                        {gallery.likes.length}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <i
                        style={{ fontSize: "22px", marginLeft: "10px" }}
                        class="fas fa-comment"
                      />
                      <h3 style={{ fontFamily: "Poppins", marginLeft: "5px" }}>
                        {gallery.comments ? gallery.comments : 0}
                      </h3>
                    </div>
                  </div>
                </div>
              ))
            : gallerys.map((gallery) => (
                <div style={{ marginRight: "15px", marginTop: "20px" }}>
                  <Skeleton
                    variant="rectangular"
                    width={285}
                    height={285}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                </div>
              ))}

          {user.name === streamer && (
            <div
              onClick={() => togglePopupGallery()}
              className="channel-gallery-card"
            >
              <div
                style={{ opacity: "1" }}
                className="channel-gallery-image-pinkker"
              >
                <i
                  style={{
                    fontSize: "26px",
                    backgroundColor: "black",
                    padding: "7px",
                    borderRadius: "5px",
                    width: "45px",
                    textAlign: "center",
                  }}
                  class="fas fa-plus"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {popupGallery === true && (
        <AddPopupGallery
          reloadData={() => reloadGallery()}
          closePopup={() => togglePopupGallery()}
        />
      )}
      {popupGalleryView === true && (
        <ViewPopupGallery
          image={selectedImage}
          gallery={selectedGallery}
          closePopup={() => togglePopupGalleryView()}
        />
      )}
    </div>
  );
}
