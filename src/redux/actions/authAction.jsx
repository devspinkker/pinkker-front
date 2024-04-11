import ACTIONS from './index'
import axios from 'axios'

const axiosInstance = axios.create({baseURL: process.env.REACT_APP_DEV_API_URL,});

export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}

export const fetchUser = async (token) => {
    try {
        const res = await axios.get(process.env.REACT_APP_DEV_API_URL + `/user/infor`, {
            headers: {Authorization: token}
        })
        return res
   } catch (err) {
       return err.response.data.msg;
   }
   
}

export const dispatchGetUser = (res) => {
    return {
        type: ACTIONS.GET_USER,
        payload: {
            user: res.data,
            isAdmin: res.data.role === 1 ? true : false
        }
    }
   
}