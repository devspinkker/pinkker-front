import React, { useState } from "react";

import "./PurchasePrimePopup.css";

import { useSelector } from "react-redux";

import { purchasePinkkerPrime } from "../../../../../services/purchase";

import { useNotification } from "../../../../Notifications/NotificationProvider";
import { PurchasePinkkerPrime } from "../../../../../services/backGo/user";

export default function PurchasePrimePopup({ closePopup }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = localStorage.getItem("token");
  const [amount, setAmount] = useState(500);

  const [months, setMonths] = useState(1);

  const alert = useNotification();

  async function handleSubmit() {
    const data = PurchasePinkkerPrime(token);
    if (data != null && data != undefined) {
      alert({ type: "SUCCESS" });
      closePopup();
    }
  }

  function getNewDateSuscription() {
    var date = new Date();
    date.setMonth(date.getMonth() + months);

    const day = date.getDate();
    const month = date.getMonth() + months;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="purchaseprime-popup-body">
      <div className="purchaseprime-popup-container">
        <div style={{ padding: "30px" }}>
          <div className="purchaseprime-popup-close">
            <button
              className="purchaseprime-popup-button-close pinkker-button-more"
              onClick={closePopup}
            >
              <i class="fas fa-times" />
            </button>
          </div>
          <div className="purchaseprime-popup-title">
            <h2>Completar compra</h2>
          </div>

          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <div className="purchaseprime-popup-primary">
            <div className="purchaseprime-popup-primary-resume">
              <p style={{ fontSize: "16px", fontWeight: "800" }}>
                Resumen de la compra
              </p>
              <div className="purchaseprime-popup-product">
                <img
                  style={{ width: "40px", marginRight: "10px" }}
                  src="https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
                />
                <div>
                  <p style={{ fontSize: "14px" }}>Pinkker Prime</p>
                  <p style={{ color: "darkgray", fontSize: "14px" }}>
                    Renovación de prime {getNewDateSuscription()}.
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="purchaseprime-popup-primary-quantity">
                            <p style={{fontSize: "16px", fontWeight: "800"}}>Cantidad de meses</p>
                            <select onChange={(e) => setMonths(e.target.value)} className="purchaseprime-popup-primary-quantity-select" defaultValue={1}>
                                <option value={1}>1</option>
                                <option value={3}>3</option>
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                            </select>
                        </div> */}
          </div>

          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <div
            style={{
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{ fontWeight: "800", fontSize: "16px", color: "#ededed" }}
            >
              ¿Tienes una Tarjeta regalo de{" "}
              <img
                style={{ width: "55px", position: "relative", top: "2px" }}
                src="/images/logo.png"
              />
              ?{" "}
              <a style={{ color: "#f36196", cursor: "pointer" }}>Canjéala ya</a>
            </p>
            <h3 style={{ fontFamily: "Poppins", color: "white" }}>
              Total{" "}
              <a style={{ marginLeft: "50px", fontFamily: "Poppins" }}>
                {2000 * months}{" "}
                <img
                  style={{
                    width: "25px",
                    marginLeft: "3px",
                    position: "relative",
                    top: "5px",
                  }}
                  src="/images/pixel.png"
                  alt="Pinkker Pixel"
                />
              </a>
            </h3>
          </div>

          <div
            style={{
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <p
              style={{ fontWeight: "800", fontSize: "16px", color: "#ededed" }}
            >
              Tienes {user.Pixeles}{" "}
              <img
                style={{
                  width: "20px",
                  position: "relative",
                  top: "5px",
                  marginRight: "5px",
                }}
                src="/images/pixel.png"
              />{" "}
              pixeles
            </p>
          </div>
        </div>

        <div className="purchaseprime-popup-secondary">
          <div style={{ padding: "30px" }}>
            <div className="purchaseprime-popup-secondary-title">
              <p style={{ fontWeight: "800", fontSize: "16px" }}>Pagar con</p>
              <p style={{ fontSize: "14px", color: "darkgray" }}>
                <i class="fas fa-lock" /> Seguro
              </p>
            </div>

            <div className="purchaseprime-popup-secondary-buttons">
              <button
                onClick={() => handleSubmit()}
                className="purchaseprime-popup-secondary-button-pixel"
              >
                <img
                  style={{ width: "45px", marginRight: "10px" }}
                  src="/images/pixel.png"
                />{" "}
                PIXELES
              </button>
            </div>

            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#ffffff1a",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
