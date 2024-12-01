import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Button, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  GetEarningsByMonth,
  GetEarningsByMonthRange,
} from "../../services/backGo/PinkkerProfit";
import { BsRecordCircle } from "react-icons/bs";

export default function Ingresos({ Code }) {
  const [earningsByMonth, setEarningsByMonth] = useState(null);
  const [earningsByMonthRange, setEarningsByMonthRange] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [metricsVisibility, setMetricsVisibility] = useState({
    impressions: true,
    clicks: true,
    pixels: true,
    PinkkerPrime: true,
    communityBuy: true,
    PaidCommunities: true,
    CommissionsSuscripcion: true,
    CommissionsDonation: true,
    CommissionsCommunity: true,
  });
  const [totals, setTotals] = useState({
    impressions: 0,
    clicks: 0,
    pixels: 0,
    PinkkerPrime: 0,
    communityBuy: 0,
    PaidCommunities: 0,
    CommissionsSuscripcion: 0,
    CommissionsDonation: 0,
    CommissionsCommunity: 0,
  });
  const token = window.localStorage.getItem("token");

  const fetchEarningsByMonth = async (date) => {
    try {
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      const res = await GetEarningsByMonth(token, formattedDate, Code);
      const data = res.data;

      // Filtrar días con formato correcto y crear los datos para el gráfico
      const formattedData = Object.keys(data.days)
        .filter((day) => Date.parse(day)) // Filtramos solo los días válidos
        .map((day) => ({
          day: day,
          ...data.days[day],
        }));
      setEarningsByMonth(formattedData);
    } catch (error) {
      console.error("Error fetching earnings for the month:", error);
    }
  };

  const fetchEarningsByMonthRange = async (start, end) => {
    try {
      const formattedStart = format(new Date(start), "yyyy-MM-dd");
      const formattedEnd = format(new Date(end), "yyyy-MM-dd");
      const res = await GetEarningsByMonthRange(
        token,
        formattedStart,
        formattedEnd,
        Code
      );
      const data = res.data;

      // Combinar los datos de varios meses y filtrar los días válidos
      const allDays = data.reduce((acc, month) => {
        Object.keys(month.days).forEach((day) => {
          if (Date.parse(day)) {
            // Solo días con formato válido
            acc.push({
              day: day,
              ...month.days[day],
            });
          }
        });
        return acc;
      }, []);

      // Calcular totales
      const newTotals = {
        impressions: allDays.reduce((sum, day) => sum + day.impressions, 0),
        clicks: allDays.reduce((sum, day) => sum + day.clicks, 0),
        pixels: allDays.reduce((sum, day) => sum + day.pixels, 0),
        PinkkerPrime: allDays.reduce((sum, day) => sum + day.PinkkerPrime, 0),
        communityBuy: allDays.reduce((sum, day) => sum + day.communityBuy, 0),
        PaidCommunities: allDays.reduce(
          (sum, day) => sum + day.PaidCommunities,
          0
        ),
        CommissionsSuscripcion: allDays.reduce(
          (sum, day) => sum + day.CommissionsSuscripcion,
          0
        ),
        CommissionsDonation: allDays.reduce(
          (sum, day) => sum + day.CommissionsDonation,
          0
        ),
        CommissionsCommunity: allDays.reduce(
          (sum, day) => sum + day.CommissionsCommunity,
          0
        ),
      };

      // Ordenar los días cronológicamente
      allDays.sort((a, b) => new Date(a.day) - new Date(b.day));
      setEarningsByMonthRange(allDays);
      setTotals(newTotals);
    } catch (error) {
      console.error("Error fetching earnings for the date range:", error);
    }
  };

  useEffect(() => {
    fetchEarningsByMonth(format(startDate, "yyyy-MM-dd"));
  }, [startDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchEarningsByMonthRange(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
    }
  }, [startDate, endDate]);

  const handleRangeSelect = () => {
    if (startDate && endDate) {
      fetchEarningsByMonthRange(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "5px",
            width: "160px",
          }}
        >
          <Grid style={{ backgroundColor: "#afb1bb", padding: "5px" }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                marginBottom: "5px",
                textAlign: "center",
                color: "white",
              }}
            >
              {label}
            </Typography>
          </Grid>
          {payload.map((item, index) => (
            <Grid
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2px",
                justifyContent: "space-between",
                color: "black",
                padding: "5px",
              }}
            >
              <Grid style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    backgroundColor: item.color,
                    borderRadius: "50%",
                    marginRight: "5px",
                    fontSize: "12px",
                  }}
                ></span>
                <Typography style={{ fontSize: "14px" }}>
                  {item.name}:
                </Typography>
              </Grid>
              <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Box>
      );
    }
    return null;
  };

  const handleMetricVisibility = (metric) => {
    setMetricsVisibility((prevState) => ({
      ...prevState,
      [metric]: !prevState[metric],
    }));
  };

  return (
    <Box style={{ fontWeight: "bolder" }}>
      <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          customInput={<Button variant="outlined">Inicio</Button>}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          customInput={<Button variant="outlined">Fin</Button>}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
        <Button onClick={handleRangeSelect}>Actualizar Rango</Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          padding: "1rem",
          background: "#000000",
          borderRadius: "8px",
          boxShadow: "0 .25rem 2rem rgba(0,0,0,.12)",
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={earningsByMonth || earningsByMonthRange}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(tick) => `$${tick}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {metricsVisibility.impressions && (
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.clicks && (
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.pixels && (
              <Line
                type="monotone"
                dataKey="pixels"
                stroke="#ff7300"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.PinkkerPrime && (
              <Line
                type="monotone"
                dataKey="PinkkerPrime"
                stroke="#ffc658"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.communityBuy && (
              <Line
                type="monotone"
                dataKey="communityBuy"
                stroke="#ff5f56"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.PaidCommunities && (
              <Line
                type="monotone"
                dataKey="PaidCommunities"
                stroke="#8c9eff"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.CommissionsSuscripcion && (
              <Line
                type="monotone"
                dataKey="CommissionsSuscripcion"
                stroke="#c6f1ff"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.CommissionsDonation && (
              <Line
                type="monotone"
                dataKey="CommissionsDonation"
                stroke="#ff9b9b"
                activeDot={{ r: 8 }}
              />
            )}
            {metricsVisibility.CommissionsCommunity && (
              <Line
                type="monotone"
                dataKey="CommissionsCommunity"
                stroke="#ffcc99"
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: metricsVisibility.PaidCommunities
                    ? "#8884d8"
                    : "rgba(174, 174, 174, 0.8)",
                }}
              />
            }
            onClick={() => handleMetricVisibility("PaidCommunities")}
          >
            Comunidades Pagas
          </Button>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: metricsVisibility.CommissionsDonation
                    ? "#82ca9d"
                    : "rgba(174, 174, 174, 0.8)",
                }}
              />
            }
            onClick={() => handleMetricVisibility("CommissionsDonation")}
          >
            Comisiones por Donaciones
          </Button>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: metricsVisibility.impressions
                    ? "#8884d8"
                    : "rgba(174, 174, 174, 0.8)",
                }}
              />
            }
            onClick={() => handleMetricVisibility("impressions")}
          >
            Impresiones
          </Button>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: metricsVisibility.clicks
                    ? "#82ca9d"
                    : "rgba(174, 174, 174, 0.8)",
                }}
              />
            }
            onClick={() => handleMetricVisibility("clicks")}
          >
            Clics
          </Button>
        </Box>
      </Box>

      <Box sx={{ padding: "1rem", background: "#000000", color: "#ffff" }}>
        <Typography variant="h6">Totales</Typography>
        <Typography variant="body1">
          Total Ganancias del Mes: $
          {earningsByMonth?.total ||
            (earningsByMonthRange?.length > 0
              ? earningsByMonthRange.reduce(
                  (acc, month) => acc + (month.total || 0), // Suma el total de cada mes
                  0
                )
              : 0)}
        </Typography>

        <Typography variant="body1">
          Comunidades Pagas Totales: ${totals.PaidCommunities}
        </Typography>
        <Typography variant="body1">
          Comisiones por Donaciones Totales: ${totals.CommissionsDonation}
        </Typography>
        <Typography variant="body1">
          Impresiones Totales: {totals.impressions}
        </Typography>
        <Typography variant="body1">Clics Totales: {totals.clicks}</Typography>
        <Typography variant="body1">Pixels Totales: {totals.pixels}</Typography>
        <Typography variant="body1">
          PinkkerPrime Totales: ${totals.PinkkerPrime}
        </Typography>
        <Typography variant="body1">
          Community Buy Totales: ${totals.communityBuy}
        </Typography>
        <Typography variant="body1">
          Comisiones Suscripción Totales: ${totals.CommissionsSuscripcion}
        </Typography>
        <Typography variant="body1">
          Comisiones Comunidad Totales: ${totals.CommissionsCommunity}
        </Typography>
      </Box>
    </Box>
  );
}
