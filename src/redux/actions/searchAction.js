import ACTIONS from './index'
import axios from 'axios'

const url = process.env.REACT_APP_BACKGO

export const fetchSearch = async (search) => {
    const res = await axios.get(`${url}/user/getUserByNameUserIndex?nameUser=${search}`)
    return res
}

export const fetchSearchPage = async (search) => {
    const res = await axios.get(`${url}/user/getUserByNameUserIndex?nameUser=${search}`, {

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
