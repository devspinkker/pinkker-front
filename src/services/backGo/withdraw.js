const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO


export async function withdrawalRequest(token, amount, cbu, totpCode) {
    try {
        const response = await axios.post(
            `${baseURL}/Withdraw/WithdrawalRequest`,
            {
                amount,
                cbu,
                totp_code: totpCode,
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

export async function AcceptWithdrawal(Code, WithdrawalRequestsId, token) {
    try {
        const response = await axios.post(
            `${baseURL}/Withdraw/AcceptWithdrawal`,
            {
                Code,
                WithdrawalRequestsId
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
export async function RejectWithdrawal(Code, WithdrawalRequestsId, TextReturn, token) {
    try {
        const response = await axios.post(
            `${baseURL}/Withdraw/RejectWithdrawal`,
            {
                Code,
                WithdrawalRequestsId,
                TextReturn
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
} export async function GetWithdrawalToken(token) {
    try {
        const response = await axios.get(
            `${baseURL}/Withdraw/GetWithdrawalToken`,
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
} export async function AllMyPixelesDonors(token) {
    try {
        const response = await axios.get(
            `${baseURL}/pixel/AllMyPixelesDonors`,
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