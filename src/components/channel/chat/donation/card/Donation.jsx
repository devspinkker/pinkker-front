import React, { useState } from "react";

import "./Donation.css";

export default function Donation({ donation, callback, index }) {
  const [width, setWidth] = useState(100);
  const [clearAnimation, setClearAnimation] = useState(false);
  const [intervalID, setIntervalID] = useState(null);

  function getDurationPerAmount(amount) {
    if (amount <= 600) {
      return 60;
    }

    if (amount > 600 && amount <= 1200) {
      return 90;
    }

    if (amount > 1200 && amount <= 3000) {
      return 120;
    }

    if (amount > 3000 && amount <= 6000) {
      return 300;
    }
  }

  function getColorFromAmount(amount) {
    if (amount <= 600) {
      return { colorPrimary: "#1F2DA5", colorSecondary: "#162077" };
    }

    if (amount > 600 && amount <= 1200) {
      return { colorPrimary: "#1EACB0", colorSecondary: "#167477" };
    }

    if (amount > 1200 && amount <= 3000) {
      return { colorPrimary: "#A19A1B", colorSecondary: "#7C7717" };
    }

    if (amount > 3000 && amount <= 6000) {
      return { colorPrimary: "#A16E1B", colorSecondary: "#86590F" };
    }
  }

  function getTime() {
    const startDate = new Date(donation?.TimeStamp);
    startDate.setSeconds(
      startDate.getSeconds() + getDurationPerAmount(donation?.Pixeles)
    );
    const nowDate = new Date();

    var difference = startDate.getTime() - nowDate.getTime();

    var seconds = Math.floor(difference / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    setWidth((prev) => {
      if (prev > 0) {
        return seconds - 1;
      }

      setClearAnimation(true);
      clearInterval(intervalID);
      return prev;
    });
  }

  React.useEffect(() => {
    getTime();
    const id = setInterval(function () {
      getTime();
    }, 1000);
    setIntervalID(id);
  }, []);

  return (
    <div
      style={{
        // marginLeft: "15px",
        // marginBottom: "5px",
        animation:
          width > 0 && index === 0 ? "slideToTop 2s" : "closeCardDonation 6s",
        width: "100%",
      }}
      className="chat-donation-card"
      onClick={() => {
        callback();
        if (index === 0) {
          // ShowAllDonations(false);
        }
      }}
    >
      <div
        style={{
          width: width + "px",
          // backgroundColor: getColorFromAmount(donation?.Pixeles)
          //   ?.colorSecondary,
        }}
        className="chat-donatino-card-percent"
      ></div>
      <div className="chat-donation-card-image">
        <img
          style={{
            width: "25px",
            borderRadius: "50px",
            margin: "5px",
            // paddingRight: "5px",
          }}
          src={donation?.FromUserInfo.Avatar}
          alt=""
        />
        <span style={{ color: "#fff" }}>{donation?.FromUserInfo.NameUser}</span>
      </div>
      {/*<div className="chat-donation-card-triangulo"></div>*/}
      <div className="chat-donation-card-text">
        <h5
          style={{
            fontFamily: "Poppins",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            style={{ width: "17px", marginRight: "5px" }}
            src="/images/pixel.png"
          />
          {donation?.Pixeles}
        </h5>
      </div>
    </div>
  );
}
