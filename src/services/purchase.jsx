import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/purchase';


export const getAllPagos = async (token) => {
    try {
        let response = await axios.get(`${url}/all_pagos`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getMessages', error);
    }
}



export const createPaypalOrder = async (token, cantidad, streamer, type, message, orderId) => {
    try {
        const res = await axios.post(`${url}/create_paypal_order`, {
            cantidad, streamer, type, message, orderId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling createPaypalOrder', error);
    }
}


export const createMpOrder = async (token, amount, orderId) => {
    try {
        const res = await axios.post(`${url}/create_mp_order`, {
            amount, orderId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling createMpOrder', error);
    }
}


export const createPaypalOrderr = async (token, amount, orderId) => {
    try {
        const res = await axios.post(`${url}/create_paypal_order`, {
            amount, orderId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling createPaypalOrderr', error);
    }
}


export const purchasePinkkerPrime = async (token, months) => {
    try {
        const res = await axios.post(`${url}/purchase_pinkker_prime`, {
            months
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling createPaypalOrderr', error);
    }
}