const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const mercadopago = process.env.REACT_APP_MERCADO_PAGO
const baseURL = process.env.REACT_APP_BACKGO

export async function signupNotConfirmed(userData) {
    try {
        const response = await axios.post(`${baseURL}/user/signupNotConfirmed`, userData);
        return response.data;
    } catch (error) {
        return error
    }
}
export async function PanelAdminPinkkerInfoUser(Code, IdUser, token, NameUser) {
    try {
        const response = await axios.post(
            `${baseURL}/user/PanelAdminPinkker/InfoUser`,
            {
                Code,
                IdUser,
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
        return error
    }
}
export async function PanelAdminPinkkerbanStreamer(Code, IdUser, token) {
    try {
        const response = await axios.post(
            `${baseURL}/user/PanelAdminPinkker/banStreamer`,
            {
                Code,
                IdUser,
                NameUser: ""
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
export async function PanelAdminPinkkerCreateAdmin(Code, IdUser, Level, NewCode, token) {
    try {
        const response = await axios.post(
            `${baseURL}/user/PanelAdminPinkker/CreateAdmin`,
            {
                Code,
                IdUser,
                NameUser: "",
                Level,
                NewCode
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

export async function PanelAdminPinkkerChangeNameUser(Code, NameUserRemove, NameUserNew, token) {
    try {
        const response = await axios.post(
            `${baseURL}/user/PanelAdminPinkker/ChangeNameUserCodeAdmin`,
            {
                Code,
                NameUserRemove,
                NameUserNew,
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
export async function ChangeNameUser(NameUserNew, token, totp_code) {
    try {
        const response = await axios.post(
            `${baseURL}/user/ChangeNameUser`,
            {
                NameUserNew,
                totp_code
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
export async function PanelAdminPinkkerRemoveBanStreamer(Code, IdUser, token) {
    try {
        const response = await axios.post(
            `${baseURL}/user/PanelAdminPinkker/RemoveBanStreamer`,
            {
                Code,
                IdUser,
                NameUser: ""
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
export async function PanelAdminPinkkerPartnerUser(Code, IdUser, token) {
    try {
        const response = await axios.post(
            `${baseURL}/user/PanelAdminPinkker/PanelAdminPinkkerPartnerUser`,
            {
                Code,
                IdUser,
                NameUser: ""
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
export async function SaveUserCodeConfirm(code) {
    try {
        const response = await axios.post(`${baseURL}/user/SaveUserCodeConfirm`, { code });
        return response.data;
    } catch (error) {
        return error
    }
}
export async function AccountRecovery(code, password) {
    try {
        const response = await axios.post(`${baseURL}/user/account-recovery`, {
            code: code,
            password: password
        });
        return response.data;
    } catch (error) {
        return error
    }
}
export async function login(userData) {
    try {
        const response = await axios.post(`${baseURL}/user/login`, userData);
        return response.data;
    } catch (error) {

        return error.response
    }
}
export async function LoginTOTPSecret(userData) {
    try {
        const response = await axios.post(`${baseURL}/user/LoginTOTPSecret`, userData);
        return response.data;
    } catch (error) {
        return error.response
    }
}
export const GetRecommendedUsers = async (token, ExcludeIDs) => {
    try {
        console.log({ ExcludeIDs });
        const res = await axios.post(
            `${baseURL}/user/GetRecommendedUsers`,
            { ExcludeIDs },

            {
                headers: { Authorization: token },
            }
        );
        return res.data;
    } catch (error) {
        return error
    }
};
export async function Get_Recover_lost_password(mail) {
    try {
        const response = await axios.post(`${baseURL}/user/Get_Recover_lost_password`, { mail });
        return response.data;
    } catch (error) {

        return error
    }
}
export async function follow(token, userId) {
    try {
        const response = await axios.post(
            `${baseURL}/user/follow`,
            { IdUser: userId },
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

export async function getUserByIdTheToken(token) {
    try {
        const response = await axios.get(`${baseURL}/user/getUserById`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return {
            error
        }
    }
}
export async function getUserByNameUser(nameUser) {
    try {
        const response = await axios.get(`${baseURL}/user/getUserByNameUser?nameUser=${nameUser}`);
        return response.data;
    } catch (error) {
        return error
    }
}
export async function GetStreamAndUserDataToken(nameUser, token) {
    try {
        const response = await axios.get(`${baseURL}/user/GetStreamAndUserData?nameUser=${nameUser}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error
    }
}
export async function GetNotificacionesLastConnection(token) {
    try {
        const response = await axios.get(`${baseURL}/user/GetNotificacionesLastConnection`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });


        return response.data;
    } catch (error) {
        return error
    }
}
export async function unfollow(token, userId) {
    try {
        const response = await axios.post(
            `${baseURL}/user/Unfollow`,
            { IdUser: userId },
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

export async function editProfile(token, profileData) {
    try {
        const response = await axios.post(
            `${baseURL}/user/EditProfile`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        return {
            error: "error"
        }
    }
}
export async function EditSocialNetworks(token, profileData) {
    try {
        const response = await axios.post(
            `${baseURL}/user/EditSocialNetworks`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        return {
            error: "error"
        }
    }
}
export async function editAvatar(token, avatarData) {
    try {
        const response = await axios.post(
            `${baseURL}/user/EditAvatar`,
            avatarData,
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

export async function editBanner(token, avatarData) {
    try {
        const response = await axios.post(
            `${baseURL}/user/EditBanner`,
            avatarData,
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



export async function compradePixeles(token, amount) {
    try {
        const response = await axios.post(
            `${mercadopago}/create-order`,
            {
                amount: amount
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
export async function compradePixelesBiancePay(id, amount) {
    try {
        const response = await axios.post(
            `${mercadopago}/createChargeBinancePay`,
            {
                idUser: id,
                amount: amount
            },
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export const SearchUser = async (search) => {
    const res = await axios.get(`${baseURL}/user/getUserByNameUserIndex?nameUser=${search}`)
    return res
}