import React, {useState, useEffect} from "react"

import "./AddPopupGallery.css"

import axios from "axios"
import {useSelector, useDispatch} from 'react-redux'
import { dispatchLogin } from '../../../../redux/actions/authAction'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { useNotification } from "../../../Notifications/NotificationProvider";

import { ScaleLoader } from "react-spinners"


export default function AddPopupGallery({ closePopup, reloadData }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const dispatch = useDispatch()

    const [showPopupCrop, setShowpopupCrop] = useState(false);
    const [imageSrc, setImageSrc] = React.useState(null)

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);

    const [file, setFile] = useState(null);

    const alert = useNotification();

    const [loading, setLoading] = useState(false)


    const ORIENTATION_TO_ANGLE = {
        '3': 180,
        '6': 90,
        '8': -90,
    }

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          let formData =  new FormData()
          formData.append('file', file)
          setFile(formData)
        }
    }

    async function handleSubmit() {


        setLoading(true);
        const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/gallery/upload_gallery?title=${title}&description=${description}`, file, {
            headers: {'content-type': 'multipart/form-data', Authorization: token}
        })
        if(res.data != null) {
            alert({type: "SUCCESS", message: res.data.msg})
            setLoading(false)
            reloadData();
            closePopup();

        } else {
            alert({type: "ERROR", message: res})
        }
    }

    return (
        <div style={{zIndex: "9999"}} className='usersettings-popup-body'>
            <div style={{textAlign: "left", width: "25%", borderRadius: "5px"}} className={'usersettings-popup-container'}>

                {loading === false ? <div>
                    <div className="usersettings-popup-close">
                        <button onClick={closePopup}><i className="fas fa-times" /></button>
                    </div>


                    <h2>Agregar imagen a tu galeria</h2>

                    <div style={{marginTop: "50px"}}>
                        <p style={{fontWeight: "800", marginTop: "20px"}}>Titulo de la imagen</p>
                        <input onChange={(e) => setTitle(e.target.value)} className="popupgallery-input" type="text" />
                    </div>

                    <div>
                        <p style={{fontWeight: "800", marginTop: "10px"}}>Descripción de la publicación</p>
                        <input onChange={(e) => setDescription(e.target.value)} className="popupgallery-input" type="text" />
                    </div>

                    

                    <div style={{cursor: "pointer"}} className="popupgallery-card">
                        <div>
                        <i style={{fontSize: "24px"}} class="fas fa-upload"></i>
                        <h4 style={{fontFamily: "Poppins", letterSpacing: "1px"}}>CARGAR FOTO</h4>
                        <input className="popupgallery-loadfile" type="file" onChange={onFileChange} accept="image/jpg, image/jpeg, image/png" />
                        </div> 
                    </div>

                    <div style={{display: "flex", justifyContent: "right", marginTop: "50px"}}>
                        <button onClick={() => handleSubmit()} className="popupgallery-button">CONFIRMAR</button>
                    </div>
                </div> : <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "400px"}}> <div style={{textAlign: "center"}}><h3 style={{marginBottom: "10px"}}>Subiendo la imagen... espera porfavor</h3><ScaleLoader color="#f36197d7" /></div> </div>}
                

            </div>

      </div>
    )

}