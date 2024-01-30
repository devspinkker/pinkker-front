const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};
const baseURL = "http://localhost:8081";


export async function actionsModeratorChatStream(action, actionAgainst, timeOut, room, token) {
    try {
        console.log(action, actionAgainst, timeOut, room, token,);
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
        console.error('Error en actionsModeratorChatStream:', error.message);
        return error
    }
}
export async function actionsChatStream(action, actionAgainst, timeOut, token) {
    try {
        const response = await axios.post(
            `${baseURL}/actionsChatStream`,
            {
                action,
                actionAgainst,
                timeOut,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en actionsModeratorChatStream:', error.message);
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
//         console.error('Error en actionsChatStream:', error.message);
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
        console.error('Error en actionsChatStream:', error.message);
    }
}
async function updataCommands(commands) {
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
        console.error('Error en updataCommands:', error.message);
    }
}


