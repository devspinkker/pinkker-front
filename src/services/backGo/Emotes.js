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
export const DeleteEmote = async (name, typeEmote, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${baseURL}/Emotes/DeleteEmoteForType`, {
            typeEmote,
            name
        }, config);
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
export async function GetGlobalEmotes() {
    try {
        const response = await axios.get(
            `${baseURL}/Emotes/GetGlobalEmotes`,
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function AddEmoteAut(formData, token) {
    try {
        const response = await axios.post(
            `${baseURL}/Emotes/AddEmoteAut`,
            formData
            , {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function DeleteEmoteAut(formData, token) {
    try {
        const response = await axios.post(
            `${baseURL}/Emotes/DeleteEmoteAut`,
            formData
            , {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function GetPinkkerEmotes() {
    try {
        const response = await axios.get(
            `${baseURL}/Emotes/GetPinkkerEmotes`,
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
