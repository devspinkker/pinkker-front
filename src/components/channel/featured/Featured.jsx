import React, {useState, useEffect} from "react"

import "./Featured.css"

import { getStreamerVod } from "../../../services/vods";

export default function Featured(props) {

    const [video, setVideo] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStreamerVod(props.streamer, 1, -1);
            if(data != null && data != undefined) {
                setVideo(data[0]);
            }
        }
        fetchData();
    }, [props.streamer])


    return (
        <div className="featured-body">
            <div className="featured-video">
                <i style={{color: "#ededed", fontSize: "20px", position: "relative", top: "20px", left: "25px", transform: "rotate(315deg)", zIndex: "99999"}} class="fas fa-thumbtack"/>
                <video src={video && video.url} controls={true} autoPlay={true} muted={true}/>
            </div>
            <div className="featured-info">
                <h2 style={{color: "#f36196", margin: "10px auto"}}>{video && video.stream_title}</h2>
                
                <p style={{margin: "10px auto", color: "#AAAAAA"}}>asd123 • 50,000 vistas • hace 5 días</p>

                <h3 style={{color: "#AAAAAA", fontSize: "14px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, ad vitae unde quibusdam provident, beatae harum odio laborum ex saepe id eum ducimus est voluptatum nam, recusandae asperiores suscipit voluptas?</h3>
            </div>
        </div>
    )
}