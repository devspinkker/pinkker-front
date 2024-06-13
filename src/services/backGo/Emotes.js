const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO;

export const CreateOrUpdateEmote = async (formData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };
        const res = await axios.post(`${baseURL}/Emotes/CreateOrUpdateEmote`, formData, config);
        return res.data;
    } catch (error) {
        return error;
    }
};
export const GetEmoteUserandType = async (IdUser, typeEmote, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${baseURL}/Emotes/GetEmoteUserandType`, {
            IdUser,
            typeEmote
        }, config);
        return res.data;
    } catch (error) {
        return error;
    }
};