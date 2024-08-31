import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Estadistica.css';
import { Box, Grid, Typography, Card } from '@mui/material';
import { FaCircle } from 'react-icons/fa6';
import { fetchSearchPage } from '../../../redux/actions/searchAction';

const StatCard = ({ stream }) => {


  function parseDate(dateString) {

    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const date = new Date(dateString);
    const day = date.getDate();
    const monthAndYear = `${months[date.getMonth()]} ${date.getFullYear()}`;

    return { day, monthAndYear };
  }

  const { day, monthAndYear } = parseDate(stream?.StartOfStream);


  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    const startOfStream = new Date(stream?.StartOfStream);
    const endOfStream = new Date(stream?.EndOfStream);

    // Calcula la diferencia en milisegundos
    const diffMs = endOfStream - startOfStream;

    // Convierte la diferencia en minutos y horas
    const diffMins = Math.floor(diffMs / 60000); // 1 minuto = 60,000 milissegundos
    const diffHours = Math.floor(diffMins / 60); // 1 hora = 60 minutos
    const remainingMins = diffMins % 60; // Minutos restantes después de las horas

    setTimeDifference(`${diffHours}.${remainingMins}`);
  }, []);



  return (
    <Grid container spacing={1} alignItems="center" justifyContent="space-between" style={{ display: "flex", width: '100%' }}>
      {/* Fecha */}
      <Grid item style={{ flex: '1', padding: 0 }}>
        <Card
          sx={{
            padding: '0px',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {day}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {monthAndYear}
          </Typography>
        </Card>
      </Grid>

      {/* Seguidores Nuevos */}
      <Grid item style={{ flex: '1', padding: 0 }}>
        <Card
          sx={{
            padding: "10px 20px",
            backgroundColor: "#18bb9c",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {stream?.MaxViewers}
          </Typography>
          <Box
            sx={{
              marginTop: "8px",
              height: "5px",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "75%",
                height: "100%",
                backgroundColor: "#004d40",
              }}
            />
          </Box>
        </Card>
      </Grid>

      {/* Comentarios */}
      <Grid item style={{ flex: '1', padding: 0 }}>
        <Card
          sx={{
            padding: "10px 20px",
            backgroundColor: "#0288d1",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {stream?.NewFollowers}
          </Typography>
          <Box
            sx={{
              marginTop: "8px",
              height: "5px",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "50%",
                height: "100%",
                backgroundColor: "#004d40",
              }}
            />
          </Box>
        </Card>
      </Grid>

      {/* Duración */}
      <Grid item style={{ flex: '1', padding: 0 }}>
        <Card
          sx={{
            padding: "10px 20px",
            backgroundColor: "#37474f",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {timeDifference}
          </Typography>
          <Box
            sx={{
              marginTop: "8px",
              height: "5px",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "90%",
                height: "100%",
                backgroundColor: "#ff1744",
              }}
            />
          </Box>
        </Card>
      </Grid>

      {/* Ingresos */}
      <Grid item style={{ flex: '1', padding: 0 }}>
        <Card
          sx={{
            padding: "10px 20px",
            backgroundColor: "#FFBF00",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {`$${stream?.TotalMoney}`}
          </Typography>
          <Box
            sx={{
              marginTop: "8px",
              height: "5px",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "90%",
                height: "100%",
                backgroundColor: "#ff1744",
              }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>

  );
};
const PerformanceCard = ({ title, value, change, changePercent, color, data }) => {
  return (
    <div className="performance-card" style={{ borderColor: color }}>
      <div className="performance-header">
        <span className="change" style={{ color: color }}>+ {change} | {changePercent}%</span>
      </div>
      <h3 className="stat-number" style={{ color: color }}>{value}</h3>
      <p className="stat-title" style={{ color: color }}>{title}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={color} dot={false} />
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Estadistica = (props) => {
  const data = [
    { name: 'Day 1', value: 850 },
    { name: 'Day 2', value: 900 },
    { name: 'Day 3', value: 920 },
    { name: 'Day 4', value: 1000 },
    { name: 'Day 5', value: 1150 },
    { name: 'Day 6', value: 1400 },
    { name: 'Day 7', value: 1200 }
  ];

  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    const startOfStream = new Date(props?.streamSummaries[0]?.StartOfStream);
    const endOfStream = new Date(props?.streamSummaries[0]?.EndOfStream);

    // Calcula la diferencia en milisegundos
    const diffMs = endOfStream - startOfStream;

    // Convierte la diferencia en minutos y horas
    const diffMins = Math.floor(diffMs / 60000); // 1 minuto = 60,000 milissegundos
    const diffHours = Math.floor(diffMins / 60); // 1 hora = 60 minutos
    const remainingMins = diffMins % 60; // Minutos restantes después de las horas

    setTimeDifference(`${diffHours}.${remainingMins}`);
  }, [props?.streamSummaries]);
  const [porcentajeSeguidores, setPorcentajeSeguidores] = useState(0);

  useEffect(() => {
    const seguidoresNuevos = props?.streamSummaries[0]?.NewFollowers;
    const seguidoresAntesStream = props?.streamSummaries[0]?.StartFollowersCount;

    if (seguidoresAntesStream !== 0) {
      const diferencia = seguidoresNuevos - seguidoresAntesStream;
      const porcentajeCambio = (diferencia / seguidoresAntesStream) * 100;
      setPorcentajeSeguidores(porcentajeCambio);
    } else {
      setPorcentajeSeguidores(0); // Evita división por 0
    }
  }, [props?.streamSummaries]);

  return (
    <Grid style={{ display: 'flex', flexDirection: 'column' }}>

      <div className="performance-dashboard">
        <PerformanceCard title="Horas en Stream" value={timeDifference} change="1.1" changePercent="12" color="#e74c3c" data={data} />
        <PerformanceCard title="Promedio de Espectadores" value={props?.streamSummaries[0]?.AverageViewers} change="93" changePercent="11" color="#2ecc71" data={data} />
        <PerformanceCard title="Top Viewers" value={props?.streamSummaries[0]?.MaxViewers} change="20" changePercent="1" color="#f1c40f" data={data} />
        <PerformanceCard title="Nuevos Seguidores" value={props?.streamSummaries[0]?.NewFollowers} change={props?.streamSummaries[0]?.NewFollowers - props?.streamSummaries[0]?.StartFollowersCount} changePercent={porcentajeSeguidores} color="#3498db" data={data} />
        <PerformanceCard title="Ingresos" value={props?.streamSummaries[0]?.TotalMoney} change="116" changePercent="77" color="#3498db" data={data} />
        <PerformanceCard title="Categoría de Stream" value={props?.streamSummaries[0]?.categoria} color="#e67e22" />

      </div>

      <Grid style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', float: 'left' }}>
        <Typography style={{ color: 'white', fontWeight: 800, textAlign: 'left', fontSize: '1.5rem' }}>Streams Recientes</Typography>

        <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaCircle style={{ color: '#18bb9c' }} />
          <Typography style={{ color: 'white', fontWeight: 800, textAlign: 'left', width: '100%', fontSize: '.8rem', fontStyle: 'italic' }}>Máximo Espectadores</Typography>
        </Grid>

        <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaCircle style={{ color: '#0287d1' }} />
          <Typography style={{ color: 'white', fontWeight: 800, textAlign: 'left', width: '100%', fontSize: '.8rem', fontStyle: 'italic' }}>Nuevos Seguidores</Typography>
        </Grid>

        <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaCircle style={{ color: '#374650' }} />
          <Typography style={{ color: 'white', fontWeight: 800, textAlign: 'left', width: '100%', fontSize: '.8rem', fontStyle: 'italic' }}>Horas de Stream</Typography>
        </Grid>
        <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaCircle style={{ color: '#FFBF00' }} />
          <Typography style={{ color: 'white', fontWeight: 800, textAlign: 'left', width: '100%', fontSize: '.8rem', fontStyle: 'italic' }}>Ingresos</Typography>
        </Grid>
      </Grid>
      <Grid style={{ paddingTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'flex-start' }}>
        {props?.streamSummaries?.map((stream, index) => {

          return (
            <Grid style={{ padding: 5, width: '40%' }}>
              <StatCard key={stream[index]?.id} stream={stream} />
            </Grid>
          )
        })}

      </Grid>
    </Grid>
  );
};

export default Estadistica;
