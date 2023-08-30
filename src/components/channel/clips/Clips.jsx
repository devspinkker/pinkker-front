import React, {useState, useEffect} from 'react';

import "./Clips.css"

import { getStreamerClips } from "../../../services/vods";
import ClipCard from '../../card/ClipCard';
import Skeleton from '@mui/material/Skeleton';

import { Link } from 'react-router-dom';

export default function Clips(props) {

    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => {setIsLoading(false)}, 1500)

    const [videos, setVideos] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStreamerClips(props.streamer, props.limit, props.sort);
            if(data != null && data != undefined) {
                setVideos(data);
            }
        }
        fetchData();
    }, [props.streamer])

    function CardSkeleto() {
        return <div style={{margin: "2px", marginTop: "15px"}}>
            <Skeleton variant="rectangular" width={"250px"} height={"140px"} style={{backgroundColor: "rgb(32, 32, 31)"}} />
            <div style={{display: "flex", alignItems: "center"}}>
                <div>
                    <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    <Skeleton variant="text" width={50} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                </div>
            </div>
        </div>
    }


    return (
        <div className='channel-clips-body'>
            <div className="channel-clips-container">
                {videos != null && videos != undefined && videos.length > 0 && videos.map((video) => isLoading ? <CardSkeleto/> :
                    <Link style={{textDecoration: "none"}} to={"/clip/" + video._id}>
                        <ClipCard 
                            width="212px" 
                            height="330px"
                            views={video.views} 
                            createdAt={video.createdAt} 
                            duration={video.duration} 
                            image={"https://res.cloudinary.com/pinkker/image/upload/v1669610308/NE_105_de_191_kyoiqp.jpg"} 
                            title={video.clipName} 
                            categorie={video.stream.stream_category} 
                            tags={video.stream.stream_tag}
                        />
                    </Link>
                )}
            </div>
        </div>
    )
}