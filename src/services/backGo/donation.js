const axios = require('axios');

const baseURL = process.env.REACT_APP_BACKGO;

export async function GetPixelesDonationsChat(Toid) {
    try {
        const response = await axios.get(`${baseURL}/pixel/GetPixelesDonationsChat?Toid=${Toid}`);
        return response.data;
    } catch (error) {
        return error
    }
}
export async function CreateDonation(token, ToUser, Pixeles, Text, totpCode) {

    try {
        const response = await axios.post(`${baseURL}/pixel/DonatePixel`, {
            ToUser, Pixeles, Text, totp_code: totpCode,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error
    }
}
