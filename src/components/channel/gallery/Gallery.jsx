import React, { useState, useEffect } from "react";
import "./Gallery.css";
import { useSelector } from "react-redux";
import AddPopupGallery from "./popup/AddPopupGallery";
import { useNotification } from "../../Notifications/NotificationProvider";
import ViewPopupGallery from "./popup/ViewPopupGallery";
import Skeleton from "@mui/material/Skeleton";
import { GetPostsWithImages } from "../../../services/backGo/tweet";
import ViewTweetGallery from "../../muro/popup/ViewTweetGallery";

export default function Gallery({ streamer, tyExpanded }) {
  const [popupGallery, setPopupGallery] = useState(false);
  const [popupGalleryView, setPopupGalleryView] = useState(false);
  const [gallerys, setGallerys] = useState([]); // Store posts
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // New state for selected post
  const [showTweetGallery, setShowTweetGallery] = useState(true);

  const alert = useNotification();

  // Fetch posts with images
  async function GetPostsWithImagesFunc() {
    try {
      const res = await GetPostsWithImages(streamer?.id, 1, 1);
      if (res.data && res.message === "ok") {
        setGallerys(res?.data); // Assuming response has data in res.data
        setIsLoading(false); // Loading completed when data is fetched
      }
    } catch (error) {
      console.error("Error fetching posts with images:", error);
    }
  }

  const handleCloseGallery = () => {
    setShowTweetGallery(false);
  };

  useEffect(() => {
    GetPostsWithImagesFunc();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeoutId); // Clear timeout when unmounted
  }, []);

  function togglePopupGallery() {
    setPopupGallery(!popupGallery);
  }

  function togglePopupGalleryView(img, gallery) {
    setSelectedImage(img);
    setSelectedGallery(gallery);
    setPopupGalleryView(!popupGalleryView);
  }

  function openPostView(post) {
    setSelectedPost(post); // Set the selected post
  }

  function closeGallery() {
    setSelectedPost(null); // Clear the selected post
  }

  async function reloadData() {
    await GetPostsWithImagesFunc(); // Reload gallery after changes
  }

  return (
    <div className="channel-gallery-body">
      {gallerys && (
        <div className="channel-gallery-container">
          {!isLoading
            ? gallerys
                .filter((gallery) => gallery.PostImage !== "") // Filter out posts without images
                .map((gallery) => (
                  <div
                    key={gallery._id}
                    onClick={() => openPostView(gallery)} // Update click handler
                    className="channel-gallery-card"
                  >
                    {/* Display the post image */}
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      src={gallery.PostImage}
                      alt={gallery.Status}
                    />
                    <div className="channel-gallery-image-pinkker">
                      {/* Display likes and comments */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                          style={{ fontSize: "22px" }}
                          className="fas fa-heart"
                        />
                        <h3
                          style={{ fontFamily: "Poppins", marginLeft: "5px" }}
                        >
                          {gallery.likeCount}
                        </h3>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                          style={{ fontSize: "22px", marginLeft: "10px" }}
                          className="fas fa-comment"
                        />
                        <h3
                          style={{ fontFamily: "Poppins", marginLeft: "5px" }}
                        >
                          {gallery.CommentsCount || 0}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
            : gallerys.map((gallery) => (
                <div
                  key={gallery._id}
                  style={{ marginRight: "15px", marginTop: "20px" }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={285}
                    height={285}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                </div>
              ))}

          {/* {streamer && (
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
                  className="fas fa-plus"
                />
              </div>
            </div>
          )} */}
        </div>
      )}
      {selectedPost && (
        <ViewTweetGallery
          tweet={selectedPost} // Pass the selected post as props
          closePopup={closeGallery}
          isMobile={false} // or true depending on the platform
          tyExpanded={tyExpanded}
        />
      )}
      {/* {popupGallery && (
        <AddPopupGallery
          reloadData={() => reloadData()}
          closePopup={() => togglePopupGallery()}
        />
      )} */}
      {/* {popupGalleryView && (
        <ViewPopupGallery
          image={selectedImage}
          gallery={selectedGallery}
          closePopup={() => togglePopupGalleryView()}
        />
      )} */}
    </div>
  );
}
