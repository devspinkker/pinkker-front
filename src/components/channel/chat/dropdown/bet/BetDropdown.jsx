import React, { useState, useEffect } from "react";
import "./BetDropdown.css";

import { useSelector } from "react-redux";

import { participateBet } from "../../../../../services/bet";

import { useNotification } from "../../../../Notifications/NotificationProvider";

function BetDropdown({
  betRanking,
  bets,
  streamer,
  handleReload,
  closeNavbar,
}) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [type, setType] = useState(0);

  const [amount, setAmount] = useState(0);

  const [close, setClose] = useState(false);

  const alert = useNotification();

  async function handleSubmit(type) {
    const data = await participateBet(token, streamer, amount, type);
    if (data != null && data != undefined && data.status == 200) {
      alert({ type: "SUCCESS", message: data.data.msg });
      handleReload();
      closeNavbar();
    } else {
      alert({ type: "ERROR", message: data.data.msg });
    }
  }

  function getPorcentage(bet) {
    if (bet.poolOne == 0 && bet.poolTwo == 0) {
      return 0;
    } else {
      return parseInt((bet.poolOne * 100) / (bet.poolOne + bet.poolTwo));
    }
  }

  function getTotalParticipantsTypeOne(participants) {
    let total = 0;
    participants.forEach((participant) => {
      if (participant.type == 0) {
        total += 1;
      }
    });
    return total;
  }

  function getTotalParticipantsTypeTwo(participants) {
    let total = 0;
    participants.forEach((participant) => {
      if (participant.type == 1) {
        total += 1;
      }
    });
    return total;
  }

  function getTimeLeft() {
    const now = new Date();
    const endDate = new Date(bets.dateClose);
    const diff = endDate.getTime() - now.getTime();
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (diffMinutes <= 0 || diffSeconds <= 0) {
      setClose(true);
      return "0:00";
    }

    return diffMinutes + ":" + diffSeconds;
  }

  return (
    <>
      <ul className={"dropdownbet-menu"}>
        <div
          style={{ width: "95%", margin: "0 auto" }}
          className="dropdownbet-container"
        >
          <div
            className="dropdowns-title-container"
            style={{ borderBottom: "1px solid #4b4b4b8f" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", height: "15px" }}
              className="dropdownchatconfig-link"
              onClick={closeNavbar}
            >
              <h3 style={{ width: "90%", textAlign: "center" }}>Apostar</h3>
              <i
                onClick={handleClick}
                style={{
                  marginLeft: "-10px",
                  marginTop: "3px",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
                class="fas fa-times pinkker-button-more"
              ></i>
            </div>
          </div>

          <div className="dropdownbet-bet">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "16px" }}>{bets.title}</h3>
              {close ? (
                <p
                  style={{
                    fontSize: "13px",
                    color: "darkgray",
                    marginTop: "5px",
                  }}
                >
                  Las apuestas estan cerradas
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "13px",
                    color: "darkgray",
                    marginTop: "5px",
                  }}
                >
                  La participación finaliza en {getTimeLeft()}
                </p>
              )}
            </div>

            <div className="dropdownbet-card-container">
              <div className="dropdownbet-card">
                <h3
                  style={{
                    color: "#ff60b2",
                    fontFamily: "Poppins",
                    fontWeight: "800",
                  }}
                >
                  {bets.resultOne}
                </h3>
                <h2
                  style={{
                    color: "#ff60b2",
                    fontFamily: "Poppins",
                    fontWeight: "800",
                  }}
                >
                  {getPorcentage(bets)}%
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <img
                    style={{ width: "14px", marginRight: "3px" }}
                    src="/images/pixel.png"
                  />{" "}
                  {bets.poolOne}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <i
                    style={{ color: "#ff60b2", marginRight: "3px" }}
                    class="fas fa-trophy"
                  />{" "}
                  {betRanking.maxBetTypeOneUser
                    ? betRanking.maxBetTypeOneUser
                    : "¡Puedes ser tu!"}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <i
                    style={{ color: "#ff60b2", marginRight: "3px" }}
                    class="fas fa-users"
                  />{" "}
                  {getTotalParticipantsTypeOne(bets.participants)}
                </p>
              </div>

              <div className="dropdownbet-card">
                <h3
                  style={{
                    color: "#8560ff",
                    fontFamily: "Poppins",
                    fontWeight: "800",
                  }}
                >
                  {bets.resultTwo}
                </h3>
                <h2
                  style={{
                    color: "#8560ff",
                    fontFamily: "Poppins",
                    fontWeight: "800",
                  }}
                >
                  {bets.poolOne == 0 && bets.poolTwo == 0
                    ? getPorcentage(bets)
                    : 100 - getPorcentage(bets)}
                  %
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <img
                    style={{ width: "14px", marginRight: "3px" }}
                    src="/images/pixel.png"
                  />{" "}
                  {bets.poolTwo}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <i
                    style={{ color: "#8560ff", marginRight: "3px" }}
                    class="fas fa-trophy"
                  />{" "}
                  {betRanking.maxBetTypeTwoUser
                    ? betRanking.maxBetTypeTwoUser
                    : "¡Puedes ser tu!"}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <i
                    style={{ color: "#8560ff", marginRight: "3px" }}
                    class="fas fa-users"
                  />{" "}
                  {getTotalParticipantsTypeTwo(bets.participants)}
                </p>
              </div>
            </div>

            <div className="dropdownbet-card-container">
              <div className="dropdownbet-input">
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  type="Number"
                />
                <button
                  onClick={() => handleSubmit(0)}
                  style={{ backgroundColor: "#ff60b2" }}
                  className="dropdownbet-vote-button"
                >
                  Votar
                </button>
              </div>
              <div className="dropdownbet-input">
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  type="Number"
                />
                <button
                  onClick={() => handleSubmit(1)}
                  style={{ backgroundColor: "#8560ff" }}
                  className="dropdownbet-vote-button"
                >
                  Votar
                </button>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </>
  );
}

export default BetDropdown;
