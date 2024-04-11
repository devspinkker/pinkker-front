import React, { useState, useEffect } from "react";
import "./Analytics.css";

import { getStreamerVod, getStreamerClips } from "../../../services/vods";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import { Chart } from "react-google-charts";

import {
  getStatsGlobal,
  getStatsSpecificGlobal,
} from "../../../services/history";

import DropdownDays from "./dropdownDays";

export default function Analytics() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [lastVod, setLastVod] = useState(null);
  const [last4Vod, setLast4Vod] = useState(null);

  const [lastClips, setLastClips] = useState(null);

  const [type, setType] = useState(0);

  const [stats, setStats] = useState(null);

  const [statsData, setStatsData] = useState([]);

  const [showDropdownDays, setShowDropdownDays] = useState(false);

  const [days, setDays] = useState(28);

  function toggleDropdownDays() {
    setShowDropdownDays(!showDropdownDays);
  }

  var data = [
    ["", ""],
    ["1", 0],
    ["2", 0],
    ["3", 0],
    ["4", 0],
    ["5", 0],
    ["6", 0],
    ["7", 0],
    ["8", 0],
    ["9", 0],
    ["10", 0],
    ["11", 0],
    ["12", 0],
    ["13", 0],
    ["14", 0],
    ["15", 0],
    ["16", 0],
    ["17", 0],
    ["18", 0],
    ["19", 0],
    ["20", 0],
    ["21", 0],
    ["22", 0],
    ["23", 0],
    ["24", 0],
    ["25", 0],
    ["26", 0],
    ["27", 0],
    ["28", 0],
    ["29", 0],
    ["30", 0],
  ];

  const options = {
    chart: {
      title: "",
      subtitle: "",
    },
    colors: ["#ff60b2", "#ff60b2", "#ff60b2", "#ff60b2"],

    chartArea: {
      backgroundColor: {
        fill: "#FF0000",
        fillOpacity: 0.1,
      },
    },

    backgroundColor: {
      fill: "#FF0000",
      fillOpacity: 0.8,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token != null && token != undefined) {
        const dataStats = await getStatsGlobal(token);
        if (dataStats != null && dataStats != undefined) {
          setStats(dataStats.stats);
        }

        const dataStatsS = await getStatsSpecificGlobal(token, type);
        if (dataStatsS != null && dataStatsS != undefined) {
          setStatsData(dataStats.totalHistoryFilled);
        }

        const dataLastVod = await getStreamerVod(user.name, 1, -1);
        if (dataLastVod != null && dataLastVod != undefined) {
          setLastVod(dataLastVod[0]);
        }

        const dataLast4Vod = await getStreamerVod(user.name, 4, -1);
        if (dataLast4Vod != null && dataLast4Vod != undefined) {
          setLast4Vod(dataLast4Vod);
        }

        const dataLastClips = await getStreamerClips(user.name, 3, -1);
        if (dataLastClips != null && dataLastClips != undefined) {
          setLastClips(dataLastClips);
        }
      }
    };

    fetchData();
  }, [token, user]);

  useEffect(async () => {
    const fetchData = async () => {
      data = [];
      const dataStatsS = await getStatsSpecificGlobal(token, type);
      if (dataStatsS != null && dataStatsS != undefined) {
        //Fill data with stats data
        for (let i = 0; i < dataStatsS.totalHistoryFilled.length; i++) {
          data[i + 1] = dataStatsS.totalHistoryFilled[i];
        }
        //Delete second element of each array
        data.splice(0, 1);
      }
    };
    await fetchData();
    setStatsData([["", ""], ...data]);
  }, [type]);

  function getStats() {
    if (stats != null && stats != undefined) {
      return (
        <div style={{ marginTop: "40px" }}>
          <div
            style={{
              marginLeft: "5px",
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Estadisticas del canal</h3>
            <p
              onClick={() => toggleDropdownDays()}
              style={{
                color: "darkgray",
                fontSize: "13px",
                marginRight: "5px",
              }}
            >
              {days === 1 ? `Ayer` : `Ultimos ${days} días`}
            </p>

            {showDropdownDays && (
              <DropdownDays
                setDays={(days) => {
                  setDays(days);
                  toggleDropdownDays();
                }}
              />
            )}
          </div>
          <div className="analytics-primary">
            <div
              onClick={() => setType(0)}
              style={{
                backgroundColor: type === 0 && "#303030",
                boxShadow: type === 0 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Ingresos estimados</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                $20.12{" "}
                <i
                  style={{ color: "lightgreen", fontSize: "16px" }}
                  class="fas fa-angle-up"
                />
              </h1>
            </div>
            <div
              onClick={() => setType(1)}
              style={{
                backgroundColor: type === 1 && "#303030",
                boxShadow: type === 1 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Vistas</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                217,331{" "}
                <i
                  style={{ color: "lightgreen", fontSize: "16px" }}
                  class="fas fa-angle-up"
                />
              </h1>
            </div>
            <div
              onClick={() => {
                setStatsData(null);
                setType(2);
              }}
              style={{
                backgroundColor: type === 2 && "#303030",
                boxShadow: type === 2 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Seguidores</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                {stats.totalFollowers}{" "}
                <i
                  style={{ color: "lightgreen", fontSize: "16px" }}
                  class="fas fa-angle-up"
                />
              </h1>
            </div>
            <div
              onClick={() => setType(3)}
              style={{
                backgroundColor: type === 3 && "#303030",
                boxShadow: type === 3 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Suscriptores</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                {stats.totalSuscribers}{" "}
                <i
                  style={{ color: "red", fontSize: "16px" }}
                  class="fas fa-angle-down"
                />
              </h1>
            </div>
            <div
              onClick={() => setType(4)}
              style={{
                backgroundColor: type === 4 && "#303030",
                boxShadow: type === 4 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Media espectadores</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                {stats.averageViewers}{" "}
                <i
                  style={{ color: "lightgreen", fontSize: "16px" }}
                  class="fas fa-angle-up"
                />
              </h1>
            </div>
            <div
              onClick={() => setType(5)}
              style={{
                backgroundColor: type === 5 && "#303030",
                boxShadow: type === 5 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Tiempo emitido</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                {stats.duration.totalHours}h {stats.duration.totalMinutes}m{" "}
                <i
                  style={{ color: "red", fontSize: "16px" }}
                  class="fas fa-angle-down"
                />
              </h1>
            </div>
            <div
              onClick={() => setType(6)}
              style={{
                backgroundColor: type === 6 && "#303030",
                boxShadow: type === 6 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Espectadores maximos</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                {stats.maxViewers}{" "}
                <i
                  style={{ color: "lightgreen", fontSize: "16px" }}
                  class="fas fa-angle-up"
                />
              </h1>
            </div>
            <div
              onClick={() => setType(7)}
              style={{
                backgroundColor: type === 7 && "#303030",
                boxShadow: type === 7 && "0.5px 0.5px 18px 0.5px #f3619792",
              }}
              className="analytics-primary-card"
            >
              <p style={{ fontWeight: "600" }}>Anuncios</p>
              <h1 style={{ color: "rgb(243, 97, 150)", marginTop: "20px" }}>
                46{" "}
                <i
                  style={{ color: "lightgreen", fontSize: "16px" }}
                  class="fas fa-angle-up"
                />
              </h1>
            </div>
          </div>
        </div>
      );
    }
  }

  function getClips() {
    return (
      <div>
        <div
          style={{
            marginLeft: "5px",
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "50px",
          }}
        >
          <h3>Clips más populares</h3>
          <p
            onClick={() => toggleDropdownDays()}
            style={{ color: "darkgray", fontSize: "13px", marginRight: "5px" }}
          >
            {days === 1 ? `Ayer` : `Ultimos ${days} días`}
          </p>

          {showDropdownDays && (
            <DropdownDays
              setDays={(days) => {
                setDays(days);
                toggleDropdownDays();
              }}
            />
          )}
        </div>
        <div className="analytics-clips">
          {lastClips &&
            lastClips.map((clip) => (
              <div className="analytics-clips-card">
                <img style={{ width: "150px" }} src={clip.cover} />
                <div style={{ marginLeft: "10px" }}>
                  <h4 style={{ fontSize: "13px" }}>{clip.clipName}</h4>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100px",
                    }}
                  >
                    <p style={{ fontSize: "13px", marginTop: "10px" }}>
                      <i style={{ fontSize: "11px" }} class="fas fa-eye" />{" "}
                      {clip.views}
                    </p>
                    <p style={{ fontSize: "13px", marginTop: "10px" }}>
                      <i
                        style={{ fontSize: "11px" }}
                        class="fas fa-thumbs-up"
                      />{" "}
                      {clip.totalLikes}
                    </p>
                    <p style={{ fontSize: "13px", marginTop: "10px" }}>
                      <i style={{ fontSize: "11px" }} class="fas fa-comment" />{" "}
                      {clip.totalComments}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: "10px",
                      color: "rgb(243, 97, 150)",
                    }}
                  >
                    {clip.stream.stream_category}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  function getVods() {
    return (
      <div>
        <div
          style={{
            marginLeft: "5px",
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "50px",
          }}
        >
          <h3>Streams más populares</h3>
          <p
            onClick={() => toggleDropdownDays()}
            style={{ color: "darkgray", fontSize: "13px", marginRight: "5px" }}
          >
            {days === 1 ? `Ayer` : `Ultimos ${days} días`}
          </p>

          {showDropdownDays && (
            <DropdownDays
              setDays={(days) => {
                setDays(days);
                toggleDropdownDays();
              }}
            />
          )}
        </div>
        <div className="analytics-vods">
          <div className="analytics-vods-card">
            <img
              style={{ width: "200px" }}
              src={
                "https://res.cloudinary.com/pinkker/image/upload/v1673397459/min/tulp8anscthugfohkphk.png"
              }
            />
            <div
              style={{
                marginLeft: "10px",
                marginTop: "15px",
                textAlign: "justify",
                width: "90%",
              }}
            >
              <h4 style={{ fontSize: "13px" }}>
                Quba con el negro mozambique // !ig // ROAD 2k // DNG TEAM
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-eye" /> 3,230
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-thumbs-up" />{" "}
                  200
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-comment" /> 30
                </p>
              </div>
            </div>
          </div>
          <div className="analytics-vods-card">
            <img
              style={{ width: "200px" }}
              src={
                "https://res.cloudinary.com/pinkker/image/upload/v1673397459/min/tulp8anscthugfohkphk.png"
              }
            />
            <div
              style={{
                marginLeft: "10px",
                marginTop: "15px",
                textAlign: "justify",
                width: "90%",
              }}
            >
              <h4 style={{ fontSize: "13px" }}>
                Quba con el negro mozambique // !ig // ROAD 2k // DNG TEAM
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-eye" /> 3,230
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-thumbs-up" />{" "}
                  200
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-comment" /> 30
                </p>
              </div>
            </div>
          </div>
          <div className="analytics-vods-card">
            <img
              style={{ width: "200px" }}
              src={
                "https://res.cloudinary.com/pinkker/image/upload/v1673397459/min/tulp8anscthugfohkphk.png"
              }
            />
            <div
              style={{
                marginLeft: "10px",
                marginTop: "15px",
                textAlign: "justify",
                width: "90%",
              }}
            >
              <h4 style={{ fontSize: "13px" }}>
                Quba con el negro mozambique // !ig // ROAD 2k // DNG TEAM
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-eye" /> 3,230
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-thumbs-up" />{" "}
                  200
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-comment" /> 30
                </p>
              </div>
            </div>
          </div>
          <div className="analytics-vods-card">
            <img
              style={{ width: "200px" }}
              src={
                "https://res.cloudinary.com/pinkker/image/upload/v1673397459/min/tulp8anscthugfohkphk.png"
              }
            />
            <div
              style={{
                marginLeft: "10px",
                marginTop: "15px",
                textAlign: "justify",
                width: "90%",
              }}
            >
              <h4 style={{ fontSize: "13px" }}>
                Quba con el negro mozambique // !ig // ROAD 2k // DNG TEAM
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-eye" /> 3,230
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-thumbs-up" />{" "}
                  200
                </p>
                <p style={{ fontSize: "13px", marginTop: "10px" }}>
                  <i style={{ fontSize: "11px" }} class="fas fa-comment" /> 30
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function getTypeStats() {
    if (type === 0) {
      return (
        <div className="analytics-type-stats">
          <Chart
            chartType="Bar"
            width="100%"
            height="300px"
            data={data}
            options={options}
          />
        </div>
      );
    }

    if (type === 2) {
      return (
        <div className="analytics-type-stats">
          {statsData && statsData.length && (
            <Chart
              chartType="Bar"
              width="100%"
              height="300px"
              data={statsData}
              options={options}
            />
          )}
        </div>
      );
    }

    if (type === 3) {
      return (
        <div className="analytics-type-stats">
          {statsData && statsData.length && (
            <Chart
              chartType="Bar"
              width="100%"
              height="300px"
              data={statsData}
              options={options}
            />
          )}
        </div>
      );
    }

    if (type === 4) {
      return (
        <div className="analytics-type-stats">
          {statsData && statsData.length && (
            <Chart
              chartType="Bar"
              width="100%"
              height="300px"
              data={statsData}
              options={options}
            />
          )}
        </div>
      );
    }

    if (type === 6) {
      return (
        <div className="analytics-type-stats">
          {statsData && statsData.length && (
            <Chart
              chartType="Bar"
              width="100%"
              height="300px"
              data={statsData}
              options={options}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="analytics-body">
      <div className="analytics-container">
        <div style={{ opacity: "0" }}>
          <h3>
            ¡Sigue así! Tu canal recibió un{" "}
            <a style={{ color: "lightgreen" }}>313 %</a> más de vistas que de
            costumbre en los últimos 28 días
          </h3>
        </div>
        {getStats()}
        {getTypeStats()}
        {getClips()}
        {getVods()}
      </div>
    </div>
  );
}
