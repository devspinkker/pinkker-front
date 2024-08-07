import React, { useState, useEffect } from "react";
import "./StreamSummaryAnalytics.css";
import { GetLastSixStreamSummaries } from "../../../services/backGo/streams";
import { Chart } from "react-google-charts";
import { TbBoxMargin } from "react-icons/tb";
import NavbarLeft from "../../navbarLeft/NavbarLeft";

export default function StreamSummaryAnalytics() {
  const [streamSummaries, setStreamSummaries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const date = new Date();
        const res = await GetLastSixStreamSummaries(token, date);

        if (res && res.data && res.data.length > 0) {
          const renamedData = res.data.map(renameProperties);
          setStreamSummaries(renamedData);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching stream summaries:", error);
      }
    };

    fetchData();
  }, []);
  const renameProperties = (item) => {
    const {
      Admoney,
      stream_category,
      Title,
      Advertisements,
      MaxViewers,
      AverageViewers,
      NewSubscriptions,
      ...rest
    } = item;

    return {
      ...rest,
      "Ganancia de anuncios":
        Admoney !== undefined && Admoney !== null ? Admoney : 0,
      categoria: stream_category,
      titulo: Title,
      impresiones: Advertisements,
      "maximo de espectadores": MaxViewers,
      "promedio de espectadores": AverageViewers,
      "nuevas subscriptions": NewSubscriptions,
    };
  };

  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const navigateNext = () => {
    if (currentIndex < streamSummaries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const lastSummary = streamSummaries[streamSummaries.length - 1];
      const token = localStorage.getItem("token");
      const date = new Date(lastSummary.StartOfStream);
      fetchMoreStreamSummaries(token, date);
    }
  };

  const fetchMoreStreamSummaries = async (token, date) => {
    try {
      const res = await GetLastSixStreamSummaries(token, date);
      if (res && res.data && res.data.length > 0) {
        setStreamSummaries((prevSummaries) => [...prevSummaries, ...res.data]);
      }
    } catch (error) {
      console.error("Error fetching more stream summaries:", error);
    }
  };

  const renderSummary = (summary) => {
    if (!summary) return null;

    // Calcular la duración del stream
    const startTime = new Date(summary.StartOfStream);
    const endTime = new Date(summary.EndOfStream);
    const duration = (endTime - startTime) / 1000; // Duración en segundos

    return (
      <div className="summary">
        <div className="summary-details">
          {Object.entries(summary).map(([key, value], index, arr) => {
            if (
              key === "id" ||
              key === "StreamerID" ||
              key === "AverageViewersByTime" ||
              key === "EndFollowersCount" ||
              key === "EndSubsCount" ||
              key === "StartSubsCount" ||
              key === "StartFollowersCount" ||
              key == "StartOfStream" ||
              key == "EndOfStream"
              // key == "Admoney"
            ) {
              return null;
            }

            const nextKey = arr[index + 1] ? arr[index + 1][0] : null;
            const comparisonValue = getComparisonValue(summary, key);
            const nextComparisonValue = getComparisonValue(summary, nextKey);
            const difference =
              nextComparisonValue !== null
                ? nextComparisonValue - comparisonValue
                : null;

            return (
              <div className="summary-details-item" key={key}>
                <div className="property-name">
                  <span>{key}</span>
                  {/* {difference !== null && (
                    <div>
                      <span
                        className={
                          difference >= 0
                            ? "gain comparison"
                            : "loss comparison"
                        }
                      >
                        {difference >= 0 ? "+" : "-"}
                        {Math.abs(difference)}
                      </span>
                      <span className="comparisonLast">Ultimo Stream</span>
                    </div>
                  )} */}
                </div>

                <div className="property-value">
                  <span>{value}</span>
                </div>
              </div>
            );
          })}
          {/* Agregar la duración del stream */}
          <div className="summary-details-item">
            <div className="property-name">
              <span>Duration</span>
            </div>
            <div className="property-value">
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getComparisonValue = (summary, key) => {
    const nextSummary = streamSummaries[currentIndex + 1];
    if (!nextSummary || key === "EndOfStream" || key === "StartOfStream")
      return null;
    const difference = nextSummary[key] - summary[key];
    return (difference > 0 ? "+" : "") + difference;
  };

  const transformDataForChart = () => {
    const data = [["Time", "Average Viewers"]];
    const currentSummary = streamSummaries[currentIndex];
    if (currentSummary && currentSummary.AverageViewersByTime) {
      for (const [time, viewers] of Object.entries(
        currentSummary.AverageViewersByTime
      )) {
        // Convertir la cadena de tiempo en un objeto Date
        const date = new Date(time);
        // Agregar el tiempo y los espectadores como una matriz
        data.push([date, viewers]);
      }
    }
    return data;
  };

  return (
    <div className="analytics">
      <div className="summary-container">
        <div className="summary-header">
          <div className="navigation">
            <span className="navigation-arrow" onClick={navigatePrevious}>
              {"<"}
            </span>
          </div>
          <h3>
            {streamSummaries[currentIndex]?.StartOfStream
              ? new Date(
                  streamSummaries[currentIndex].StartOfStream
                ).toLocaleDateString()
              : ""}
          </h3>
          <div className="navigation">
            <span className="navigation-arrow" onClick={navigateNext}>
              {">"}
            </span>
          </div>
        </div>
        {renderSummary(streamSummaries[currentIndex])}
        {streamSummaries.length > 0 && (
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="ColumnChart"
            loader={<div>Loading Chart</div>}
            data={transformDataForChart()}
            options={{
              title: "Average Viewers Over Time",
              titleTextStyle: {
                fontSize: 18,
                bold: true,
                color: "#eee",
              },
              legend: { position: "none" },
              backgroundColor: "#0a0b0d",
              bar: { groupWidth: "85%" },
              hAxis: {
                title: "Time",
                titleTextStyle: {
                  fontSize: 14,
                  italic: false,
                  color: "#eee",
                },
                gridlines: { color: "#eee" },
                minorGridlines: { color: "#f5f5f5" },
                baselineColor: "#FF69B4",
                textStyle: {
                  color: "#eee",
                },
                format: "HH:mm:ss",
              },
              vAxis: {
                title: "Average Viewers",
                titleTextStyle: {
                  fontSize: 14,
                  italic: false,
                  color: "#eee",
                },
                gridlines: { color: "#eee" },
                minorGridlines: { color: "#f5f5f5" },
                baselineColor: "#FF69B4",
                textStyle: {
                  color: "#eee",
                },
                format: "0",
              },
              series: {
                0: {
                  color: "#FF69B4",
                  // Añadir borde a las barras
                  lineWidth: 1,
                  // Color del borde de las barras
                  stroke: "#FF69B4",
                  // Ancho del borde de las barras
                  strokeWidth: 1,
                },
              },
              chartArea: {
                left: 100,
                top: 50,
                width: "80%",
                height: "70%",
              },
            }}
            chartEvents={[
              {
                eventName: "onmouseover",
                callback: ({ chartWrapper }) => {
                  chartWrapper.setOptions({
                    series: {
                      0: { color: "#FF1493" },
                    },
                    bar: {
                      groupWidth: "75%",
                    },
                  });
                },
              },
              {
                eventName: "onmouseout",
                callback: ({ chartWrapper }) => {
                  chartWrapper.setOptions({
                    series: {
                      0: { color: "#FF69B4" },
                    },
                    bar: {
                      groupWidth: "85%",
                    },
                  });
                },
              },
            ]}
            chartWrapperParams={{
              style: {
                borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
