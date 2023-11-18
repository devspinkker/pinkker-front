import React, {useState, useEffect} from 'react';

import "./EmblemDropdown.css";

import { useSelector } from 'react-redux';

import { getEmblemFromName } from '../../services/emblem';

import { ScaleLoader } from "react-spinners"


export default function EmblemDropdown({ name, img, close, chat }) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [emblem, setEmblem] = useState(null)


    useEffect(() => {
        const fetchData = async () => {
            const data = await getEmblemFromName(name);
            if(data != null && data != undefined) {
                setEmblem(data)
            }
        }
        fetchData()
    }, [])

   

    return (
        <div style={{top: chat ? "0px" : "-250px"}} className='embleminfo-body'>
            {emblem != null ? <div className='embleminfo-container'>
                <div className='embleminfo-close'>
                    <i onClick={() => close()} style={{cursor: "pointer", color: "#ededed", fontSize: "16px"}} class="fas fa-times"/>
                </div>
                
                <div style={{textAlign: "center"}}>
                    <img style={{width: "75px"}} src={emblem.image} alt="" />
                </div>

                <div style={{color: "#ededed", textAlign: "center"}}>
                    <h3 style={{fontFamily: "Poppins", fontSize: "15px"}}>Emblema de {name}</h3>

                    <p style={{marginTop: "20px", fontSize: "13px"}}>{emblem.description}</p>
                </div>
                
            </div> : 
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "190px"}}>
                <ScaleLoader width={4} height={20} color="#f36197d7" />
            </div>
            }
        </div>
    )

}