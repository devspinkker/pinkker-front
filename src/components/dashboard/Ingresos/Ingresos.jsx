import React, { useEffect, useState } from 'react'
import DashboarLayout from '../DashboarLayout'
import { Box, Button, Grid, Menu, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsRecordCircle } from 'react-icons/bs';
import { MdOutlineAccessTime } from 'react-icons/md';
import {
    GetDailyEarningsForMonth,
    getEarningsDay,
    getEarningsMonth,
    getEarningsWeek,
} from "../../../services/backGo/ingresos";
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale español

function Ingresos({ user, tyExpanded, isMobile }) {
    // Obtener la fecha en formato 'YYYY-MM'
    const fechaDiaFormateada = format(new Date(), 'yyyy-MM-dd');
    const fechaMesFormateada = format(new Date(), 'yyyy-MM');
    const [dataEarnings, setDataEarnings] = useState();
    const token = localStorage.getItem("token");
    const [filteredData, setFilteredData] = useState();

    const [dataDay, setDataDay] = useState();
    const [dataMonth, setDataMonth] = useState();
    const [dataYear, setDataYear] = useState();
    const [dataWeek, setDataWeek] = useState();

    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [singleDate, setSingleDate] = useState(fechaMesFormateada);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isRange, setIsRange] = useState(false); // Toggle between single and range selection

    const [showAdMoney, setShowAdMoney] = useState(true);
    const [showDonationsMoney, setShowDonationsMoney] = useState(true);
    const [showSubscriptionsMoney, setShowSubscriptionsMoney] = useState(true);


    const [typeTabEarnings, setTypeTabEarnings] = useState({
        day: false,
        week: false,
        month: false,
        year: true
    });

    console.log('typeTabEarnings', typeTabEarnings)
    const getEarningsDayTotal = async (token, fechaFormateada) => {
        setTypeTabEarnings({ day: true, month: false, year: false, week: false })

        try {
            const res = await getEarningsDay(token, fechaFormateada);
            setDataDay(res.data)

        } catch (error) {
            console.error("Error fetching more stream summaries:", error);
        }
    };
    const getEarningsMonthTotal = async (token, fechaFormateada) => {
        setTypeTabEarnings({ day: false, month: true, year: false, week: false })
        try {
            const res = await getEarningsMonth(token, fechaFormateada);
            setDataMonth(res.data)

        } catch (error) {
            console.error("Error fetching more stream summaries:", error);
        }
    };
    const getEarningsWeekTotal = async (token, fechaFormateada) => {
        setTypeTabEarnings({ day: false, month: false, year: false, week: true })
        try {
            const res = await getEarningsWeek(token, fechaFormateada);
            setDataWeek(res.data)

        } catch (error) {
            console.error("Error fetching more stream summaries:", error);
        }
    };

    const getEarningsMonthDefault = async (token, fechaFormateada) => {
        try {
            const res = await GetDailyEarningsForMonth(token, fechaFormateada);
            // Si `res.data` es un objeto, convertimos sus valores en un array
            const data = Object.values(res.data);

            // Formatear los datos para el gráfico
            const formattedData = data.map((item) => ({
                fecha: new Date(item.Date).toISOString().split('T')[0],  // Convertir la fecha al formato YYYY-MM-DD
                Admoney: item.Earnings.Admoney,
                DonationsMoney: item.Earnings.DonationsMoney,
                SubscriptionsMoney: item.Earnings.SubscriptionsMoney,
            }));
            setDataEarnings(formattedData)
        } catch (error) {
            console.error("Error fetching more stream summaries:", error);

        }
    }

    useEffect(() => {
        getEarningsMonthDefault(token, singleDate)
    }, [singleDate])



    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleSingleSelect = () => {
        setIsRange(false);
        handleMenuClose();
    };

    const handleChangeSingleDate = (date) => {
        const fechaFormateada = format(new Date(date), 'yyyy-MM');
        setSingleDate(fechaFormateada)
    }
    const handleRangeSelect = () => {
        setIsRange(true);
        handleMenuClose();
    };

    // Componente de Tooltip personalizado
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        width: '160px',
                    }}
                >
                    <Grid style={{ backgroundColor: '#afb1bb', padding: '5px' }}>

                        <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '5px', textAlign: 'center', color: 'white' }}>
                            {label}
                        </Typography>
                    </Grid>
                    {payload.map((item, index) => (
                        <Grid
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '2px',
                                justifyContent: 'space-between',
                                color: 'black',
                                padding: '5px'
                            }}
                        >
                            <Grid style={{ display: 'flex', alignItems: 'center' }}>

                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: item.color, // Color de fondo relleno
                                        borderRadius: '50%',
                                        marginRight: '5px',
                                        fontSize: '12px'
                                    }}
                                ></span>
                                <Typography style={{ fontSize: '14px' }}>
                                    {item.name}:

                                </Typography>
                            </Grid>
                            <Typography style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {item.value}
                            </Typography>
                        </Grid>
                    ))}
                </Box>
            );
        }

        return null;
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    // Función para alternar la visibilidad
    const toggleLine = (key) => {

        if (key === 'Admoney') setShowAdMoney(!showAdMoney);
        if (key === 'DonationsMoney') setShowDonationsMoney(!showDonationsMoney);
        if (key === 'SubscriptionsMoney') setShowSubscriptionsMoney(!showSubscriptionsMoney);
    };
    return (
        <DashboarLayout user={user} isMobile={isMobile} >
            <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '15px'
                    }}
                >
                    {/* Botón para abrir opciones de filtro */}
                    <Button
                        variant="contained"
                        onClick={handleSingleSelect}
                        sx={{ backgroundColor: '#f16397', color: 'white', borderRadius: '8px' }}
                    >
                        {format(singleDate, "MMMM 'DE' yyyy", { locale: es }).toUpperCase()}
                    </Button>

                    {/* Menú para seleccionar el modo de filtro
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleSingleSelect}>Filtrar por mes</MenuItem>
                        <MenuItem onClick={handleRangeSelect}>Filtrar por rango de meses</MenuItem>
                    </Menu> */}

                    {/* Componente de selector de mes */}
                    {isRange ? (
                        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                customInput={<TextField label="Mes de inicio" variant="outlined" />}
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
                                customInput={<TextField label="Mes de fin" variant="outlined" />}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                            />
                        </Box>
                    ) : (
                        <DatePicker
                            selected={singleDate}
                            onChange={(date) => handleChangeSingleDate(date)}
                            customInput={<TextField label="Mes" variant="outlined" />}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                        />
                    )}
                </Box>
                <Grid style={{ display: 'flex', flexDirection: 'column', flex: 'auto', borderRadius: '1rem', boxShadow: '0 .25rem 2rem rgba(0,0,0,.12)', background: '#fff', alignItems: 'flex-start' }}>

                    <ResponsiveContainer width="95%" height={400} style={{ padding: '2rem' }}>
                        <LineChart data={dataEarnings}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="fecha"
                                tickFormatter={(tick) => {
                                    const date = new Date(tick);
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.getDate()).padStart(2, '0');
                                    return `${month}-${day}`;
                                }}
                                tick={{ fontSize: 12 }}
                                interval={0}
                                tickMargin={5}
                                minTickGap={30}
                            />
                            <YAxis tickFormatter={(tick) => `$${tick}`} />
                            <Tooltip content={<CustomTooltip />} />

                            {showAdMoney && <Line type="monotone" dataKey="Admoney" name="Anuncios" stroke="#8884d8" fill="#8884d8" strokeWidth={2} />}
                            {showDonationsMoney && <Line type="monotone" dataKey="DonationsMoney" name="Donaciones" stroke="#82ca9d" fill="#82ca9d" strokeWidth={2} />}
                            {showSubscriptionsMoney && <Line type="monotone" dataKey="SubscriptionsMoney" name="Suscripciones" stroke="#ffc658" fill="#ffc658" strokeWidth={2} />}
                        </LineChart>
                    </ResponsiveContainer>

                    <Box display="flex" alignItems="center" style={{ padding: '.75rem' }}>
                        <Grid>
                            <Button
                                startIcon={
                                    <BsRecordCircle style={{ color: !showAdMoney ? 'rgba(174, 174, 174, 0.8)' : '#8884d8' }} />
                                }
                                style={{
                                    color: !showAdMoney ? 'rgba(174, 174, 174, 0.8)' : '#8884d8',
                                    textTransform: 'none',
                                }}
                                onClick={(e) => toggleLine(e.target.name)}
                                name='Admoney'
                            >
                                Anuncios
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                startIcon={
                                    <BsRecordCircle style={{ color: !showDonationsMoney ? 'rgba(174, 174, 174, 0.8)' : '#82ca9d' }} />
                                }
                                style={{
                                    color: !showDonationsMoney ? 'rgba(174, 174, 174, 0.8)' : '#82ca9d',
                                    textTransform: 'none',
                                }}
                                onClick={(e) => toggleLine(e.target.name)}
                                name='DonationsMoney'

                            >
                                Donaciones
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                startIcon={
                                    <BsRecordCircle style={{ color: !showSubscriptionsMoney ? 'rgba(174, 174, 174, 0.8)' : '#ffc658' }} />
                                }
                                style={{
                                    color: !showSubscriptionsMoney ? 'rgba(174, 174, 174, 0.8)' : '#ffc658',
                                    textTransform: 'none',
                                }}
                                onClick={(e) => toggleLine(e.target.name)}
                                name='SubscriptionsMoney'

                            >
                                Suscripciones
                            </Button>
                        </Grid>
                    </Box>
                </Grid>

                <Box sx={{ width: '98%', padding: '10px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
                    {/* Tabs Section */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '16px' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="stats tabs">
                            <Tab label="De todo el tiempo" icon={<MdOutlineAccessTime style={{ fontSize: '28px' }} />}
                                iconPosition="start"
                            />
                            <Tab label="Mes" onClick={() => getEarningsMonthTotal(token, fechaMesFormateada)} />
                            <Tab label="Semana" onClick={() => getEarningsWeekTotal(token, fechaDiaFormateada)} />
                            <Tab label="Hoy" onClick={() => getEarningsDayTotal(token, fechaDiaFormateada)} />
                        </Tabs>
                    </Box>


                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="textSecondary">Anuncios:</Typography>
                            <Typography variant="body1">${typeTabEarnings?.day ? dataDay?.Admoney : typeTabEarnings?.month ? dataMonth?.Admoney : typeTabEarnings?.week ? dataWeek?.Admoney : typeTabEarnings?.year && dataYear?.Admoney}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="textSecondary">Donaciones:</Typography>
                            <Typography variant="body1">${typeTabEarnings?.day ? dataDay?.DonationsMoney : typeTabEarnings?.month ? dataMonth?.DonationsMoney : typeTabEarnings?.week ? dataWeek?.DonationsMoney : typeTabEarnings?.year && dataYear?.DonationsMoney}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="textSecondary">Suscripciones:</Typography>
                            <Typography variant="body1">${typeTabEarnings?.day ? dataDay?.SubscriptionsMoney : typeTabEarnings?.month ? dataMonth?.SubscriptionsMoney : typeTabEarnings?.week ? dataWeek?.SubscriptionsMoney : typeTabEarnings?.year && dataYear?.SubscriptionsMoney}</Typography>
                        </Grid>
                        {/* Add more Grid items as needed */}
                    </Grid>

                    {/* Total Ingress Section */}
                    <Box sx={{ marginTop: '16px', textAlign: 'right' }}>
                        <Typography variant="subtitle1" color="primary">Ingresos Totales: ${typeTabEarnings?.day ? dataDay?.SubscriptionsMoney + dataDay?.DonationsMoney + dataDay?.Admoney : typeTabEarnings?.month ? dataMonth?.SubscriptionsMoney + dataMonth?.DonationsMoney + dataMonth?.Admoney : typeTabEarnings?.week ? dataWeek?.SubscriptionsMoney + dataWeek?.Admoney + dataWeek?.DonationsMoney : typeTabEarnings?.year && dataYear?.SubscriptionsMoney + dataYear?.DonationsMoney + dataYear?.Admoney}</Typography>
                    </Box>
                </Box>

            </Grid>

        </DashboarLayout>

    )
}

export default Ingresos