import React, { useState, useEffect } from "react";
import "./Explore.css";

import ExploreCategories from "./categories/ExploreCategories";
import { ScaleLoader, BarLoader } from "react-spinners";
import VideoFeed from "./VideoFeed";
import { GetClipsMostViewed } from "../../services/backGo/clip";

export default function Explore({ isMobile }) {
  const [clips, setClips] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    document.title = "Categories - Pinkker";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetClipsMostViewed(1);
        if (response.data?.message === "ok" && response.data?.data.length > 1) {
          setClips(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching clips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="explore-body">
      <VideoFeed liveVideos={clips} clipsVideos={clips} />
    </div>
  );
}
