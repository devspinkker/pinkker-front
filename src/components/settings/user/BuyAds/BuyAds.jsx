import React, { useState } from "react";
import "./BuyAds.css";
import PurchaseBuyAds from "./popup/PurchaseBuyAds";

export default function BuyAds() {
  const [isPurchaseSectionVisible, setPurchaseSectionVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(true);

  // Function to handle closing the popup
  const handleClose = () => {
    setPopupVisible(false);
  };

  return (
    <div className="buy-ads-container">
      {isPopupVisible && !isPurchaseSectionVisible ? (
        <div className="presentation-section">
          <h1 className="presentation-title">Create Ads</h1>

          <div className="button-group">
            <button
              onClick={() => setPurchaseSectionVisible(true)}
              className="create-ad-btn"
            >
              Create an Advertisement
            </button>
            <button onClick={handleClose} className="close-popup-btn">
              Close
            </button>
          </div>
        </div>
      ) : (
        <PurchaseBuyAds closePopup={handleClose} />
      )}
    </div>
  );
}
