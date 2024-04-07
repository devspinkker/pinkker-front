import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";

import CardCategorie from "../home/categories/CardCategorie";
import ClipCard from '../card/ClipCard';



function SliderLayout(props) {
console.log(props)
    return (
        <Swiper
            navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={ props.clipT ? 3 :7}
            Pagination
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}

        >
            {/* Botones de "Next" y "Prev" personalizados */}
            <div className="manager-recommended-actions">
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

            {props.Categoria &&
                <>


                    {props?.Categories?.filter((categorie, index) => index < 10).map((categorie) => (
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
                        <SwiperSlide style={{ color: 'white', display:'flex', margin:'0 auto', justifyContent:'center' }}>
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
                        props?.clips?.map((clip) => (
                            <SwiperSlide style={{ color: 'white' }}>

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