import ACTIONS from './index'
import axios from 'axios'

const url = process.env.REACT_APP_DEV_API_URL + '/api';

export const fetchSearch = async (search) => {
    const res = await axios.get(`${url}/search?search=${search}`, {
       
    })
    return res
}

export const fetchSearchPage = async (search) => {
    const res = await axios.get(`${url}/searchPage?search=${search}`, {
        
    })
    return res
}

export const dispatchGetSearch = (res) => {
    return {
        type: ACTIONS.GET_SEARCH,
        payload: res.data
    }
}

export const dispatchGetSearchPage = (res) => {
    return {
        type: ACTIONS.GET_SEARCH_PAGE,
        payload: res.data
    }
}
