import React, { useState, useEffect } from "react"

import "./ExploreCategories.css"

import Card from "../../home/categories/Card"
import Skeleton from '@mui/material/Skeleton';

import { getAllCategories } from "../../../services/categories";
import { getStreamsOnline } from "../../../services/stream"

import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Search from "../../navbar/search/Search";


export default function ExploreCategories({ isMobile }) {

    const auth = useSelector(state => state.auth)
    const { user, isLogged } = auth
    const token = useSelector(state => state.token)

    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => { setIsLoading(false) }, 2000)

    const [categories, setCategories] = useState(null)
    const [streams, setStreams] = useState(null)
    const streamsData = [
        {
            streamer: 'eldenguee',
            title: 'Jugando league of legends',
            viewers: '50000',
            tags: ['lol', 'league of legends'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Lucas luna',
            title: 'Programando Pinkker',
            viewers: '50000',
            tags: ['charlando'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming'],
            image: '/images/pinkker-stream.png'

        },
    ]
    useEffect(() => {
        const fetchData = async () => {
            const data = await getStreamsOnline(30);
            if (data != null && data != undefined) {
                setStreams(data);
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllCategories(token)
            if (result != null && result != undefined) {
                setCategories(result)
            }
        }
        fetchData()
    }, [token])
    function shuffle(o) {
        for (var j, x, i = o?.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    let arrayCombinado = categories?.concat(streamsData)
    let arrayDesordenado = shuffle(arrayCombinado)


    let arregloDeArreglos = [];
    const LONGITUD_PEDAZOS = 5; // Partir en arreglo de 3
    for (let i = 0; i < arrayDesordenado?.length; i += LONGITUD_PEDAZOS) {
        let pedazo = arrayDesordenado?.slice(i, i + LONGITUD_PEDAZOS);
        arregloDeArreglos.push(pedazo);
    }
    console.log("Arreglo de arreglos: ", arregloDeArreglos);

    const [filtros, setFiltros] = useState({
        clips: false,
        streams: false,
        categories: false,
    })

    const filter = (e) => {
        if (e === 'clips') {
            setFiltros({
                clips: true,
                streams: false,
                categories: false,
            })
        } else if (e === 'streams') {
            setFiltros({
                clips: false,
                streams: true,
                categories: false,
            })
        } else if (e === 'categories') {
            setFiltros({
                clips: false,
                streams: false,
                categories: true,
            })
        }
    }
    return (
        <div className="explorecategories-body">
            <div>
                {
                    isMobile &&
                    <Search isMobile={isMobile} />
                }

            </div>
            <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }} >

                <div className="filtros" style={{ borderRadius: '5px', backgroundColor: '#f36196', paddingRight: '15px', paddingLeft: '15px' }} onClick={() => filter('clips')} value={"clips"}>
                    <Typography style={{ color: 'white', fontSize: isMobile ? '24px' : '' }}>Clips</Typography>
                </div>
                <div className="filtros" style={{ borderRadius: '5px', backgroundColor: '#f36196', paddingRight: '15px', paddingLeft: '15px' }} onClick={() => filter('streams')}>
                    <Typography style={{ color: 'white', fontSize: isMobile ? '24px' : '' }}>Streams</Typography>
                </div>
                <div className="filtros" style={{ borderRadius: '5px', backgroundColor: '#f36196', paddingRight: '15px', paddingLeft: '15px' }} onClick={() => filter('categories')}>
                    <Typography style={{ color: 'white', fontSize: isMobile ? '24px' : '' }}>Categorias</Typography>
                </div>
            </div>

            <div className="explorecategories-card-container">
                {isLoading &&
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>
                        <div style={{ marginRight: "9px", marginTop: "30px" }}>
                            <Skeleton variant="rectangular" width={150} height={226} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={75} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                            <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                        </div>

                    </div>}

                {
                    filtros?.categories && categories?.map((categorie) => <Card width={isMobile ? '160px' : "160px"} isLoading={isLoading} name={categorie.name} image={categorie.image ?? '/images/pinkker-stream.png'} spectators={categorie.spectators} tags={categorie.tags} />)
                }
                {
                    filtros?.streams && streamsData?.map((stream) => <Card width={stream?.streamer && isMobile ? '100%' : stream?.streamer && !isMobile ? '30%' : "160px"} isLoading={isLoading} name={stream.streamer} image={stream.image ?? '/images/pinkker-stream.png'} spectators={stream.viewers} tags={stream.tags} />)
                }

                {!filtros?.categories && !filtros?.streams && arregloDeArreglos && arregloDeArreglos?.map((cat) => cat?.map ((categorie) => <Card width={categorie?.streamer && isMobile ? '100%' : categorie?.streamer && !isMobile ? '30%' : "160px"} height={'30%'} isLoading={isLoading} name={categorie?.name || categorie?.streamer} image={categorie?.image ?? '/images/pinkker-stream.png'} spectators={categorie?.spectators} tags={categorie?.tags} />))}


            </div>

        </div>
    )
}