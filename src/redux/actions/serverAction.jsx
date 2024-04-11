import ACTIONS from './index'
import axios from 'axios'

const axiosInstance = axios.create({baseURL: process.env.REACT_APP_DEV_API_URL});


export const fetchServerInfo = async (token) => {
    const res = await axiosInstance.get(`/server/get_server`, {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetServerInfo = (res) => {
    return {
        type: ACTIONS.GET_SERVER_INFO,
        payload: res.data
    }
}
