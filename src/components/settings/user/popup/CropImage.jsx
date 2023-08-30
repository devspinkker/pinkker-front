import React, { useState, useCallback } from "react";


import Cropper from 'react-easy-crop'
import axios from "axios";
import {useSelector} from 'react-redux'
import { getCroppedImg } from './canvasUtils'

import { useNotification } from "../../../Notifications/NotificationProvider";

export default function CropImage({closePopup, image}) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const [cropper, setCropper] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const alert = useNotification();

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, [])


    const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const fileCropped = await getCroppedImg(
              image,
              croppedAreaPixels,
              rotation
            )

            const file = new File([fileCropped], "avatar.png", {lastModified: 1534584790000, type: "image/png"});
            let formData =  new FormData()
            formData.append('file', file)

            const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/api/upload_avatar`, formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            if(res.data != null) {
                alert({type: "SUCCESS", message: res.data.msg})
                closePopup();
            } else {
                alert({type: "ERROR", message: res})
            }
        } catch (err) {
            
        }
    }

    function blobToFile(theBlob, fileName){
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    return (
        <div style={{textAlign: "left", width: "25%"}} className={'usersettings-popup-container'}>
                <div className="usersettings-popup-close">
                    <button onClick={closePopup}><i className="fas fa-times" /></button>
                </div>

                <div className={"usersettings-crop-container"}>
                    <Cropper
                        image={image}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>


                <div className="usersettings-crop-input-container">
                    <i style={{color: "darkgray", marginRight: "10px"}} class="fas fa-search-minus"></i>
                    <input value={zoom} type="range" min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} />
                    <i style={{color: "darkgray", marginLeft: "10px"}} class="fas fa-search-plus"></i>
                </div>

                <div className="usersettings-crop-input-container">
                    <i style={{color: "darkgray", marginRight: "10px"}} class="fas fa-undo"></i>
                    <input value={rotation} type="range" min={0} max={360} step={1} onChange={(e) => setRotation(e.target.value)} />
                </div>

                <div style={{textAlign: "right", marginTop: "10px"}}>
                    <button onClick={closePopup} className="usersettings-popup-cancel">Cancelar</button>
                    <button onClick={changeAvatar} className="usersettings-popup-save">Guardar</button>
                </div>
            </div>
    )
}