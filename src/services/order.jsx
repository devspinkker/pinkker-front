import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/order';


export const createOrder = async (token, amount) => {
    try {

        const res = await axios.post(`${url}/createOrder`, {
            amount
        }, {
            headers: {Authorization: token}
        })

        return res
    } catch (err) {
        return err.response.data.msg;
    }
}


export const getOrderFromId = async (token, orderId) => {
    try {
        let response = await axios.get(`${url}/get_order?id=${orderId}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getOrderFromId', error);
    }
}
