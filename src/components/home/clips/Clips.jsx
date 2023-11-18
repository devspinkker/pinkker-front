import React, {useState, useEffect} from "react"

import "./Clips.css"

import ClipCard from "../../card/ClipCard"
import Skeleton from '@mui/material/Skeleton';

import { getClips } from "../../../services/vods";

import { Link } from "react-router-dom"

function CardSkeleto() {
    return <div style={{marginRight: "13px", marginTop: "10px"}}>
        <Skeleton variant="rectangular" width={"300px"} height={"169px"} style={{backgroundColor: "rgb(32, 32, 31)"}} />
       
    </div>
}

export default function Clips() {


    const [clips, setClips] = useState(null);

    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => {setIsLoading(false)}, 1500)

    useEffect(() => {
        const fetchData = async () => {
            const response = await getClips(7)
            if(response != null && response != undefined) {
                setClips(response)

            }
        }
        fetchData()
    }, [])

    return (
        <div className="home-clips">

            <h3 style={{color: "#ededed"}}> <a  className="text-remarcado" style={{color: "#f36196"}}>Clips</a> más vistos hoy</h3>

            <div className="home-clips-card-container">
                {clips != null && clips.map((video) => isLoading ? <CardSkeleto/> :
                    <Link style={{textDecoration: "none"}} to={"/clip/" + video._id}>
                        <ClipCard 
                            width="300px" 
                            video={video}
                            url={video.url}
                            likes={video.totalLikes}
                            comments={video.totalComments}
                            views={video.views} 
                            createdAt={video.createdAt} 
                            duration={video.duration} 
                            image={video.cover} 
                            title={video.clipName} 
                            categorie={video.stream.stream_category} 
                            tags={video.stream.stream_tag}
                            avatar={video.avatar}
                        />  
                    </Link>
                )}
            </div>

         
        </div>
    )
}