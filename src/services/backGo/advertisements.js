const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO

export async function GetAdvertisements(token, Code, page = 1) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/GetAdvertisements?page=${page}`,
            {
                Code
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function UpdateAdvertisement(token, advertisement) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/UpdateAdvertisement`,
            advertisement,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function CreateAdvertisement(token, advertisement) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/CreateAdvertisement`,
            advertisement,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function GetAdsUser(token) {
    try {
        const response = await axios.get(
            `${baseURL}/advertisements/GetAdsUser`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function GetAdsUserCode(token, Code, NameUser) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/GetAdsUserCode`,
            {
                Code,
                NameUser
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function DeleteAdvertisement(token, ID, Code) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/DeleteAdvertisement`,
            {
                ID,
                Code
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}