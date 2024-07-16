import React, { useState, useEffect } from "react";

import "./Vods.css";

import VodCard from "../../card/VodCard";
import Skeleton from "@mui/material/Skeleton";

import SliderLayout from "../../layout/SliderLayout";
import { GetTopVodsLast48Hours } from "../../../services/backGo/streams";

function CardSkeleto() {
  return (
    <div style={{ margin: "2px", marginRight: "20px" }}>
      <Skeleton
        variant="rectangular"
        width={"300px"}
        height={"168px"}
        style={{ backgroundColor: "rgb(32, 32, 31)" }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="circular"
          style={{ backgroundColor: "rgb(32, 32, 31)" }}
          width={40}
          height={40}
        />
        <div style={{ marginLeft: "10px" }}>
          <Skeleton
            variant="text"
            width={100}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
          <Skeleton
            variant="text"
            width={50}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
          <Skeleton
            variant="text"
            width={50}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Vods(props) {
  const [Vods, setVods] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetTopVodsLast48Hours();
      if (response != null && response.data) {
        setVods(response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-clips">
      {/* <h3 style={{ color: "#ededed" }}> <a className="text-remarcado" style={{ color: "#f36196" }}>Vods</a> más vistos hoy</h3> */}

      <div className="home-clips-card-container">
        {/* {clips != null && clips.map((video) => isLoading ? <CardSkeleto/> :
                    <Link style={{textDecoration: "none"}} to={"/clip/" + video._id}>
                        <VodCard 
                            width={"300px"}
                            views={video.views} 
                            createdAt={video.createdAt} 
                            duration={video.duration} 
                            image={"https://res.cloudinary.com/pinkker/image/upload/v1669407676/min/jpikyrdltculevcxkstj.png"} 
                            title={video.clipName} 
                            categorie={video.stream.stream_category} 
                            tags={video.stream.stream_tag}
                        />  
                    </Link>
                )} */}

        <SliderLayout
          Vod={true}
          clipT={false}
          Categoria={false}
          Vods={Vods}
          isMobile={props.isMobile}
        />
      </div>
    </div>
  );
}
