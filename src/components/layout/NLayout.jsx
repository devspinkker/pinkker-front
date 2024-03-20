import { Grid } from '@mui/material'
import React, { useState } from 'react'
import NavbarLeft from '../navbarLeft/NavbarLeft'
import Search from '../navbar/search/Search';
import "./NLayout.css";
import { Link } from "react-router-dom";

function NLayout(props) {
    const [pulse, setPulse] = useState(false);

    function clickPulsedButton() {
        setPulse(!pulse);
        props.setExpanded(props.tyExpanded);
    }

    console.log('props.tyExpanded', props.tyExpanded)
    return (
        <Grid style={{ display: 'flex', flexDirection: 'row' }}>
            {/* GRID ASIDE */}
            <Grid style={{ transition: props.tyExpanded ? 'all 1.2s ' : 'all 1.2s ', width: props.tyExpanded ? '15%' : '4.063rem', border: '1px solid #2a2e38', height: '100vh', backgroundColor: '#080808', position: 'sticky', top: 0 }}>

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
                                <span style={{fontSize:'14px'}}>Deportes </span>
                            </Grid>

                            <Grid style={{ height: '3rem', color: 'white', display: 'flex', alignItems: 'center', padding: '.5rem', borderRadius: '.375rem' }} className='button-sports'>
                                <span style={{fontSize:'14px'}}>Categorias</span>
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



                    <Search />
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

                </Grid>

            </Grid>

            {/* GRID NAV - MAIN */}
            <Grid style={{ width: props.tyExpanded ? '85%' : '95%', display: 'flex', flexDirection: 'column', }}>

                <Grid style={{ borderBottom: '1px solid #2a2e38', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.3rem 5.8rem', position: 'sticky', top: 0, zIndex: 9999, backgroundColor: '#080808' }}>
                    <img
                        src="https://res.cloudinary.com/dcj8krp42/image/upload/v1710859756/Emblemas/y9xupuj3mcg5d6prgahm.png"
                        style={{ width: "15%" }}
                        alt=""
                    />
                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <h6

                            className="button-navbar-login"
                        >
                            Login
                        </h6>
                        <h6

                            className="button-navbar-register"
                        >
                            Register
                        </h6>
                    </Grid>

                </Grid>

                <Grid style={{ padding: '2rem 5.8rem', width: '100%' }}>
                    {props.children}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default NLayout