import React, { useState, useEffect } from "react";
import "./WithdrawPopup.css";
import { useSelector } from "react-redux";
import { useNotification } from "../../Notifications/NotificationProvider";
import { ScaleLoader } from "react-spinners";
import { getMyWithdraw } from "../../../services/withdraw";
import { withdrawalRequest } from "../../../services/backGo/withdraw";

export default function WithdrawPopup({ closePopup, reloadData, user }) {
  const [methodPay, setMethodPay] = useState(0);
  const [email, setEmail] = useState(null);
  const [amount, setAmount] = useState(null);
  const [cbu, setCbu] = useState(null);

  const alert = useNotification();

  function formatNumbersWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async function handleSubmit() {
    if (methodPay === null || methodPay === undefined || methodPay === "") {
      alert({ type: "ERROR", message: "Debe seleccionar un metodo de pago" });
      return;
    }

    if (methodPay === 0) {
      if (cbu === null || cbu === undefined || cbu === "") {
        alert({ type: "ERROR", message: "Debe ingresar un CBU" });
        return;
      }

      if (amount === null || amount === undefined || amount === "") {
        alert({ type: "ERROR", message: "Debe ingresar un monto" });
        return;
      }

      if (amount < 1000) {
        alert({
          type: "ERROR",
          message: "El monto minimo para retirar es de $1000",
        });
        return;
      }

      if (amount > 100000) {
        alert({
          type: "ERROR",
          message: "El monto maximo para retirar es de $100000",
        });
        return;
      }
    }

    if (methodPay === 1) {
      if (email === null || email === undefined || email === "") {
        alert({ type: "ERROR", message: "Debe ingresar un email" });
        return;
      }

      if (amount === null || amount === undefined || amount === "") {
        alert({ type: "ERROR", message: "Debe ingresar un monto" });
        return;
      }

      if (amount < 1000) {
        alert({
          type: "ERROR",
          message: "El monto minimo para retirar es de $1000",
        });
        return;
      }

      if (amount > 100000) {
        alert({
          type: "ERROR",
          message: "El monto maximo para retirar es de $100000",
        });
        return;
      }
    }
    let token = window.localStorage.getItem("token");
    const res = await withdrawalRequest(token, amount, cbu);
    if (res != null && res != undefined) {
      alert({ type: "SUCCESS" });
      reloadData();
      closePopup();
    }
  }

  function getType() {
    if (methodPay === 0) {
      return (
        <div className="withdraw-popup-method-mp">
          <div style={{ marginTop: "25px" }}>
            <h3 style={{ color: "#ededed", fontSize: "14px" }}>
              Ingrese su CBU | CVU | Alias
            </h3>
            <input
              onChange={(e) => setCbu(e.target.value)}
              className="withdraw-popup-input"
              type="text"
              placeholder=""
            />
          </div>

          <div style={{ marginTop: "25px" }}>
            <h3 style={{ color: "#ededed", fontSize: "14px" }}>
              Ingrese el monto a retirar
            </h3>
            <input
              onChange={(e) => setAmount(e.target.value)}
              className="withdraw-popup-input"
              type="number"
              placeholder="Monto"
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="withdraw-popup-body">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className={"withdraw-popup-container"}>
          <div style={{ height: "0px" }} className="usersettings-popup-close">
            <button onClick={closePopup}>
              <i
                style={{ fontSize: "18px" }}
                className="fas fa-times pinkker-button-more"
              />
            </button>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", color: "#ededed" }}
          >
            <h3>Tienes {} </h3>
            <h3
              style={{
                color: "lightgray",
                marginRight: "10px",
                marginLeft: "5px",
              }}
            >
              {user && user.Pixeles && formatNumbersWithCommas(user.Pixeles)}
            </h3>
            <img style={{ width: "30px" }} src="/images/pixel.png" />
          </div>

          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          />

          <div style={{ height: "250px", marginTop: "20px" }}>{getType()}</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
            }}
          >
            <button
              onClick={() => handleSubmit()}
              className="withdraw-popup-send"
            >
              Retirar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
