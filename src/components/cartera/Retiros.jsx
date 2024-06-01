import React, { useState, useEffect } from "react";
import "./Cartera.css";
import { GetWithdrawalToken } from "../../services/backGo/withdraw";

export default function Retiros({ user }) {
  const [withdrawals, setWithdrawals] = useState([]);

  const WithdrawalTokenFunc = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const res = await GetWithdrawalToken(token);
      if (res?.message === "ok") {
        setWithdrawals(res.data);
        console.log(res.data);
      }
    }
  };

  useEffect(() => {
    WithdrawalTokenFunc();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (state) => {
    switch (state) {
      case "Accepted":
        return <span className="status accepted">Accepted</span>;
      case "rejected":
        return <span className="status rejected">Rejected</span>;
      default:
        return <span className="status pending">Pending</span>;
    }
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
        <p style={{ width: "10%" }}>Estado</p>
        <p style={{ width: "20%" }}>Fecha</p>
      </div>

      {withdrawals?.map((withdrawal, index) => (
        <div className="tooltip-container" key={index}>
          <div className="cartera-history-card">
            <div
              style={{ marginLeft: "10px" }}
              className="cartera-history-card-name"
            >
              <h4>{withdrawal.RequesteNameUser}</h4>
            </div>

            <div className="cartera-history-card-destino">
              <h4>Retiro</h4>
            </div>
            <div
              style={{ width: "20%" }}
              className="cartera-history-card-amount"
            >
              <h4 style={{ display: "flex", alignItems: "center" }}>
                {withdrawal.Amount}{" "}
                <img
                  style={{ width: "20px", marginLeft: "5px" }}
                  src="/images/pixel.png"
                />
              </h4>
            </div>

            <div
              style={{ textAlign: "center" }}
              className="cartera-history-card-status"
            >
              {getStatus(withdrawal.State)}
            </div>
            <div className="cartera-history-card-date">
              <h4>{formatDate(withdrawal.TimeStamp)}</h4>
            </div>
          </div>

          {withdrawal.TextReturn && (
            <div className="tooltip">
              <span className="tooltiptext">{withdrawal.TextReturn}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
