import React, { useState, useEffect } from "react";

import "./Statistics.css";

import { useSelector } from "react-redux";

import { getPinkkerStatistics } from "../../../services/server";
import { ReactWorldCountriesMap } from "react-world-countries-map";

export default function Statistics() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [statistics, setStatistics] = useState(null);

  const [posicion, setPosicion] = useState({
    latitude: "",
    longitude: "",
  });
  const [codigo, setCodigo] = useState();
  const [paises, setPaises] = useState([
    {
      country: "",
      value: undefined,
    },
  ]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  function onSuccess(position) {
    let { latitude, longitude } = position.coords;
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=8ffa1a8586f34b94a21bb81c297cb5d3`
    )
      .then((response) => response.json())
      .then((response) => {
        let allDetails = response.results[0].components;
        console.table(allDetails);
        let { country_code, postcode, country } = allDetails;
        setCodigo(allDetails);

        setPaises([
          {
            country: country_code,
            value: +1,
          },
        ]);
      })
      .catch((error) => {});
  }

  function onError(error) {
    if (error.code === 1) {
      console.log("You denied the request");
    } else if (error.code === 2) {
      console.log("Location is unavailable");
    } else {
      console.log("Something went wrong");
    }
  }

  const data1 = [
    { country: "ar", value: 150 }, // china
    { country: "us", value: 100 }, // united states
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPinkkerStatistics(token);
      if (data != null && data != undefined) {
        setStatistics(data.statistics);
      }
    };
    fetchData();
  }, [token]);

  function getStatistics() {
    if (statistics != null) {
      return (
        <div className="adminstatistics-card-container">
          <div className="adminstatistics-card">
            <div>
              <h3>Usuarios</h3>
              <h1 style={{ color: "#ff60b2", marginTop: "10px" }}>
                {statistics.users}
              </h1>
            </div>
          </div>
          <div className="adminstatistics-card">
            <div>
              <h3>Suscripciones</h3>
              <h1 style={{ color: "#ff60b2", marginTop: "10px" }}>50</h1>
            </div>
          </div>
          <div className="adminstatistics-card">
            <div>
              <h3>Pinkker Primes</h3>
              <h1 style={{ color: "#ff60b2", marginTop: "10px" }}>30</h1>
            </div>
          </div>
          <div className="adminstatistics-card">
            <div>
              <h3>Streams activos</h3>
              <h1 style={{ color: "#ff60b2", marginTop: "10px" }}>
                {statistics.streamings_online}
              </h1>
            </div>
          </div>
          <div className="adminstatistics-card">
            <div>
              <h3>Usuarios</h3>
              <h1 style={{ color: "#ff60b2", marginTop: "10px" }}>100</h1>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="adminstatistics-body">
      <div style={{ width: "100%", height: "50px" }} />
      <div className="adminstatistics-container">
        <h2 style={{ color: "#ededed" }}>Estadisticas</h2>

        {getStatistics()}

        <div style={{ width: "50%", marginTop: "50px" }}>
          <ReactWorldCountriesMap
            id="adminstatistics-map"
            color="#f36196"
            value-suffix="usuarios"
            size="responsive"
            tooltipBgColor="red"
            tooltipTextColor="white"
            data={data1}
          />
        </div>
      </div>
    </div>
  );
}
