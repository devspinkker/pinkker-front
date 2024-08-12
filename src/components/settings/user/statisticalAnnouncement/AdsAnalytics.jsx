import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { GetAdsUser } from "../../../../services/backGo/advertisements";
import "./AdsAnalytics.css";

export default function AdsAnalytics() {
  const [adsData, setAdsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await GetAdsUser(token); // Usa la función que ya tienes para obtener los datos
        if (res && res.data) {
          setAdsData(res.data);
        }
      } catch (error) {
        console.error("Error fetching ads data:", error);
      }
    };

    fetchData();
  }, []);

  const transformDataForChart = (ad, metric) => {
    const data = [["Day", metric]];
    const dailyData =
      metric === "Clicks" ? ad.ClicksPerDay : ad.ImpressionsPerDay;

    dailyData.forEach((entry) => {
      const date = new Date(entry.Date);
      const count = metric === "Clicks" ? entry.Clicks : entry.Impressions;
      data.push([date, count]);
    });

    return data;
  };

  return (
    <div className="ads-analytics">
      {adsData.map((ad) => (
        <div key={ad.id} className="ad-summary">
          <h3>
            {ad.Name} - {ad.Destination}
          </h3>
          {ad.Destination === "Muro" && (
            <Chart
              width={"100%"}
              height={"400px"}
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              data={transformDataForChart(ad, "Clicks")}
              options={{
                title: "Clicks per Day",
                hAxis: {
                  title: "Day",
                  format: "MMM dd",
                  textStyle: { color: "#fff" },
                  titleTextStyle: { color: "#fff" },
                },
                vAxis: {
                  title: "Clicks",
                  textStyle: { color: "#fff" },
                  titleTextStyle: { color: "#fff" },
                },
                series: {
                  0: { color: "#fff" }, // Cambia el color de la serie 0
                },
                chartArea: { width: "70%", height: "70%" },
                backgroundColor: "#333", // Fondo oscuro para el gráfico
                colors: ["#FF69B4"], // Color de la línea
                titleTextStyle: { color: "#fff" }, // Color del título
              }}
            />
          )}
          {ad.Destination !== "Muro" && (
            <Chart
              width={"100%"}
              height={"400px"}
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              data={transformDataForChart(ad, "Impressions")}
              options={{
                title: "Impressions per Day",
                hAxis: {
                  title: "Day",
                  format: "MMM dd",
                  textStyle: { color: "#fff" },
                  titleTextStyle: { color: "#fff" },
                },
                vAxis: {
                  title: "Impressions",
                  textStyle: { color: "#fff" },
                  titleTextStyle: { color: "#fff" },
                },
                chartArea: { width: "70%", height: "70%" },
                backgroundColor: "#333", // Fondo oscuro para el gráfico
                colors: ["#4285F4"], // Color de la línea
                titleTextStyle: { color: "#fff" }, // Color del título
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
