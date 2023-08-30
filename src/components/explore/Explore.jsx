import React, { useState, useEffect } from "react"

import "./Explore.css"

import ImageGames from "../../images/explore/games.png"
import ImageCreate from "../../images/explore/create.png"
import ImageIrl from "../../images/explore/irl.png"
import ImageMusic from "../../images/explore/music.png"
import ImageEsports from "../../images/explore/esport.png"

import ExploreCategories from "./categories/ExploreCategories"


import VideoCard from "../card/VideoCard"

export default function Explore({ isMobile }) {


   


    const [type, setType] = useState(0)

    useEffect(() => {
        document.title = "Categories - Pinkker";
        window.scrollTo(0, 0);

    }, [])

    function getLeftForType() {
        if (type === 0) {
            return "5px"
        }

        if (type === 1) {
            return "100px"
        }

        if (type === 2) {
            return "250px"
        }
    }


    // function getType() {
    //     if (type === 0) {
    //         return (
    //             <div className="explore-card-container">
    //                 {streams != null && streams.map((stream) => <VideoCard tags={stream.stream_tag} isMobile={isMobile} streamerImage={stream.streamer_avatar} streamer={stream.streamer} categorie={stream.stream_category} title={stream.stream_title} viewers={stream.viewers} image={stream.stream_thumbnail} />)}
    //             </div>
    //         )
    //     }

    //     if (type === 1) {
    //         return <ExploreCategories />
    //     }
    // }

    return (
        <div className="explore-body">
            <div className="explore-container">
                <div className="explore-title">
                    <h2>Explorar</h2>
                </div>

                <ExploreCategories isMobile={isMobile}/>


            </div>

        </div>
    )
}