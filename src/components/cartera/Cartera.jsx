import React, { useState, useEffect } from "react";

import "./Cartera.css";

import { useSelector } from "react-redux";

import WithdrawPopup from "./popup/WithdrawPopup";

import { getMyWithdraw } from "../../services/withdraw";

import { ScaleLoader } from "react-spinners";

import Tippy from "@tippyjs/react";

import { useNotification } from "../Notifications/NotificationProvider";
import Retiros from "./Retiros";
import Profit from "./Profits";

export default function Cartera({ user }) {
  let token = window.localStorage.getItem("token");
  const [amount, setAmount] = useState("");
  const [alias, setAlias] = useState("");

  const [withdraws, setWithdraws] = useState(null);

  const [showWithdraw, setShowWithdraw] = useState(false);

  const [type, setType] = useState(0);

  const alert = useNotification();

  const openWithdraw = () => {
    setShowWithdraw(!showWithdraw);
  };

  useEffect(() => {
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

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    console.log("Amount:", amount, "Alias:", alias);
    setShowWithdraw(false); // Close popup after submit
  };

  // const renderPopup = () => (
  //   <div className="withdraw-popup">
  //     <form onSubmit={handleWithdrawSubmit}>
  //       <h2>Retirar Fondos</h2>
  //       <div className="form-group">
  //         <label htmlFor="amount">Cantidad de Pixeles</label>
  //         <input
  //           type="number"
  //           id="amount"
  //           value={amount}
  //           onChange={(e) => setAmount(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="alias">Alias</label>
  //         <input
  //           type="text"
  //           id="alias"
  //           value={alias}
  //           onChange={(e) => setAlias(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <button type="submit">Enviar</button>
  //       <button type="button" onClick={() => setShowWithdraw(false)}>
  //         Cancelar
  //       </button>
  //     </form>
  //   </div>
  // );

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
      return "22%";
    }

    if (type === 1) {
      return "28%";
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
          <Profit />
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
          <Retiros />
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
            <button onClick={openWithdraw} className="cartera-balance-button">
              Retirar fondos
            </button>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            margin: "0 auto",
            borderTop: "0.01em solid #2b2b2b3f",
            marginTop: "20px",
            marginBottom: "20px",
            padding: "0px 25px",
          }}
          className="type-set"
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
            }}
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

            {/* <div style={{ left: getLeftForType() }} className="type-line"></div> */}
          </div>
        </div>

        {getType()}
      </div>

      {showWithdraw && (
        <WithdrawPopup
          user={user}
          reloadData={() => reloadData()}
          closePopup={() => openWithdraw()}
        />
      )}
    </div>
  );
}
