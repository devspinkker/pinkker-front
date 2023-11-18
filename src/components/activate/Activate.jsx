import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import "./Activate.css"

import { useNotification } from '../../components/Notifications/NotificationProvider'

function Activate() {

    const {activation_token} = useParams()
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')
    const axiosInstance = axios.create({baseURL: process.env.REACT_APP_DEV_API_URL,});

    const alert = useNotification()

    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try {
                    const res = await axiosInstance.post(`/user/activation`, { activation_token })
                    setSuccess(res.data.msg)
                } catch (err) {
                    err.response.data.msg && alert({type: "ERROR", message: err.response.data.msg})
                }
            }
            activationEmail()
        }
    },[activation_token])

    return (
        <div className="active_page">
            <div style={{position: "relative", top: "100px"}}>
                {err && alert({type: "ERROR", message: err})}
                {success && alert({type: "SUCCESS", message: success})}
                <Redirect to="/?register=true" />

            </div>
           
        </div>
    )
}

export default Activate
