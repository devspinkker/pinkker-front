const axios = require('axios');


const baseURL = process.env.REACT_APP_BACKGO


export async function suscribirse(token, ToUser) {
    try {
        const response = await axios.post(
            `${baseURL}/Subs/suscribirse`,
            { ToUser: ToUser },
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
export async function GetSubssChat(Toid) {
    try {
        const response = await axios.get(
            `${baseURL}/Subs/GetSubsChat?Toid=${Toid}`
            ,
        );
        return response.data;
    } catch (error) {
        return error
    }
}
export async function GetSubsAct(source, Desti) {
    try {
        const response = await axios.get(
            `${baseURL}/Subs/GetSubsAct?Source=${source}&Desti=${Desti}`
        );
        return response.data;
    } catch (error) {
        return error
    }
}