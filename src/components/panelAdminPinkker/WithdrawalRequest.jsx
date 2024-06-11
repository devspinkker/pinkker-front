import React, { useState } from "react";
import "./WithdrawalRequest.css"; // Importa el archivo CSS
import { PanelAdminPinkkerInfoUser } from "../../services/backGo/user";
import UserStreamInfoPanel from "./UserStreamInfoPanel"; // Importa el nuevo componente
import {
  AcceptWithdrawal,
  RejectWithdrawal,
} from "../../services/backGo/withdraw"; // Importa ambas funciones

export default function WithdrawalRequest({ withdrawalRequestInfo, Code }) {
  const [userInfo, setUserInfo] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const [rejectReason, setRejectReason] = useState(""); // Estado para el texto de rechazo

  const handleAcceptWithdrawal = async (id) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      const res = await AcceptWithdrawal(Code, id, token);
      if (res?.message) {
      }
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      const res = await RejectWithdrawal(Code, id, rejectReason, token);
      if (res?.message) {
      }
    }
  };

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
        <div key={request.id} className="">
          <div className="card">
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
            <button
              className="button"
              onDoubleClick={() => handleRejectWithdrawal(request.id)}
            >
              Reject Withdrawal
            </button>
            <input
              style={{
                color: "#fff",
                background: "#000",
              }}
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo del rechazo"
            />
          </div>
          {userInfo &&
            streamInfo &&
            userInfo.NameUser === request.RequesteNameUser && (
              <UserStreamInfoPanel
                Code={Code}
                userInfo={userInfo}
                streamInfo={streamInfo}
              />
            )}
        </div>
      ))}
    </div>
  );
}
