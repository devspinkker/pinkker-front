import React, { useState, useEffect } from "react";
import "./Explore.css";

import ExploreCategories from "./categories/ExploreCategories";
import { ScaleLoader,BarLoader } from "react-spinners";

export default function Explore({ isMobile }) {
  useEffect(() => {
    document.title = "Categories - Pinkker";
    window.scrollTo(0, 0);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);

  return (
    <div className="explore-body">
      
        <div className="explore-container">
          <ExploreCategories isMobile={isMobile} />
        </div>
      
    </div>
  );
}
