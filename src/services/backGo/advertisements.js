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

export async function BuyadCreate(token, advertisement) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/BuyadCreate`,
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
export async function BuyadMuroCommunity(token, advertisement) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/BuyadMuroCommunity`,
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


export async function CreateAdsClips(token, FormData) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/CreateAdsClips`,
            FormData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function GetAdsUserPendingCode(token, Code, NameUser, page = 1) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/GetAdsUserPendingCode?page=${page}`,
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

export async function GetAllPendingNameUserAds(token, page = 1) {
    try {
        const response = await axios.post(
            `${baseURL}/user/GetAllPendingNameUserAds?page=${page}`,
            {},
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

export async function AcceptOrDeleteAdvertisement({ action, AdId, token }) {
    try {
        const response = await axios.post(
            `${baseURL}/user/AcceptOrDeleteAdvertisement`,
            { action, AdId },
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

export async function AcceptPendingAds(token, code, nameUser) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/AcceptPendingAds`,
            { Code: code, NameUser: nameUser },
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

export async function GetAllPendingAds(token, code, page = 1) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/GetAllPendingAds?page=${page}`,
            { Code: code, },
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
export async function RemovePendingAds(token, code, nameUser) {
    try {
        const response = await axios.post(
            `${baseURL}/advertisements/RemovePendingAds`,
            { Code: code, NameUser: nameUser },
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



export async function GetAllAcceptedNameUserAds(token, page = 1) {
    try {
        const response = await axios.post(
            `${baseURL}/user/GetAllAcceptedNameUserAds?page=${page}`,
            {},
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
export async function GetActiveAdsByEndAdCommunity(token, page = 1) {
    try {
        const response = await axios.post(
            `${baseURL}/user/GetActiveAdsByEndAdCommunity?page=${page}`,
            {},
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
export async function GetAdsByNameUser(token, page = 1, name = "muro") {
    try {
        const response = await axios.post(
            `${baseURL}/user/GetAdsByNameUser?page=${page}&name=${name}`,
            {},
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
