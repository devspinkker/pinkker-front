import React, { useState } from "react";
import "./WithdrawalRequest.css"; // Importa el archivo CSS
import { PanelAdminPinkkerInfoUser } from "../../services/backGo/user";

import UserStreamInfoPanel from "./UserStreamInfoPanel"; // Importa el nuevo componente
import { AcceptWithdrawal } from "../../services/backGo/withdraw";

export default function WithdrawalRequest({ withdrawalRequestInfo, Code }) {
  const handleAcceptWithdrawal = async (id) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      const res = await AcceptWithdrawal(Code, id, token);
      if (res?.message) {
        console.log(res);
      }
    }
  };

  const [userInfo, setUserInfo] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);

  const handleButtonClick = async (id) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const res = await PanelAdminPinkkerInfoUser(Code, id, token);
      if (res?.message) {
        setUserInfo(res.user);
        setStreamInfo(res.stream);
      }
    }
  };

  return (
    <div className="container">
      {withdrawalRequestInfo.map((request) => (
        <div key={request.id} className="card">
          <p className="amount">Amount: ${request.Amount}</p>
          <p className="requestedBy">
            Requested By: {request.RequesteNameUser}
          </p>
          <p className="state">State: {request.State}</p>
          <p className="state">Alias/cbu/cvu: {request.Destination}</p>

          <button
            className="button"
            onClick={() => handleButtonClick(request.RequestedBy)}
          >
            Ver Información
          </button>
          <button
            className="button"
            onDoubleClick={() => handleAcceptWithdrawal(request.id)}
          >
            Accept Withdrawal
          </button>
        </div>
      ))}
      {userInfo && streamInfo && (
        <UserStreamInfoPanel
          Code={Code}
          userInfo={userInfo}
          streamInfo={streamInfo}
        />
      )}
    </div>
  );
}
