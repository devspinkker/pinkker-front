import { Grid } from '@mui/material'
import React, { useState } from 'react'
import NavbarLeft from '../navbarLeft/NavbarLeft'
import Search from '../navbar/search/Search';
import "./NLayout.css";
import { Link } from "react-router-dom";
import DropdownBalance from '../navbar/balance/DropdownBalance';
import DropdownPurchase from '../navbar/purchase/DropdownPurchase';
import CanalesRecomendados from './CanalesRecomendados';
import Auth from '../auth/Auth';

function NLayout(props) {
    const [pulse, setPulse] = useState(false);
    const [abrir, setAbrir] = useState(true);
    const [showPopupAuth, setShowPopupAuth] = useState(false);
    const [type, setType] = useState(0);
    function clickPulsedButton() {
        setPulse(!pulse);
        props.setExpanded(props.tyExpanded);
    }

    function cerrarCanalesRecomendados() {
        setAbrir(!abrir)
    }

    function togglePopupAuth(type) {
        setShowPopupAuth(!showPopupAuth);
        setType(type);
    }
    const handleToggleExpandFollowStreams = () => {
        setTyExpandedFollowStreams(!tyExpandedFollowStreams);
    };
    const [tyExpandedFollowStreams, setTyExpandedFollowStreams] = useState(false);

    let expandido = pulse;

    return (
        <Grid style={{ display: 'flex', flexDirection: 'row' }}>
            {/* GRID ASIDE */}
            <Grid style={{ maxWidth: props.tyExpanded ? '15%' : '4%', transition: 'all 1.2s ease-in-out', border: '1px solid #2a2e38', height: '100vh', backgroundColor: '#121418', position: 'sticky', top: 0 }}>

                <Grid style={{ padding: props.tyExpanded ? '1.3rem 5px' : '1.8rem 5px', border: '1px solid #2a2e38', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <i
                        onClick={() => clickPulsedButton()}
                        style={{
                            cursor: "pointer",
                            fontSize: props.tyExpanded ? "30px" : "30px",
                            zIndex: "1000",

                            // transform: expanded === false && "rotate(90deg)",

                            color: "#ededed",
                        }}
                        className="fas fa-bars"
                    />

                    {
                        props.tyExpanded &&
                        <Grid style={{ display: 'flex', textAlign: 'center', alignItems: 'center', borderRadius: '.375rem', backgroundColor: '#2a2e38' }}>
                            <Grid className='button-casino' style={{ height: '3rem', color: 'white', display: 'flex', alignItems: 'center', background: ' url(/images/mobile-tab-background-active.svg) rgb(119, 23, 255)', padding: '.5rem', borderRadius: '.375rem' }}>
                                <span style={{ fontSize: '14px' }}>Directos </span>
                            </Grid>

                            <Grid style={{ height: '3rem', color: 'white', display: 'flex', alignItems: 'center', padding: '.5rem', borderRadius: '.375rem' }} className='button-sports'>
                                <span style={{ fontSize: '14px' }}>Categorias</span>
                            </Grid>
                        </Grid>


                    }


                </Grid>


                <Grid style={{ padding: '1.3rem 5px', border: '1px solid #2a2e38', width: '100%', display: 'flex', flexDirection: props.tyExpanded ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                    {
                        !props.tyExpanded && <Grid style={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid style={{ height: '100%', color: 'white', display: 'flex', alignItems: 'center', backgroundColor: 'rgb(119, 23, 255)', padding: '.5rem', borderRadius: '.375rem' }}>
                                <img src="/images/dice.svg" />
                            </Grid>

                            <Grid style={{ height: '100%', color: 'white', display: 'flex', alignItems: 'center', padding: '.5rem', borderRadius: '.375rem' }}>
                                <img src="/images/tennis.svg" />
                            </Grid>
                        </Grid>
                    }



                    <Search tyExpanded={props.tyExpanded} />
                </Grid>

                <Grid >
                    <Grid style={{ padding: '1.3rem 5px', border: '1px solid #2a2e38', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', cursor: 'pointer' }}>
                        <div
                            className={
                                props.tyExpanded
                                    ? "pixel-coming-soon-navbarLeft"
                                    : "pixel-coming-soon-navbarLeft-noexpand"
                            }
                        >

                            <div className="pixel-coming-soon-navbarLeft-img-pixel-container">
                                <img
                                    className="pixel-coming-soon-navbarLeft-img-pixel"
                                    style={{
                                        width: "38px",
                                    }}
                                    src="/images/pixel.png"
                                />
                            </div>
                            {
                                props.tyExpanded &&
                                <div className="pixel-coming-soon-text-container">
                                    <div className="pixel-coming-soon-text">
                                        <span className="pixel-coming-soon-text-pixel">Pinkker</span>
                                        <span className="pixel-coming-soon-text-pxl">(Prime)</span>
                                    </div>
                                    <span className="pixel-coming-soon-navbarLeft-Comming-soon">
                                        Ver beneficios!
                                    </span>
                                </div>
                            }



                        </div>

                    </Grid>



                    <Grid style={{ padding: '1.3rem 5px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <ul style={{ listStyle: 'none', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <Link
                                style={{ textDecoration: 'none' }}
                                className="menu-aside-option"
                                to="/"
                            >
                                <li style={{ color: 'white', display: 'flex', gap: '10px', alignItems: 'center', width: '100% !important', padding: '0rem 15px' }} className='item-li'>

                                    <i
                                        style={{ position: "relative", fontSize: "20px" }}
                                        class="fa fa-home"
                                    />
                                    {
                                        props.tyExpanded && 'Home'
                                    }

                                </li>
                            </Link>
                            <Link
                                style={{ textDecoration: 'none' }}
                                className="menu-aside-option"
                                to="/plataform/explore?tipo=categories"
                            >

                                <li style={{ color: 'white', display: 'flex', gap: '10px', alignItems: 'center', padding: '0rem 15px' }} className='item-li'>
                                    <i
                                        style={{ position: "relative", fontSize: "20px" }}
                                        class="fa fa-search"
                                    />
                                    {
                                        props.tyExpanded && 'Explorar'
                                    }
                                </li>
                            </Link>


                            <Link
                                style={{ textDecoration: 'none' }}
                                className="menu-aside-option"
                                to="/plataform/clips"
                            >
                                <li style={{ color: 'white', display: 'flex', gap: '10px', alignItems: 'center', padding: '0rem 15px' }} className='item-li' >
                                    <i
                                        style={{ position: "relative", fontSize: "20px" }}
                                        class="fas fa-film"
                                    />
                                    {
                                        props.tyExpanded && 'Clips'
                                    }

                                </li>
                            </Link>

                            <Link
                                style={{ textDecoration: 'none' }}
                                className="menu-aside-option"
                                to="/plataform/muro"
                            >
                                <li style={{ color: 'white', display: 'flex', gap: '10px', alignItems: 'center', padding: '0rem 15px' }} className='item-li'>
                                    <i
                                        style={{ position: "relative", fontSize: "20px" }}
                                        class="fas fa-edit"
                                    />
                                    {
                                        props.tyExpanded && 'Muro'
                                    }

                                </li>
                            </Link>

                        </ul>
                    </Grid>
                    <Grid style={{ backgroundColor: '#080808', padding: '0.5rem 15px', borderTop: '1px solid #2a2e38', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {
                            props.tyExpanded ?
                                <>
                                    <Grid style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '5px', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'white', fontFamily: 'Inter', fontWeight: 'normal', fontSize: '14px' }}>Canales Recomendados</span>
                                        <i
                                            style={{
                                                color: "white", marginLeft: "5px", backgroundColor: '#080808', cursor: 'pointer', transform: abrir
                                                    ? "rotate(0deg)"
                                                    : "rotate(-180deg)", transition: 'all 1s '
                                            }}
                                            class={props.abrir ? "fas fa-chevron-down" : "fas fa-chevron-up"}

                                            onClick={() => cerrarCanalesRecomendados()}
                                        />
                                    </Grid>
                                    <Grid style={{ display: abrir ? 'flex' : 'none', flexDirection: 'column', gap: '15px', maxHeight: abrir ? '100% !important' : '0px !important', transition: 'maxHeight 1s ease-out', }}>

                                        {
                                            [...Array(5)].map((_, index) => (
                                                <CanalesRecomendados
                                                    abrir={true}
                                                    streamer={'eldenguee'}
                                                    categorie={'Just Chatting'}
                                                    avatarStreamer={'/images/pinkker-stream.png'}
                                                    spectators={'1000'} />

                                            ))
                                        }
                                    </Grid>
                                </>
                                :
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" style={{ margin: '0 auto' }} className='icono-recomendados'><path fill-rule="evenodd" d="M12.002 3.999a2 2 0 0 1 2 2v2L18 6v8l-3.998-2v2a2 2 0 0 1-2 1.999h-8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8zM12 6H4v8h8V6z" clip-rule="evenodd" fill="#fff"></path></svg>

                                    {
                                        [...Array(5)].map((_, index) => (
                                            <CanalesRecomendados

                                                streamer={'eldenguee'}
                                                categorie={'Just Chatting'}
                                                avatarStreamer={'/images/pinkker-stream.png'}
                                                spectators={'1000'}
                                                abrir={false}
                                            />

                                        ))
                                    }


                                </>


                        }


                    </Grid>
                </Grid>



            </Grid>

            {/* GRID NAV - MAIN */}

            <Grid style={{ width: props.tyExpanded ? '85%' : '95%', display: 'flex', flexDirection: 'column', zIndex: 99999 }}>
                {
                    props.user?.lenght ?
                        <Grid style={{ borderBottom: '1px solid #2a2e38', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.3rem 5.8rem', position: 'sticky', top: 0, zIndex: 9999, backgroundColor: '#080808' }}>
                            <Link to='/'>


                                <img
                                    src="https://res.cloudinary.com/dcj8krp42/image/upload/v1710859756/Emblemas/y9xupuj3mcg5d6prgahm.png"
                                    style={{ width: "15%" }}
                                    alt=""
                                /></Link>
                            <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <h6
                                    onClick={() => togglePopupAuth(0)}
                                    className="button-navbar-login"
                                >
                                    Login
                                </h6>
                                <h6
                                    onClick={() => togglePopupAuth(1)}
                                    className="button-navbar-register"
                                >
                                    Register
                                </h6>
                            </Grid>

                        </Grid>

                        :


                        <Grid style={{ borderBottom: '1px solid #2a2e38', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.3rem 5.8rem', position: 'sticky', top: 0, zIndex: 9999, backgroundColor: '#080808' }}>
                            <img
                                src="https://res.cloudinary.com/dcj8krp42/image/upload/v1710859756/Emblemas/y9xupuj3mcg5d6prgahm.png"
                                style={{ width: "15%" }}
                                alt=""
                            />

                            <Grid style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <Link to="/plataform/cartera">
                                        <div
                                            style={{
                                                // width: "500px",
                                                display: "flex",
                                                justifyContent: "flex-end",
                                            }}
                                            className="button-purchase-pixels"
                                        >
                                            <button>
                                                {props.user?.Pixeles ?? '0'}
                                                <img
                                                    style={{
                                                        width: props.isMobile ? "25px" : "17px",
                                                        marginRight: "-5px",
                                                        marginTop: "3px",
                                                        padding: "10px",
                                                    }}
                                                    src="/images/pixel.png"
                                                    alt=""
                                                />{" "}
                                            </button>
                                        </div>
                                    </Link>

                                    <div >
                                        <button
                                            style={{
                                                borderRadius: "0px 5px 5px 0px",
                                                fontFamily: "inter",
                                                fontWeight: "bolder",
                                            }}
                                        >
                                            Comprar

                                        </button>
                                    </div>
                                </div>

                            </Grid>

                            <Grid>
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
                                    >
                                        <img src={'/images/pixel.png'} alt="" />
                                    </div>
                                </div>
                            </Grid>



                        </Grid>
                }


                <Grid style={{ padding: '2rem 5.8rem', width: '100%' }}>
                    {props.children}

                    {showPopupAuth === true && (
                        <Auth
                            isMobile={props.isMobile}
                            typeDefault={type}
                            closePopup={() => togglePopupAuth()}
                        />
                    )}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NLayout