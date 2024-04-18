import React, { useEffect, useRef } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";
import { Grid } from '@mui/material';
import CardCategorie from "../home/categories/CardCategorie";
import ClipCard from '../card/ClipCard';
import "./SliderLayout.css"
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { GrGamepad } from 'react-icons/gr';


function SliderLayout(props) {

    return (
        <Swiper
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            spaceBetween={props.clipT ? 20 : 5}
            navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={props.isMobile ? props.clipT ? 1 : 2 :props.clipT ? 4.5 : 9}
            Pagination
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}

        >
            {/* Botones de "Next" y "Prev" personalizados */}
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {
                    props.Categoria &&
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: !props.isMobile && "80%",
                        }}
                    >
                        {/* <img src="/images/original.svg" style={{ width: '2%', color:'#856ffc' }} /> */}

                        <GrGamepad style={{ color: "#856ffc", fontSize: "20px" }} />
                        <h2 style={{ fontFamily: "Inter", color: "white" }}>Categorias</h2>
                    </div>
                }



                {
                    props.clipT &&
                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '30%' }}>

                        <AiOutlinePlayCircle style={{ color: '#856ffc', fontSize: '20px' }} />
                        <h2 style={{ color: 'white', fontSize: '20px' }}>{props.titulo ? 'Vods más vistos' : props.isMobile ? 'Clips' :'Clips más vistos'} </h2>
                    </Grid>
                }



                <div className="manager-recommended-actions" style={{ width: '30% !important', justifyContent: 'flex-end' }}>
                    <div className="manager-recommended-actions-ver-todos">
                        <Link to="/plataform/explore?tipo=categories" style={{ padding: 0 }}>
                            <span style={{ fontFamily: 'Signika Negative', fontSize: '14px' }}>Ver todos</span>
                        </Link>
                    </div>

                    <div className="manager-recommended-actions-arrow">

                        <div className="custom-prev" style={{ fontSize: '14px' }}> <i
                            style={{ margin: "0px 10px", cursor: "pointer" }}
                            className="fas fa-chevron-left"

                        ></i></div>
                        <div className="custom-next" style={{ fontSize: '14px' }}> <i
                            style={{ cursor: "pointer" }}
                            className="fas fa-chevron-right"

                        ></i></div>
                    </div>


                </div>
            </Grid>


            {props.Categoria &&
                <>


                    {props?.Categories?.filter((categorie, index) => index < 10).map((categorie, index) => (
                        <SwiperSlide style={{ color: 'white' }}>
                            <CardCategorie

                                width={"160px"}
                                name={categorie.nombre}
                                image={categorie.img ?? "/images/pinkker-stream.png"}
                                spectators={categorie.spectators}
                                tags={categorie.tags}
                                TopColor={categorie.TopColor}
                            />
                        </SwiperSlide>
                    ))}

                    {props?.Categories?.filter((categorie, index) => index === 36).map((categorie) => (
                        <SwiperSlide style={{ color: 'white', display: 'flex', margin: '0 auto', justifyContent: 'center' }}>
                            <CardCategorie
                                width={"160px"}
                                name={categorie.nombre}
                                titulo={'Ver Todos'}
                                image={categorie.img ?? "/images/pinkker-stream.png"}
                                spectators={categorie.spectators}
                                tags={categorie.tags}
                                TopColor={categorie.TopColor}
                            />
                        </SwiperSlide>
                    ))}
                </>
            }

            {
                props.clipT &&
                <>
                    {
                        props?.clips?.filter((clip, index) => index < 10).map((clip) => (
                            <SwiperSlide className='hoverSwiper' style={{ color: 'white' }}>

                                <ClipCard width="350px" video={clip} />

                            </SwiperSlide>
                        ))
                    }
                </>
            }
        </Swiper>
    )
}

export default SliderLayout