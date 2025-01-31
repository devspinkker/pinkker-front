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
export async function PurchasePinkkerPrime(token) {
    try {
        const response = await axios.get(
            `${baseURL}/user/PurchasePinkkerPrime`,

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
export async function SaveUserCodeConfirm(code, referral) {
    try {
        const response = await axios.post(`${baseURL}/user/SaveUserCodeConfirm`, { code, referral });
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
        const res = response.data.data

        const followInfo = res.FollowInfo?.map((follow) => ({
            Avatar: follow.Avatar || 'defaultAvatarUrl',
            Nameuser: follow.NameUser || 'Nameuser',
            Type: 'follow',
            visto: false,
            since: follow.since
        })) || [];

        const resDonation = res.ResDonation?.map((donation) => ({
            Avatar: donation.FromUserInfo?.Avatar || 'defaultAvatarUrl',
            Nameuser: donation.FromUserInfo?.NameUser || 'Unknown',
            Pixeles: donation.Pixeles,
            Text: donation.Text || '',
            Type: 'DonatePixels',
            visto: false,
        })) || [];


        const ressubs = res.Subscription?.map((s) => ({
            Avatar: s.FromUserInfo?.Avatar || 'defaultAvatarUrl',
            Nameuser: s.FromUserInfo?.NameUser || 'Unknown',
            Type: "Suscribirse",
            visto: false,
        })) || [];

        const notifications = [...followInfo, ...resDonation, ...ressubs];

        return { notifications, message: response.data.message };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], message: 'Error' };
    }
}
export async function GetRecentotificaciones(token, page = 1) {
    try {
        const response = await axios.get(`${baseURL}/user/GetRecentotificaciones?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = response.data.data
        const followInfo = res.FollowInfo?.map((follow) => ({
            Avatar: follow.Avatar || 'defaultAvatarUrl',
            Nameuser: follow.NameUser || 'Nameuser',
            Type: 'follow',
            visto: true,
            since: follow.since,
            idUser: follow.idUser
        })) || [];

        const resDonation = res.ResDonation?.map((donation) => ({
            Avatar: donation.FromUserInfo?.Avatar || 'defaultAvatarUrl',
            Nameuser: donation.FromUserInfo?.NameUser || 'Unknown',
            Pixeles: donation.Pixeles,
            Text: donation.Text || '',
            Type: 'DonatePixels',
            visto: true,
            since: donation.since,
            idUser: donation.idUser
        })) || [];

        const ressubs = res.Subscription?.map((s) => ({
            Avatar: s.FromUserInfo?.Avatar || 'defaultAvatarUrl',
            Nameuser: s.FromUserInfo?.NameUser || 'Unknown',
            Type: "Suscribirse",
            visto: true,
            since: s.since,
            idUser: s.idUser
        })) || [];

        const notifications = [...followInfo, ...resDonation, ...ressubs];

        return { notifications, message: response.data.message };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], message: 'Error' };
    }
}


export async function GetNotificacionesRecent(token, page = 1) {
    try {
        const response = await axios.get(`${baseURL}/notifications/recent?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = response.data
        return res

        //     const followInfo = res.FollowInfo?.map((follow) => ({
        //         Avatar: follow.Avatar || 'defaultAvatarUrl',
        //         Nameuser: follow.NameUser || 'Nameuser',
        //         Type: 'follow',
        //         visto: false,
        //         since: follow.since
        //     })) || [];

        //     const resDonation = res.ResDonation?.map((donation) => ({
        //         Avatar: donation.FromUserInfo?.Avatar || 'defaultAvatarUrl',
        //         Nameuser: donation.FromUserInfo?.NameUser || 'Unknown',
        //         Pixeles: donation.Pixeles,
        //         Text: donation.Text || '',
        //         Type: 'DonatePixels',
        //         visto: false,
        //     })) || [];

        //     console.log(res);
        //     const ressubs = res.Subscription?.map((s) => ({
        //         Avatar: s.FromUserInfo?.Avatar || 'defaultAvatarUrl',
        //         Nameuser: s.FromUserInfo?.NameUser || 'Unknown',
        //         Type: "Suscribirse",
        //         visto: false,
        //     })) || [];

        //     const notifications = [...followInfo, ...resDonation, ...ressubs];

        //     return { notifications, message: response.data.message };

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], message: 'Error' };
    }
}
export async function GetOldNotifications(token, page = 1) {
    try {
        const response = await axios.get(`${baseURL}/notifications/GetOldNotifications?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const res = response.data
        console.log(res);
        console.log("OLAA");
        const notificationsWithVisto = res.notifications?.map(notification => ({
            ...notification,
            visto: true,
        }));

        return notificationsWithVisto
        // const followInfo = res.FollowInfo?.map((follow) => ({
        //     Avatar: follow.Avatar || 'defaultAvatarUrl',
        //     Nameuser: follow.NameUser || 'Nameuser',
        //     Type: 'follow',
        //     visto: true,
        //     since: follow.since
        // })) || [];

        // const resDonation = res.ResDonation?.map((donation) => ({
        //     Avatar: donation.FromUserInfo?.Avatar || 'defaultAvatarUrl',
        //     Nameuser: donation.FromUserInfo?.NameUser || 'Unknown',
        //     Pixeles: donation.Pixeles,
        //     Text: donation.Text || '',
        //     Type: 'DonatePixels',
        //     visto: true,
        //     since: donation.since
        // })) || [];

        // const ressubs = res.Subscription?.map((s) => ({
        //     Avatar: s.FromUserInfo?.Avatar || 'defaultAvatarUrl',
        //     Nameuser: s.FromUserInfo?.NameUser || 'Unknown',
        //     Type: "Suscribirse",
        //     visto: true,
        //     since: s.since
        // })) || [];

        // const notifications = [...followInfo, ...resDonation, ...ressubs];

        // return { notifications, message: response.data.message };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], message: 'Error' };
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