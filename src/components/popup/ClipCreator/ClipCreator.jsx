import React, {useState} from "react"

import "./ClipCreator.css"

import ReactHlsPlayer from '../../../player/PlayerMain';
import MultiRangeSlider from "../PopupClipCreator/slider/MultiRangeSlider";


export default function ClipCreator({closePopup, src, width, height}) {

    const videoRef = React.useRef();

    const [cutStartTime, setCutStartTime] = useState(0);
    const [cutEndTime, setCutEndTime] = useState(57);

    return (
        <div className="clipcreator-body">
            <div className="clipcreator-container">


                <div className="clipcreator-close">
                    <button className="button-more" onClick={closePopup}><i class="fas fa-times"/></button>
                </div>

                <div className="clipcreator-video">
                    <ReactHlsPlayer 
                        id="pinkker-player" 
                        playerRef={videoRef} 
                        src={src}  
                        autoPlay={true} 
                        controls={true}
                        muted
                        width={"100%"}
                        height={"400px"}
                    />
                </div>

                <div style={{width: "90%", textAlign: "center", margin: "20px auto"}}>  
                    <MultiRangeSlider min={0} max={60} onChange={({ min, max }) => {
                        setCutStartTime(min);
                        setCutEndTime(max);
                    }}/> 
                </div> 

                <div>
                    <button onClick={() => console.log(videoRef)}>Test</button>
                </div>
                

            </div>
        </div>
    )
}