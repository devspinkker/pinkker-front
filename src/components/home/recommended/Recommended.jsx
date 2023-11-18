import React, { useState, useEffect } from "react"

import "./Recommended.css"

import VideoCard from "../../card/VideoCard"
import Skeleton from '@mui/material/Skeleton';

import { getStreamsOnline } from "../../../services/stream";

import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import Chat from "../../channel/chat/Chat";
import { getChatRoom } from "../../../services/chat"
import InfiniteScroll from 'react-infinite-scroll-component';

let socket;

function CardSkeleto() {
    return <div style={{ margin: "20px auto" }}>
        <Skeleton variant="rectangular" width={"300px"} height={"150px"} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
        <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton variant="circular" style={{ backgroundColor: "rgb(32, 32, 31)" }} width={40} height={40} />
            <div style={{ marginLeft: "10px" }}>
                <Skeleton variant="text" width={100} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                <Skeleton variant="text" width={50} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                <Skeleton variant="text" width={50} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
            </div>
        </div>
    </div>
}

function CardSkeletoBig() {
    return <div style={{ margin: "20px" }}>
        <Skeleton variant="rectangular" width={"700px"} height={"350px"} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
        <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton variant="circular" style={{ backgroundColor: "rgb(32, 32, 31)" }} width={40} height={40} />
            <div style={{ marginLeft: "10px" }}>
                <Skeleton variant="text" width={200} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                <Skeleton variant="text" width={150} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
                <Skeleton variant="text" width={150} style={{ backgroundColor: "rgb(32, 32, 31)" }} />
            </div>
        </div>
    </div>
}

export default function Recommended({ isMobile, socketMain, handleMessage }) {
    const [chatExpanded, setChatExpanded] = useState(false);

    const [streams, setStreams] = useState(null);
    const [userMod, setUserMod] = useState(false);
    const [userVip, setUserVip] = useState(false);
    const [userBan, setUserBan] = useState(false);
    const token = useSelector(state => state.token)



    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => { setIsLoading(false) }, 1500)

    const auth = useSelector(state => state.auth)
    const { user, isLogged } = auth

    console.log('streams', streams)



    useEffect(() => {
        const fetchData = async () => {
            const response = await getStreamsOnline(1)
            if (response != null && response != undefined) {
                setStreams(response)
            }
        }
        fetchData()
    }, [])
    const [pointGoal, setPointGoal] = useState(0);
    const [goal, setGoal] = useState(false);

    const callbackDonation = (e) => {
        setPointGoal(pointGoal + e);
        if (pointGoal < 9999) {

            setGoal(true);
            setPointGoal(0);
            setTimeout(() => {
                setGoal(false);
            }, 4000);

        }
    }
    const [chatStream, setChatStream] = useState()
    const [userSuscripted, setUserSuscripted] = useState(false);
    const [suscribers, setSuscribers] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            if (streams?.length) {
                console.log('dataSret', streams[0]?.streamer)
                const data = await getChatRoom(streams[0]?.streamer)
                setChatStream(data)
                console.log('dataSt', data)
            } else {
                console.log('NO HAY STREAMS EN VIVO')
            }
        }
        fetchData()
    }, [streams]);

    const streamsData = [
        {
            streamer: 'eldenguee',
            title: 'Jugando league of legends',
            viewers: '50000',
            tags: ['lol', 'league of legends']
        },
        {
            streamer: 'Lucas luna',
            title: 'Programando Pinkker',
            viewers: '50000',
            tags: ['charlando']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
        {
            streamer: 'Alexis Ibarra',
            title: 'Programando..',
            viewers: '50000',
            tags: ['charlando', 'programming']
        },
    ]
    const [dataSource, setDataSource] = useState(Array.from({ length: 4 }))
    const fetchMoreData = () => {
        setTimeout(() => {
            setDataSource(dataSource.concat(Array.from({ length: 20 })))
        }, 500)
    }
    return (
        <div className="home-recommended">

            {/* {streams == null ? <Skeleton variant="text" width={"20%"} height={30} style={{ backgroundColor: "rgb(32, 32, 31)" }} /> : <h3 style={{ color: "#ededed", marginLeft: '10px' }}> <a className="text-remarcado" style={{ color: "#f36196" }}>Directos</a> recomendados</h3>} */}


            <div style={{ display: isMobile ? "block" : "flex", marginTop: "20px" }}>
                {streams === null && streams === undefined ? <CardSkeletoBig /> :
                    <div style={{ marginLeft: "20px", marginRight: "14px" }}>
                        {streams && streams.map((stream, index) => index < 1 &&
                            <VideoCard big={true} isMobile={isMobile} tags={stream.stream_tag} streamerImage={stream.streamer_avatar} streamer={stream.streamer} categorie={stream.stream_category} title={stream.stream_title} viewers={stream.viewers} image={stream.stream_thumbnail} />)}
                        {/* {
                            chatStream &&

                            <Chat
                                socket={socket}
                                socketMain={socketMain}
                                handleSendMessage={(e) => handleMessage(e)}
                                chatExpanded={() => setChatExpanded(!chatExpanded)}
                                callback={(e) => callbackDonation(e)}                        
                                setUserSuscripted={setUserSuscripted}
                                setSuscribers={setSuscribers}
                            />
                        } */}
                    </div>}

                <div className="home-recommended-card-container">
                    {streams == null || !streams.length ?
                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                            {streamsData?.map((streams, index) => {
                                return (

                                    <VideoCard tags={streams?.tags} isMobile={isMobile} streamer={streams?.streamer} categorie={'test'} title={streams?.title} viewers={streams?.viewers} />


                                )
                            })

                            }


                        </div>
                        : streams && streams.map((stream, index) => index > 0 &&
                            <>
                                <VideoCard tags={stream.stream_tag} isMobile={isMobile} streamerImage={stream.streamer_avatar} streamer={stream.streamer} categorie={stream.stream_category} title={stream.stream_title} viewers={stream.viewers} image={stream.stream_thumbnail} />
                            </>
                        )

                    }
                </div>
            </div>
        </div>
    )
}