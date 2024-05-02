import React, { useState, useEffect } from "react";

import "./PurchasePopup.css";

import { useSelector } from "react-redux";

import { createOrder } from "../../services/order";

import { createMpOrder, createPaypalOrderr } from "../../services/purchase";

import { getPrices } from "../../services/server";
import { compradePixelesBiancePay } from "../../services/backGo/user";

export default function PurchasePopup({ amountt, closePopup }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);

  const [amount, setAmount] = useState(amountt);

  const [prices, setPrices] = useState(null);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const data = await getPrices(token);
  //       if (data != null && data != undefined) {
  //         setPrices(data);
  //       }
  //     };
  //     fetchData();
  //   }, [token]);

  async function handleSubmit() {
    const iduser = window.localStorage.getItem("_id");
    try {
      const data = await compradePixelesBiancePay(iduser, amount);
      if (data?.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitPaypal() {
    const data = await createOrder(token, amount);
    if (data != null && data != undefined) {
      const dataMp = await createPaypalOrderr(token, 0, data.data.order);
      if (dataMp != null && dataMp != undefined) {
        window.location.href = dataMp.data.data;
      }
    }
  }

  function getNewDateSuscription() {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function getTotalPrice() {
    return amount * 1.21;
  }

  return (
    <div className="purchase-popup-body">
      <div className="purchase-popup-container">
        <div style={{ padding: "30px" }}>
          <div className="purchase-popup-close">
            <button
              className="purchase-popup-button-close pinkker-button-more"
              onClick={closePopup}
            >
              <i class="fas fa-times" />
            </button>
          </div>
          <div className="purchase-popup-title">
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

          <div className="purchase-popup-primary">
            <div className="purchase-popup-primary-resume">
              <p style={{ fontSize: "16px", fontWeight: "800" }}>
                Resumen de la compra
              </p>
              <div className="purchase-popup-product">
                <img style={{ width: "50px" }} src="/images/pinkker.png" />
                <div>
                  <p style={{ fontSize: "14px" }}>
                    Paquete de {amount} pixeles
                  </p>
                  {/* <p style={{ color: "darkgray", fontSize: "14px" }}>
                    Renovación de suscripción {getNewDateSuscription()}.
                  </p> */}
                </div>
              </div>
            </div>

            {/* <div className="purchase-popup-primary-quantity">
              <p style={{ fontSize: "16px", fontWeight: "800" }}>Cantidad</p>
              <select
                className="purchase-popup-primary-quantity-select"
                defaultValue={1}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
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
            {/* <p
              style={{ fontWeight: "800", fontSize: "16px", color: "#ededed" }}
            >
              ¿Tienes una Tarjeta regalo de{" "}
              <img
                style={{ width: "55px", position: "relative", top: "2px" }}
                src="/images/logo.png"
              />
              ?{" "}
              <a style={{ color: "#f36196", cursor: "pointer" }}>Canjéala ya</a>
            </p> */}
            <h3 style={{ fontFamily: "Poppins", color: "white" }}>
              Total con IVA{" "}
              <a style={{ marginLeft: "50px", fontFamily: "Poppins" }}>
                ${getTotalPrice()} ARS
              </a>
            </h3>
          </div>
        </div>

        <div className="purchase-popup-secondary">
          <div style={{ padding: "30px" }}>
            <div className="purchase-popup-secondary-title">
              <p style={{ fontWeight: "800", fontSize: "16px" }}>Pagar con</p>
              <p style={{ fontSize: "14px", color: "darkgray" }}>
                <i class="fas fa-lock" /> Seguro
              </p>
            </div>

            <div className="purchase-popup-secondary-buttons">
              <button
                onClick={() => handleSubmit()}
                className="purchase-popup-secondary-button-mp"
              >
                <img
                  style={{ width: "45px", marginRight: "10px" }}
                  src="/images/mp.png"
                />{" "}
                Mercado Pago
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
