import React, { useState, useEffect } from "react";
import "./Cartera.css";
import {
  AllMyPixelesDonors,
  GetDonationToken,
} from "../../services/backGo/withdraw";
import { DotLoader } from "react-spinners";
import { GetSubssChat } from "../../services/backGo/subs";

export default function Profit({ user }) {
  const [Donations, setDonations] = useState([]);
  const [Subscriptions, setSubscriptions] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const DonationTokenFunc = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const res = await AllMyPixelesDonors(token);
      if (res?.message === "ok") {
        setDonations(res.data);
      }
    }
  };

  const GetSubssChatTokenFunc = async () => {
    const token = window.localStorage.getItem("token");
    const _id = window.localStorage.getItem("_id");
    if (_id) {
      const res = await GetSubssChat(_id);
      if (res?.message === "ok") {
        setSubscriptions(res.data);
      }
    }
  };

  useEffect(() => {
    DonationTokenFunc();
    GetSubssChatTokenFunc();
  }, []);

  useEffect(() => {
    const combined = [
      ...Donations.map((donation) => ({ ...donation, type: "donation" })),
      ...Subscriptions.map((subscription) => ({
        ...subscription,
        type: "subscription",
      })),
    ];

    combined.sort(
      (a, b) =>
        new Date(b.TimeStamp || b.SubscriptionStart) -
        new Date(a.TimeStamp || a.SubscriptionStart)
    );
    setCombinedData(combined);
  }, [Donations, Subscriptions]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="cartera-history-card-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "#ededed",
          fontWeight: "600",
        }}
      >
        <p style={{ width: "20%", marginLeft: "10px" }}>Nombre</p>
        <p style={{ width: "30%" }}>Descripción</p>
        <p style={{ width: "20%" }}>Monto</p>
        <p style={{ width: "20%" }}>Fecha</p>
      </div>

      {combinedData.map((item, index) => (
        <div className="tooltip-container" key={index}>
          <div className="cartera-history-card">
            <div
              style={{ marginLeft: "10px" }}
              className="cartera-history-card-name"
            >
              <h4>{item.FromUserInfo?.NameUser || item.SubscriberNameUser}</h4>
            </div>

            <div className="cartera-history-card-destino">
              <h4>{item.type === "donation" ? "Donación" : "Suscripción"}</h4>
            </div>
            <div
              style={{ width: "20%" }}
              className="cartera-history-card-amount"
            >
              {item.type === "donation" ? (
                <h4 style={{ display: "flex", alignItems: "center" }}>
                  {item.Pixeles}{" "}
                  <img
                    style={{ width: "20px", marginLeft: "5px" }}
                    src="/images/pixel.png"
                  />
                </h4>
              ) : (
                <h4>
                  {" "}
                  1000{" "}
                  <img
                    style={{ width: "20px", marginLeft: "5px" }}
                    src="/images/pixel.png"
                  />
                </h4>
              )}
            </div>

            <div className="cartera-history-card-date">
              <h4>{formatDate(item.TimeStamp || item.SubscriptionStart)}</h4>
            </div>
          </div>

          {item.Text && (
            <div className="tooltip">
              <span className="tooltiptext">{item.Text}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
