import React, { useState, useEffect } from "react";
import "./StreamSummaryAnalytics.css";
import {
  GetLastSixStreamSummaries,
  AWeekOfStreaming,
  getStreamById,
} from "../../../services/backGo/streams";
import { Chart } from "react-google-charts";
import { TbBoxMargin, TbLogout2 } from "react-icons/tb";
import NavbarLeft from "../../navbarLeft/NavbarLeft";
import { Button, Grid, Typography } from "@mui/material";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { LiaSlidersHSolid } from "react-icons/lia";
import { TfiWallet } from "react-icons/tfi";
import { getUserByIdTheToken } from "../../../services/backGo/user";
import { getStream } from "../../../services/stream";
import DashboarLayout from "../DashboarLayout";
import bg from './bg.jpg'
import Graphics from "./Graphics";
import Estadistica from "./Estadistica";
export default function StreamSummaryAnalytics({ user, tyExpanded, isMobile }) {
  const [streamSummaries, setStreamSummaries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const[filtro, setFiltro] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const a = await AWeekOfStreaming(token, filtro);
        
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
  }, [filtro]);

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
      "Admoney":
        Admoney !== undefined && Admoney !== null ? Admoney : 0,
      categoria: stream_category,
      titulo: Title,
      impresiones: Advertisements,
      "MaxViewers": MaxViewers,
      "AverageViewers": AverageViewers,
      "NewSubscriptions": NewSubscriptions,
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


    <DashboarLayout user={user} isMobile={isMobile} >

      <Grid 
      className="SummaryAnalitycsbackgroundDashboarLayout"
    >
        {/* Imagen de perfil circular */}
        <img
          src={user?.Avatar}
          style={{
            width: '100px', // Ajusta este tamaño según tu preferencia
            height: '100px',
            borderRadius: '50%',
            border: '2px solid white', // Borde blanco alrededor de la imagen
          }}
        />

        {/* Contenedor de Nombre y Botones */}
        <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Nombre del usuario */}
          <Typography style={{
            color: 'white',
            fontWeight: 800,
            fontSize: '28px', // Tamaño grande como en la imagen
            marginBottom: '8px'
          }}>
            {user?.NameUser?.toUpperCase()}
          </Typography>

          {/* Contenedor de los botones */}
          <Grid style={{ display: 'flex', gap: '10px' }}>
            <Button style={{
              backgroundColor: '#123456', // Un color oscuro para los botones
              color: 'white',
              borderRadius: '10px', // Botones redondeados
              padding: '10px 20px', // Espaciado interno
              fontWeight: 600,
            }}>
              Streams
            </Button>
            {/* <Button style={{
              backgroundColor: '#123456',
              color: 'white',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 600,
            }}>
              Clips
            </Button>
            <Button style={{
              backgroundColor: '#123456',
              color: 'white',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 600,
            }}>
              Posteos
            </Button> */}


          </Grid>
        </Grid>


      </Grid>

      <Grid style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', paddingTop: '1rem' }}>
        <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          <Typography style={{ color: 'white', fontWeight: 800, textAlign: 'left', fontSize: '1.5rem' }}>Último Stream [{streamSummaries[0]?.titulo}]</Typography>

          <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button style={{
              backgroundColor: '#123456', // Un color oscuro para los botones
              color: 'white',
              borderRadius: '10px', // Botones redondeados
              padding: '10px 20px', // Espaciado interno
              fontWeight: 600,
              
            }}
            onClick={() => setFiltro(1)}
            >
              Último Stream
            </Button>
            <Button style={{
              backgroundColor: '#123456', // Un color oscuro para los botones
              color: 'white',
              borderRadius: '10px', // Botones redondeados
              padding: '10px 20px', // Espaciado interno
              fontWeight: 600,
            }}
            onClick={() => setFiltro(1)}
            >
              7 días
            </Button>
            <Button style={{
              backgroundColor: '#123456', // Un color oscuro para los botones
              color: 'white',
              borderRadius: '10px', // Botones redondeados
              padding: '10px 20px', // Espaciado interno
              fontWeight: 600,
            }}
            onClick={() => setFiltro(2)}
            >
              14 días
            </Button>
            <Button style={{
              backgroundColor: '#123456', // Un color oscuro para los botones
              color: 'white',
              borderRadius: '10px', // Botones redondeados
              padding: '10px 20px', // Espaciado interno
              fontWeight: 600,
            }}
            onClick={() => setFiltro(4)}
            >
              30 Días
            </Button>
          </Grid>
        </Grid>
        <Estadistica streamSummaries={streamSummaries} />

      </Grid>

      {/* <div className="summary-container">
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
            chartType="LineChart"
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
              // chartArea: {
              //   left: 100,
              //   top: 50,
              //   width: "80%",
              //   height: "70%",
              // },
              chartArea: { width: "70%", height: "70%" },
              backgroundColor: "#333", // Fondo oscuro para el gráfico
              colors: ["#FF69B4"], // Color de la línea
              titleTextStyle: { color: "#fff" }, // Color del título
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
      </div> */}




    </DashboarLayout >
  );
}
