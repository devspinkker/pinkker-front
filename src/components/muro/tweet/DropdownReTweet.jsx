import React from "react";
import "./DropdownReTweet.css";

export default function DropdownReTweet({ closePopup, reTweet, citeTweet }) {
  return (
    <div className="dropdownretweet-body">
      <div className="dropdownretweet-container">
        <div
          onClick={(e) => {
            e.stopPropagation();
            reTweet();
            closePopup();
          }}
          className="dropdownretweet-card"
        >
          <i
            style={{ fontSize: "14px", width: "25px" }}
            className="fas fa-retweet"
          />
          <h3>Retwittear</h3>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            citeTweet();
          }}
          className="dropdownretweet-card"
        >
          <i
            style={{ fontSize: "14px", width: "25px" }}
            className="fas fa-pen-square"
          />
          <h3>Citar</h3>
        </div>
      </div>
    </div>
  );
}
