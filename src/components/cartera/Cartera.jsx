import React, { useState, useEffect } from "react";

import "./Cartera.css";

import { useSelector } from "react-redux";

import WithdrawPopup from "./popup/WithdrawPopup";

import { getMyWithdraw } from "../../services/withdraw";

import { ScaleLoader } from "react-spinners";

import Tippy from "@tippyjs/react";

import { useNotification } from "../Notifications/NotificationProvider";

export default function Cartera({ user }) {
  const token = useSelector((state) => state.token);

  // function formatNumbersWithCommas(x) {
  //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }

  const [withdraws, setWithdraws] = useState(null);

  const [showWithdraw, setShowWithdraw] = useState(false);

  const [type, setType] = useState(0);

  const alert = useNotification();

  const openWithdraw = () => {
    setShowWithdraw(!showWithdraw);
  };

  useEffect(() => {
    console.log(user);
    if (token != null && token != undefined && token != "") {
      const fetchData = async () => {
        const data = await getMyWithdraw(token);
        if (data != null && data != undefined && data.status == 200) {
          setWithdraws(data);
        }
      };

      fetchData();
    }
  }, [token]);

  function reloadData() {
    if (token != null && token != undefined && token != "") {
      const fetchData = async () => {
        const data = await getMyWithdraw(token);
        if (data != null && data != undefined && data.status == 200) {
          setWithdraws(data);
        }
      };

      fetchData();
    }
  }

  function getStatus(status) {
    if (status === 0) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "8px",
          }}
        >
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Pendiente
              </h1>
            }
          >
            <i
              style={{
                fontSize: "20px",
                color: "#DEB756",
                borderRadius: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              class="fas fa-exclamation-circle"
            />
          </Tippy>
        </div>
      );
    }
    if (status === 1) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "10px",
          }}
        >
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Exitoso
              </h1>
            }
          >
            <i
              style={{
                width: "20px",
                height: "20px",
                fontSize: "10px",
                backgroundColor: "#4FC66F",
                borderRadius: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              class="fas fa-check"
            />
          </Tippy>
        </div>
      );
    }
    if (status === 2) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "10px",
          }}
        >
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Error
              </h1>
            }
          >
            <i
              style={{
                width: "20px",
                height: "20px",
                fontSize: "10px",
                backgroundColor: "#DE5656",
                borderRadius: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              class="fas fa-times"
            />
          </Tippy>
        </div>
      );
    }
  }

  function getLeftForType() {
    if (type === 0) {
      return "365px";
    }

    if (type === 1) {
      return "460px";
    }
  }

  function formatDate(date) {
    var date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return day + "/" + month + "/" + year;
  }

  function getType() {
    if (type === 0) {
      return (
        <div className="cartera-history">
          <div
            style={{
              width: "100%",
              marginTop: "20px",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
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
          </div>

          {/*<div className="cartera-history-card">
                        <div style={{marginLeft: "10px"}} className="cartera-history-card-name">
                            <h4>asd123</h4>
                        </div>

                        <div className="cartera-history-card-destino">
                            <h4>Suscripción</h4>
                        </div>
                        <div style={{width: "20%"}} className="cartera-history-card-amount">
                            <h4 style={{display: "flex", alignItems: "center"}}>400 <img style={{width: "20px", marginLeft: "5px"}} src="/images/pixel.png" /></h4>
                        </div>

                        <div style={{textAlign: "center"}} className="cartera-history-card-status">
                            {getStatus(2)}
                        </div>
                        <div className="cartera-history-card-date">
                            <h4>13/03/2023</h4>
                        </div>

            </div>*/}
        </div>
      );
    }

    if (type === 1) {
      return (
        <div className="cartera-history">
          <div
            style={{
              width: "100%",
              marginTop: "20px",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
          {/* 
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
              <p style={{ width: "30%" }}>Destino</p>
              <p style={{ width: "10%" }}>Monto</p>
              <p style={{ width: "10%" }}>Metodo</p>
              <p style={{ width: "20%" }}>Fecha</p>
              <p style={{ width: "10%" }}>Estado</p>
            </div>
            {withdraws != null ? (
              withdraws.map((withdraw, index) => (
                <div className="cartera-history-card">
                  <div
                    style={{ marginLeft: "10px" }}
                    className="cartera-history-card-name"
                  >
                    <h4>{withdraw.name}</h4>
                  </div>

                  <div className="cartera-history-card-destino">
                    <h4>
                      {withdraw.method === 0 ? withdraw.cbu : withdraw.email}
                    </h4>
                  </div>
                  <div className="cartera-history-card-amount">
                    <h4 style={{ display: "flex", alignItems: "center" }}>
                      {formatNumbersWithCommas(withdraw.amount)}{" "}
                      <img
                        style={{ width: "20px", marginLeft: "5px" }}
                        src="/images/pixel.png"
                      />
                    </h4>
                  </div>

                  <div className="cartera-history-card-status">
                    <h4>
                      {withdraw.method === 0 ? (
                        <img style={{ width: "30px" }} src="/images/mp.png" />
                      ) : (
                        <img
                          style={{ width: "30px" }}
                          src="/images/paypal.png"
                        />
                      )}
                    </h4>
                  </div>
                  <div className="cartera-history-card-date">
                    <h4>{formatDate(withdraw.createdAt)}</h4>
                  </div>
                  <div className="cartera-history-card-method">
                    {getStatus(withdraw.status)}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <ScaleLoader color="#f36197d7" />
              </div>
            )}
          </div> */}
        </div>
      );
    }
  }

  return (
    <div className="cartera-body">
      <div className="cartera-container">
        <div style={{ width: "100%", height: "50px" }} />
        <h2 style={{ color: "white", marginBottom: "10px" }}>
          Balance de cuenta
        </h2>

        <div className="cartera-balance">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h1 style={{ color: "white", marginRight: "10px" }}>
                  {user.Pixeles}
                </h1>
                <img style={{ width: "30px" }} src="/images/pixel.png" />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5px",
                  color: "darkgray",
                }}
              >
                <h3 style={{ marginRight: "10px", fontSize: "14px" }}>
                  {/* {user.Pixeles} */}
                </h3>
              </div>
            </div>
            <button
              /*onClick={() => openWithdraw()}*/ className="cartera-balance-button"
            >
              Retirar fondos
            </button>
          </div>
        </div>

        <div
          style={{
            width: "95%",
            margin: "0 auto",
            borderTop: "0.01em solid #2b2b2b3f",
            marginTop: "20px",
            marginBottom: "20px",
          }}
          className="type-set"
        >
          <div
            onClick={() => setType(0)}
            className={type === 0 ? "type-card active" : "type-card"}
          >
            <h3>INGRESOS</h3>
          </div>
          <div
            onClick={() => setType(1)}
            className={type === 1 ? "type-card active" : "type-card"}
          >
            <h3>RETIROS</h3>
          </div>
          <div style={{ left: getLeftForType() }} className="type-line"></div>
        </div>

        {getType()}
      </div>

      {showWithdraw && (
        <WithdrawPopup
          reloadData={() => reloadData()}
          closePopup={() => openWithdraw()}
        />
      )}
    </div>
  );
}
