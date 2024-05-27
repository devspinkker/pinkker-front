import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IncomeChart from './IncomeChart'
import NavbarLeft from '../../navbarLeft/NavbarLeft';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsChatDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { AiOutlineSetting, AiOutlineUser } from 'react-icons/ai';
import { LiaSlidersHSolid } from 'react-icons/lia';
import { TfiWallet } from 'react-icons/tfi';
import { TbLogout2 } from 'react-icons/tb';

export default function NAnalytics({ isMobile, tyExpanded, user }) {
    const sampleData = [
        // Datos diarios
        { date: '2023-01-01', income: 400, filterType: 'daily' },
        { date: '2023-01-02', income: 350, filterType: 'daily' },
        { date: '2023-01-03', income: 500, filterType: 'daily' },
        { date: '2023-01-04', income: 600, filterType: 'daily' },
        { date: '2023-01-05', income: 700, filterType: 'daily' },
        { date: '2023-01-06', income: 200, filterType: 'daily' },
        { date: '2023-01-07', income: 450, filterType: 'daily' },

        // Datos semanales
        { date: '2023-W01', income: 3200, filterType: 'weekly' },
        { date: '2023-W02', income: 3300, filterType: 'weekly' },
        { date: '2023-W03', income: 2900, filterType: 'weekly' },
        { date: '2023-W04', income: 3500, filterType: 'weekly' },
        { date: '2023-W05', income: 3800, filterType: 'weekly' },
        { date: '2023-W06', income: 3000, filterType: 'weekly' },
        { date: '2023-W07', income: 3400, filterType: 'weekly' },

        // Datos mensuales
        { date: '2023-01', income: 15000, filterType: 'monthly' },
        { date: '2023-02', income: 16000, filterType: 'monthly' },
        { date: '2023-03', income: 17000, filterType: 'monthly' },
        { date: '2023-04', income: 18000, filterType: 'monthly' },
        { date: '2023-05', income: 19000, filterType: 'monthly' },
        { date: '2023-06', income: 20000, filterType: 'monthly' },
        { date: '2023-07', income: 21000, filterType: 'monthly' },
        { date: '2023-08', income: 22000, filterType: 'monthly' },
        { date: '2023-09', income: 23000, filterType: 'monthly' },
        { date: '2023-10', income: 24000, filterType: 'monthly' },
        { date: '2023-11', income: 25000, filterType: 'monthly' },
        { date: '2023-12', income: 26000, filterType: 'monthly' },

        // Datos anuales
        { date: '2020', income: 150000, filterType: 'yearly' },
        { date: '2021', income: 160000, filterType: 'yearly' },
        { date: '2022', income: 170000, filterType: 'yearly' },
        { date: '2023', income: 180000, filterType: 'yearly' },

        // Más datos diarios para 2024
        { date: '2024-01-01', income: 500, filterType: 'daily' },
        { date: '2024-01-02', income: 550, filterType: 'daily' },
        { date: '2024-01-03', income: 600, filterType: 'daily' },
        { date: '2024-01-04', income: 650, filterType: 'daily' },
        { date: '2024-01-05', income: 700, filterType: 'daily' },
        { date: '2024-01-06', income: 750, filterType: 'daily' },
        { date: '2024-01-07', income: 800, filterType: 'daily' },

        // Más datos semanales para 2024
        { date: '2024-W01', income: 4500, filterType: 'weekly' },
        { date: '2024-W02', income: 4600, filterType: 'weekly' },
        { date: '2024-W03', income: 4700, filterType: 'weekly' },
        { date: '2024-W04', income: 4800, filterType: 'weekly' },
        { date: '2024-W05', income: 4900, filterType: 'weekly' },
        { date: '2024-W06', income: 5000, filterType: 'weekly' },
        { date: '2024-W07', income: 5100, filterType: 'weekly' },

        // Más datos mensuales para 2024
        { date: '2024-01', income: 27000, filterType: 'monthly' },
        { date: '2024-02', income: 28000, filterType: 'monthly' },
        { date: '2024-03', income: 29000, filterType: 'monthly' },
        { date: '2024-04', income: 30000, filterType: 'monthly' },
        { date: '2024-05', income: 31000, filterType: 'monthly' },
        { date: '2024-06', income: 32000, filterType: 'monthly' },
        { date: '2024-07', income: 33000, filterType: 'monthly' },
        { date: '2024-08', income: 34000, filterType: 'monthly' },
        { date: '2024-09', income: 35000, filterType: 'monthly' },
        { date: '2024-10', income: 36000, filterType: 'monthly' },
        { date: '2024-11', income: 37000, filterType: 'monthly' },
        { date: '2024-12', income: 38000, filterType: 'monthly' },

        // Datos anuales adicionales
        { date: '2024', income: 200000, filterType: 'yearly' },
    ];
    const [expanded, setExpanded] = useState(true);

    const [subMenu, setSubMenu] = useState(false);

    const [esClick, setEsClick] = useState(false);
    const habilitarSubMenu = (valor, e) => {
        if (e?.type === "click") {
            setEsClick(true);
        } else {
            setEsClick(false);
        }

        setTimeout(() => {
            setSubMenu(valor);
        }, [100]);
    };

    useEffect(() => {
        // Función para manejar el clic en cualquier parte de la página
        const handleClickOutside = () => {
            setSubMenu(false); // Cambiar el estado a false cuando se hace clic fuera del área deseada
        };

        // Agregar un event listener para escuchar clics en el documento
        document.addEventListener("click", handleClickOutside);

        // Limpiar el event listener en la fase de limpieza de useEffect
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const handleLogout = async () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("_id");
        window.localStorage.removeItem("avatar");
        window.location.href = "/";
    };
    return (
        <Grid style={{ display: 'flex', flexDirection:'column' }}>
            <NavbarLeft isMobile={isMobile}
                tyExpanded={expanded}
                user={user}
                tyDashboard={true}
                setExpanded={setExpanded}
            />
            <Grid style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                padding: expanded ? '0vh 0rem 0rem 10rem' : '0rem 0rem 0rem 0rem',
                width: expanded ? '95%' : '95%'
            }}>

                <div className="navigation">
                    <div className="navigation-container-stream-deshboard">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: 'center',
                                padding: '1rem 5.8rem',

                            }}
                        >



                            <a href="/" style={{ width: '20%' }}>

                                <img
                                    style={{ width: '65%' }}
                                    src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                                    alt="Avatar"
                                />

                            </a>






                        </div>

                        <Grid>
                            <Grid
                                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                            >
                                <div className="navbar-image-avatar-container">
                                    <div
                                        style={{
                                            width: "40px",
                                            background: "#2a2e38",
                                            position: "relative",
                                            left: "  ",
                                            top: "2px",
                                        }}
                                        className="navbar-image-avatar"
                                    >
                                        {/* <img src={"/images/iconos/notificacion.png"} alt="" style={{ width: '60%' }} /> */}
                                        <IoMdNotificationsOutline
                                            style={{ fontSize: "20px", color: "white" }}
                                        />
                                    </div>
                                </div>
                                <div className="navbar-image-avatar-container">
                                    <div
                                        style={{
                                            width: "40px",
                                            background: "#2a2e38",
                                            position: "relative",
                                            left: "  ",
                                            top: "2px",
                                        }}
                                        className="navbar-image-avatar"
                                    >
                                        {/* <img src={"/images/iconos/mensaje.png"} alt="" style={{ width: '60%' }} /> */}
                                        <BsChatDots
                                            style={{ fontSize: "20px", color: "white" }}
                                        />
                                    </div>
                                </div>
                                <div className="navbar-image-avatar-container">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            backgroundColor: "#f36196",
                                            position: "relative",
                                            left: "  ",
                                            top: "2px",
                                        }}
                                        className="navbar-image-avatar"
                                        onClick={(e) => habilitarSubMenu(true, e)}
                                        onMouseEnter={
                                            esClick
                                                ? console.log("activo")
                                                : () => habilitarSubMenu(true)
                                        }
                                        onMouseLeave={
                                            esClick
                                                ? console.log("activo")
                                                : () => habilitarSubMenu(false)
                                        }
                                    >
                                        <img
                                            src={user?.Avatar ?? "/images/pixel.png"}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </Grid>

                            {subMenu && (
                                <Grid
                                    onMouseEnter={
                                        esClick
                                            ? console.log("activo")
                                            : () => habilitarSubMenu(true)
                                    }
                                    onMouseLeave={
                                        esClick
                                            ? console.log("activo")
                                            : () => habilitarSubMenu(false)
                                    }
                                    style={{
                                        backgroundColor: "#121418",
                                        border: "1px solid #343843",
                                        position: "absolute",
                                        padding: "1rem",
                                        width: "16.25rem",
                                        right: "105px",
                                        borderRadius: "0.5rem",
                                        zIndex: 99999,
                                    }}
                                >
                                    <Grid
                                        style={{
                                            backgroundColor: "#202329",
                                            borderRadius: "5px",
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: "1rem",
                                        }}
                                    >
                                        <Grid
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "15px",
                                                padding: 10,
                                            }}
                                        >
                                            <img
                                                src={user?.Avatar ?? "/images/pixel.png"}
                                                alt=""
                                                style={{
                                                    width: "20%",
                                                    height: "20%",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                            <Grid
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "1px",
                                                }}
                                            >
                                                <Link
                                                    style={{
                                                        textDecoration: "none",
                                                        margin: 0,
                                                        padding: 0,
                                                    }}
                                                    to={"/" + user.NameUser}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: "white",
                                                            fontSize: "1rem",
                                                            fontFamily: "Inter",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {user?.NameUser ?? "Usuario"}
                                                    </Typography>
                                                </Link>
                                                <Typography
                                                    style={{
                                                        color: "white",
                                                        fontSize: "12px",
                                                        fontFamily: "Inter",
                                                    }}
                                                >
                                                    0 seguidores
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: "15px",
                                            marginTop: "15px",
                                        }}
                                    >
                                        <Link
                                            className="dropdownaccount-link"
                                            to={"/" + user.NameUser}
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <AiOutlineUser style={{ marginRight: "10px" }} />
                                            Tu canal
                                        </Link>

                                        <Link
                                            className="dropdownaccount-link"
                                            to={"/" + user.NameUser + "/dashboard/stream"}
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <LiaSlidersHSolid
                                                style={{ marginRight: "10px", fontSize: "24px" }}
                                            />
                                            Panel de control del creador
                                        </Link>

                                        <Link
                                            className="dropdownaccount-link"
                                            to="/plataform/cartera"
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TfiWallet style={{ marginRight: "10px" }} />
                                            Cartera
                                        </Link>

                                        <Link
                                            className="dropdownaccount-link"
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                            to={"/" + user.NameUser + "/settings"}
                                        >
                                            <AiOutlineSetting style={{ marginRight: "10px" }} />
                                            Configuración
                                        </Link>
                                        <div
                                            className="dropdownaccount-link"
                                            onClick={() => handleLogout()}
                                        >
                                            <TbLogout2 style={{ marginRight: "10px" }} />
                                            Cerrar sesión
                                        </div>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                    </div>
                </div>

                <h1>Métricas de Ingresos</h1>
                <IncomeChart data={sampleData} />
            </Grid>

        </Grid>
    )
}
