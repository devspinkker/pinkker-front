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
  const [showImpressions, setShowImpressions] = useState(true);
  const [showClicks, setShowClicks] = useState(true);
  const [showPixels, setShowPixels] = useState(true);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalPixels, setTotalPixels] = useState(0);
  const token = window.localStorage.getItem("token");

  const fetchEarningsByMonth = async (date) => {
    try {
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      const res = await GetEarningsByMonth(token, formattedDate, Code);
      const data = res.data;
      const formattedData = Object.keys(data.weeks).map((week) => ({
        week,
        ...data.weeks[week],
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

      // Combinar datos de todos los meses en el rango
      const allWeeks = data.reduce((acc, month) => {
        Object.keys(month.weeks).forEach((week) => {
          acc.push({
            week: `${month.month}-${week}`,
            ...month.weeks[week],
          });
        });
        return acc;
      }, []);

      // Calcular totales
      const totalImpressions = allWeeks.reduce(
        (sum, week) => sum + week.impressions,
        0
      );
      const totalClicks = allWeeks.reduce((sum, week) => sum + week.clicks, 0);
      const totalPixels = allWeeks.reduce((sum, week) => sum + week.pixels, 0);

      // Ordenar semanas cronológicamente
      allWeeks.sort((a, b) => new Date(a.week) - new Date(b.week));
      setEarningsByMonthRange(allWeeks);
      setTotalImpressions(totalImpressions);
      setTotalClicks(totalClicks);
      setTotalPixels(totalPixels);
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

  return (
    <Box>
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
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 .25rem 2rem rgba(0,0,0,.12)",
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={earningsByMonth || earningsByMonthRange}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(tick) => `$${tick}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {showImpressions && (
              <Line
                type="monotone"
                dataKey="impressions"
                name="Impresiones"
                stroke="#8884d8"
              />
            )}
            {showClicks && (
              <Line
                type="monotone"
                dataKey="clicks"
                name="Clics"
                stroke="#82ca9d"
              />
            )}
            {showPixels && (
              <Line
                type="monotone"
                dataKey="pixels"
                name="Píxeles"
                stroke="#ffc658"
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        <Box display="flex" alignItems="center" style={{ padding: ".75rem" }}>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: !showImpressions
                    ? "rgba(174, 174, 174, 0.8)"
                    : "#8884d8",
                }}
              />
            }
            style={{
              color: !showImpressions ? "rgba(174, 174, 174, 0.8)" : "#8884d8",
              textTransform: "none",
            }}
            onClick={() => setShowImpressions(!showImpressions)}
          >
            Impresiones
          </Button>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: !showClicks ? "rgba(174, 174, 174, 0.8)" : "#82ca9d",
                }}
              />
            }
            style={{
              color: !showClicks ? "rgba(174, 174, 174, 0.8)" : "#82ca9d",
              textTransform: "none",
            }}
            onClick={() => setShowClicks(!showClicks)}
          >
            Clics
          </Button>
          <Button
            startIcon={
              <BsRecordCircle
                style={{
                  color: !showPixels ? "rgba(174, 174, 174, 0.8)" : "#ffc658",
                }}
              />
            }
            style={{
              color: !showPixels ? "rgba(174, 174, 174, 0.8)" : "#ffc658",
              textTransform: "none",
            }}
            onClick={() => setShowPixels(!showPixels)}
          >
            Píxeles
          </Button>
        </Box>

        {earningsByMonthRange && (
          <Box sx={{ padding: "1rem" }}>
            <Typography variant="h6">Totales</Typography>
            <Typography variant="body1">
              Impresiones Totales: {totalImpressions}
            </Typography>
            <Typography variant="body1">
              Clics Totales: {totalClicks}
            </Typography>
            <Typography variant="body1">
              Píxeles Totales: {totalPixels}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
