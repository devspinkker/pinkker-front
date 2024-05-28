const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO;

export const updateCategoria = async (formData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };
        const res = await axios.post(`${baseURL}/categorie/update`, formData, config);
        return res.data;
    } catch (error) {
        return error;
    }
};
export async function GetCodePanelPinkker(token, code) {
    try {
        const response = await axios.post(
            `${baseURL}/stream/commercialInStream`,
            { CommercialInStream: 1 },
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