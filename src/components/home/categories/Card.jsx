import React, {useState, useEffect} from "react"

import { Link } from "react-router-dom"
import Skeleton from '@mui/material/Skeleton';

export default function Card(props) {

    const tags = [];

    //Pre render image from props
    const [image, setImage] = useState(false)

    useEffect(() => {
        const img = new Image();
        img.src = props.image; 
        img.onload = () => {
          
          setImage(true);
        }

    }, [props.image])

    getTagsWithLimit(props.tags, 2);

    async function getTagsWithLimit (tag, limit) {
        for(let i = 0; i < tag.length; i++) {
            if(i < limit) {
                tags.push(tag[i])
            }
        }
    }

   

    function getCard() {

        if(image) {
            return (
                <div style={{position: props.isLoading && "absolute", opacity: props.isLoading && "0", width: props.width ? props.width : "140px", margin: '3px' }} className="home-categories-card">
                    <div className="home-categories-card-contain">
                        <Link to={"/categorie/" + props.name}><img style={{width:'100%'}} src={props.image} loading={"lazy"} alt="" /></Link>
                    </div>
{/*                     
                    <div className="home-categories-p-1">
                        <Link className="home-categories-link-hover" style={{textDecoration: "none"}} to={"/categorie/" + props.name}><p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: "300", letterSpacing: "0.6px", marginTop: "3px", cursor: "pointer"}}>{props.name}</p></Link>
                    </div>
                    <div className="home-categories-p-2">
                        <p style={{fontSize: "12px", cursor: "pointer"}}>{props.spectators} espectadores</p>
                    </div> */}
                    {/*<div className="categories-card-tag-container">
                        {tags.map((tag) => <a className="categorie-card-tag">{tag}</a>)}
            </div>*/}
                </div>
            )
        } 
        
       
       
        
    }

    return (
        <>{getCard()}</>
    )
}