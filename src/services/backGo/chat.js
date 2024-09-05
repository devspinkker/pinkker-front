const axios = require('axios');

const baseURL = process.env.REACT_APP_BACKCHAT;

export async function actionsModeratorChatStream(action, actionAgainst, timeOut, room, token) {
    try {
        const response = await axios.post(
            `${baseURL}/actionsModeratorChatStream`,
            {
                action: action,
                actionAgainst: actionAgainst,
                timeOut: timeOut,
                room: room,
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
export async function RedisFindMatchingUsersInRoomByPrefix(NameUser, Room, token) {
    try {
        const response = await axios.post(
            `${baseURL}/RedisFindMatchingUsersInRoomByPrefix`,
            {
                NameUser,
                Room,
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



export async function ActionIdentidadUser(room, Color, Identidad, token) {
    try {
        const response = await axios.post(
            `${baseURL}/ActionIdentidadUser`,
            {
                room, Color, Identidad,
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
export async function deleteChatMessage(roomID, messageID, token) {
    try {
        const response = await axios.delete(
            `${baseURL}/chatStreaming/${roomID}/messages/delete/${messageID}`,
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
export async function anclarChatMessage(roomID, data, token) {
    data.EmotesChat = JSON.stringify(data.EmotesChat);
    data.SubscriptionInfo = JSON.stringify(data.SubscriptionInfo);

    try {
        const response = await axios.post(
            `${baseURL}/chatStreaming/${roomID}/messages/anclar`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function HostChatMessage(roomID, data, token) {

    try {
        const response = await axios.post(
            `${baseURL}/chatStreaming/${roomID}/messages/Host`,
            { nameUser: data, },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function desanclarChatMessage(roomID, messageID, token) {
    try {
        const response = await axios.get(
            `${baseURL}/chatStreaming/${roomID}/messages/desanclar/${messageID}`,
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
export async function actionsChatStream(action, actionAgainst, timeOut, token, room) {
    try {
        const response = await axios.post(
            `${baseURL}/actionsChatStream`,
            {
                action,
                actionAgainst,
                timeOut,
                room
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
// async function actionsChatStream() {
//     try {
//         const response = await axios.get(`${baseURL}/getCommands`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//     }
// }
export async function GetInfoUserInRoomFunc(GetInfoUserInRoom, token) {
    try {
        const response = await axios.post(`${baseURL}/GetInfoUserInRoom`, {
            GetInfoUserInRoom
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
    }
}
export async function updataCommands(token, commands) {
    try {
        const response = await axios.post(
            `${baseURL}/updataCommands`,
            {
                CommandsUpdata: commands,
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


export async function getCommands(token) {
    try {
        const response = await axios.get(
            `${baseURL}/getCommands`, {
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
