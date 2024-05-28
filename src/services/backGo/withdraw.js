const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO


export async function withdrawalRequest(token, amount, cbu) {
    try {
        const response = await axios.post(
            `${baseURL}/Withdraw/WithdrawalRequest`,
            {
                amount,
                cbu
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error
    }
}
