import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/withdraw';

export const getMyWithdraw = async (token) => {
    try {
        let response = await axios.get(`${url}/get_withdraw`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        return error.response;
        console.log('Error while calling getMyWithdraw', error);
    }
}


export const createWithdraw = async (token, name, methodPay, amount, cbu, email) => {
    try {
        const res = await axios.post(`${url}/createWithdraw`, {
            name, methodPay, amount, cbu, email
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        return error.response;
        console.log('Error while calling createWithdraw', error);
    }
}

