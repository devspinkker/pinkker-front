import React, {useState, useEffect} from "react"

import "./AddEmotePopup.css"

import { useSelector } from 'react-redux'

import axios from "axios"

import { useNotification } from "../../../Notifications/NotificationProvider"
import { ScaleLoader } from "react-spinners"


export default function AddEmotePopup({ closePopup, emoteType, handleReload }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const [imageSrc, setImageSrc] = useState(null)
    const [emoteName, setEmoteName] = useState(null)

    const [loading, setLoading] = useState(false)

    const alert = useNotification()

    function readFile(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        })
    }

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          let imageDataUrl = await readFile(file)

          setImageSrc(imageDataUrl)
          console.log(imageDataUrl)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(true)
            const file = new File([imageSrc], emoteName + ".png", {lastModified: 1534584790000, type: "image/png"});
            let formData =  new FormData()
            formData.append('file', file)

            const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/emotes/add_emote_streamer?emoteName=${emoteName}&emoteType=${emoteType}`, formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            if(res.data != null) {
                alert({type: "SUCCESS", message: res.data.msg})
                setLoading(false)
                handleReload()
                closePopup();
            } else {
                alert({type: "ERROR", message: res})
            }
        } catch (err) {
            
        }
    }

    return (
        <div className='addemote-popup-body'>
            
            <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                
                <div className={'addemote-popup-container'}>

                    <div className="usersettings-popup-close">
                        <button onClick={closePopup}><i style={{fontSize: "24px"}} className="fas fa-times" /></button>
                    </div>
                        
                    <div className="addmote-popup-content">
                        <h3>Agregar un emote a tu canal</h3>

                        {imageSrc === null ? <div style={{width: "150px", height: "150px", margin: "0 auto", marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}} className='dashboard-content-emotes-empty'>
                            <i style={{fontSize: "35px"}} class="fas fa-plus" />
                            <input onChange={onFileChange} className="addmote-popup-file" type="file" />
                        </div> : <img style={{width: "150px", height: "150px", margin: "0 auto", marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center"}} src={imageSrc}/>}

                        <p style={{color: "darkgray", marginTop: "20px", fontSize: "14px"}}>Sube una imagen PNG o GIF cuadrada. La imagen no puede ser mayor a 1 MB.</p>

                        <div style={{marginTop: "20px"}}>
                            <h3>Nombre del emoticono</h3>
                            <div className="addemote-popup-input">
                                <p>{user.name}_</p>
                                <input style={{width: "250px"}} onChange={(e) => setEmoteName(e.target.value)} type="text"/>
                            </div>
                        </div>
                        
                        <div style={{display: "flex", justifyContent: "right"}}>
                            {loading ? <button style={{display: "flex", alignItems: "center", backgroundColor: "#303030", width: "160px"}} className="addemote-popup-button"><ScaleLoader width={4} height={20} style={{marginRight: "10px"}} color="#f36197d7" /> Publicando..</button> : <button onClick={() => handleSubmit()} className="addemote-popup-button">Publicar</button>}
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )

}