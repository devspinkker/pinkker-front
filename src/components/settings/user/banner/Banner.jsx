import React, {useState} from "react"

import "./Banner.css"
import { useSelector } from 'react-redux'

import useTheme from "../../../../theme/useTheme"

import axios from "axios"
import {useNotification} from "../../../Notifications/NotificationProvider"

import { ScaleLoader } from "react-spinners"

export default function Banner() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const theme = useTheme();
    const [file, setFile] = useState(null)

    const alert = useNotification();

    const [loading, setLoading] = useState(false)


    const changeBanner = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            let formData =  new FormData()
            formData.append('file', file)
            console.log(formData)

            setLoading(true)
            const res = await axios.post(process.env.REACT_APP_DEV_API_URL + `/api/upload_banner`, formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            if(res.data != null) {
                user.banner = res.data.url
                alert({type: "SUCCESS", message: res.data.msg})
                setLoading(false)
            } else {
                alert({type: "ERROR", message: res})
            }
            
        } catch (err) {
            
        }
    }

    return (
        <div className="userbanner-body">
            <h2 style={{marginBottom: "5px"}}>Banner de perfil</h2>

            <div className="userbanner-container">
                <div>
                    <img style={{width: "700px", marginTop: "10px"}}  src={user.banner} alt="" />
                    {loading === false && <input  onChange={(e) => changeBanner(e)} type="file" class="custom-file-input"/>}
                    {loading && <div style={{ minHeight: "70px", backgroundColor: "#151515", display: "flex", alignItems: "center", justifyContent: "center"}}><ScaleLoader width={4} height={20} color="#f36197d7" /></div>}
                    <p style={{fontSize: "14px", marginTop: "10px"}}>Formato de archivo: JPEG, PNG (Obligatorio 2120x355, máx. 2 MB)</p>

                </div>
            </div>

        </div>
    )
}