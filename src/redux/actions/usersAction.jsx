import ACTIONS from './index'
import axios from 'axios'

const axiosInstance = axios.create({baseURL: process.env.REACT_APP_API_URL,});

export const fetchAllUsers = async (token) => {
    const res = await axios.get(process.env.REACT_APP_DEV_API_URL + `/user/all_infor`, {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetAllUsers = (res) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload: res.data
    }
}