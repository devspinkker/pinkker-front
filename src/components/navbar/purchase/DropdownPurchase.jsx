import React, { useState, useEffect, useRef, useCallback } from "react";
import "./DropdownPurchase.css";

import { useSelector } from "react-redux";

import PurchasePopup from "../../purchase/PurchasePopup";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function DropdownPurchase({ closeNavbar, handleMessage }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);

  const [showPopupPurchase, setShowPopupPurchase] = useState(false);
  const [amount, setAmount] = useState(100);

  function togglePopupPurchase(amountt) {
    setAmount(amountt);
    setShowPopupPurchase(!showPopupPurchase);
  }

  return (
    <>
      <ul
        ref={divRef}
        className={
          click ? "dropdownpurchase-menu clicked" : "dropdownpurchase-menu"
        }
      >
        {/*<div style={{height: "300px", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <img style={{width: "100px"}} src="https://res.cloudinary.com/pinkker/image/upload/v1679518300/pinkker-trabajando_ky0e2t.png"/>
                <h3 style={{color: "white"}}>Estamos trabajando en esto... estará pronto!</h3>
            </div>
  </div>*/}

        <div style={{ width: "99%" }} className="dropdowncomunidad-container">
          <div
            style={{ width: "95%", borderBottom: "1px solid #4b4b4b8f" }}
            className="dropdowns-title-container"
          >
            <div
              style={{ display: "flex", alignItems: "center", height: "15px" }}
              className="dropdownchatconfig-link"
              onClick={closeNavbar}
            >
              <h3 style={{ width: "100%", position: "relative", left: "10px" }}>
                Comprar Pixeles
              </h3>
              <i
                onClick={handleClick}
                style={{
                  marginTop: "3px",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
                class="fas fa-times pinkker-button-more"
              ></i>
            </div>
          </div>

          <li>
            <div
              onClick={() => togglePopupPurchase(100)}
              className="dropdownpurchase-news-card"
            >
              <div>
                <img
                  style={{ width: "35px" }}
                  src="/images/donaciones/100.png"
                />
                <h3>1000 PXL</h3>
                <h4
                  style={{
                    marginTop: "10px",
                    color: "darkgray",
                    fontWeight: "600",
                  }}
                >
                  1000 AR$
                </h4>
              </div>
            </div>
            <div
              onClick={() => togglePopupPurchase(500)}
              className="dropdownpurchase-news-card"
            >
              <div>
                <img
                  style={{ width: "35px" }}
                  src="/images/donaciones/1000.png"
                />
                <h3>500 PXL</h3>
                <h4
                  style={{
                    marginTop: "10px",
                    color: "darkgray",
                    fontWeight: "600",
                  }}
                >
                  500 AR$
                </h4>
              </div>
            </div>
          </li>

          <li style={{ borderTop: "1px solid #ffffff1a" }}>
            <div
              onClick={() => togglePopupPurchase(1500)}
              style={{ width: "40%" }}
            >
              <div
                style={{ width: "100%" }}
                className="dropdownpurchase-news-card"
              >
                <div>
                  <img
                    style={{ width: "35px" }}
                    src="/images/donaciones/1000.png"
                  />
                  <h3>1500 PXL</h3>
                  <h4
                    style={{
                      marginTop: "10px",
                      color: "darkgray",
                      fontWeight: "600",
                    }}
                  >
                    1500 AR$
                  </h4>
                </div>
              </div>
              <p
                style={{ color: "#f36196", fontSize: "12px", marginTop: "5px" }}
              >
                6% de descuento
              </p>
            </div>

            <div
              onClick={() => togglePopupPurchase(5000)}
              style={{ width: "40%" }}
            >
              <div
                style={{ width: "100%" }}
                className="dropdownpurchase-news-card"
              >
                <div>
                  <img
                    style={{ width: "35px" }}
                    src="/images/donaciones/5000.png"
                  />
                  <h3>5000 PXL</h3>
                  <h4
                    style={{
                      marginTop: "10px",
                      color: "darkgray",
                      fontWeight: "600",
                    }}
                  >
                    5000 AR$
                  </h4>
                </div>
              </div>
              <p
                style={{ color: "#f36196", fontSize: "12px", marginTop: "5px" }}
              >
                8% de descuento
              </p>
            </div>
          </li>

          <li style={{ borderTop: "1px solid #ffffff1a" }}>
            <div
              onClick={() => togglePopupPurchase(10000)}
              style={{ width: "40%" }}
            >
              <div
                style={{ width: "100%" }}
                className="dropdownpurchase-news-card"
              >
                <div>
                  <img
                    style={{ width: "35px" }}
                    src="/images/donaciones/10000.png"
                  />
                  <h3>10,000 PXL</h3>
                  <h4
                    style={{
                      marginTop: "10px",
                      color: "darkgray",
                      fontWeight: "600",
                    }}
                  >
                    10,000 AR$
                  </h4>
                </div>
              </div>
              <p
                style={{ color: "#f36196", fontSize: "12px", marginTop: "5px" }}
              >
                10% de descuento
              </p>
            </div>

            <div
              onClick={() => togglePopupPurchase(20000)}
              style={{ width: "40%" }}
            >
              <div
                style={{ width: "100%" }}
                className="dropdownpurchase-news-card"
              >
                <div>
                  <img
                    style={{ width: "35px" }}
                    src="/images/donaciones/50000.png"
                  />
                  <h3>20,000 PXL</h3>
                  <h4
                    style={{
                      marginTop: "10px",
                      color: "darkgray",
                      fontWeight: "600",
                    }}
                  >
                    20,000 AR$
                  </h4>
                </div>
              </div>
              <p
                style={{ color: "#f36196", fontSize: "12px", marginTop: "5px" }}
              >
                12.5% de descuento
              </p>
            </div>
          </li>

          {showPopupPurchase === true && (
            <PurchasePopup
              amountt={amount}
              closePopup={() => togglePopupPurchase()}
            />
          )}
        </div>
      </ul>
    </>
  );
}

export default DropdownPurchase;
