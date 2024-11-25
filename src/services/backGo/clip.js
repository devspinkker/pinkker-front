import axios from "axios"
const url = process.env.REACT_APP_BACKGO
var token = null;
export const setToken = (newObject) => {
    token = newObject;
};
export const GetClipsByUserIDAndFilter = async (UserID, filter = 'recent', dateRange = '', page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${url}/clips/GetClipsByNameUserIDOrdenacion`, {
            params: {
                UserID,       // ID del usuario o streamer
                filter,       // Filtro (recent, popular, random)
                dateRange,    // day, week, month (para el filtro de fecha)
                page,         // Número de página
                limit         // Cantidad de clips por página
            }
        });

        return response.data;  // Devuelve la data de la respuesta
    } catch (error) {
        console.error('Error fetching clips:', error);
    }
};

export const Create_Clip = async ({ tsUrls, startTime, endTime, streamKey, title }, config) => {
    const response = await axios.post(
        `${url}/clips/create-clips`, {
        tsUrls: tsUrls,
        start: 1,
        end: 60,
        clipTitle: title,
        totalKey: streamKey,
    },
        config
    );
    return response
}
export const GetBuffer = async (streamKey, config) => {
    // return axios.get(`${process.env.REACT_APP_BACKRTMP}/stream/${streamKey}`, {
    //     ...config,
    // });

    return axios.get(`http://localhost:8002/stream/${streamKey}`, {
        ...config,
    });
};

// export const GetBuffer = async (totalKey) => {

//     const response = await fetch(
//         `${process.env.REACT_APP_BACKRTMP}/getBuffer/${totalKey}`
//     );
//     return response
// }
export const GetClipId = async (videoUrlParam) => {
    const response = await axios.get(`${url}/clips/GetClipId?clipId=${videoUrlParam}`)

    return response
}
export const GetClipIdlogeado = async (videoUrlParam, token) => {
    const response = await axios.get(`${url}/clips/GetClipIdLogueado?clipId=${videoUrlParam}`, {
        headers: { Authorization: token },
    })

    return response
}
export const GetClipsNameUser = async (nameUserCeator, page) => {
    const response = await axios.get(`${url}/clips/GetClipsNameUser?page=${page}&NameUser=${nameUserCeator}`)

    return response
}
export const GetClipsCategory = async (Category, page, lastClip) => {

    const response = await axios.get(`${url}/clips/GetClipsCategory?page=${page}&Category=${Category}&lastClip=${lastClip}`)
    return response
}
export const GetClipsMostViewed = async (page) => {

    const response = await axios.get(`${url}/clips/GetClipsMostViewed?page=${page}`)
    return response
}
export const ClipsRecommended = async (token, ExcludeIDs) => {
    try {
        const res = await axios.post(
            `${url}/clips/ClipsRecommended`,
            {
                ExcludeIDs

            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const GetClipsMostViewedLast48Hours = async (page) => {

    try {

        const response = await axios.get(`${url}/clips/GetClipsMostViewedLast48Hours?page=${page}`)
        return response.data
    } catch (error) {
        return error
    }
}
export const DislikeClip = async (token, ClipId) => {
    try {
        const res = await axios.post(
            `${url}/clips/DisLike`,
            {
                ClipId: ClipId,

            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const likeClip = async (token, ClipId) => {
    try {

        const res = await axios.post(
            `${url}/clips/ClipLike`,
            {
                ClipId: ClipId,
            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};

export const LikeCommentClip = async (token, ClipId) => {
    try {

        const res = await axios.post(
            `${url}/clips/LikeCommentClip`,
            {
                ClipId: ClipId,
            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const UnlikeComment = async (token, ClipId) => {
    try {

        const res = await axios.post(
            `${url}/clips/UnlikeComment`,
            {
                ClipId: ClipId,
            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const CommentClip = async (token, ClipId, CommentClip) => {
    try {

        const res = await axios.post(
            `${url}/clips/CommentClip`,
            {
                IdClip: ClipId,
                CommentClip,
            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const DeleteComment = async (token, ClipId,) => {
    try {

        const res = await axios.post(
            `${url}/clips/DeleteComment`,
            {
                IdClip: ClipId,
            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};

export const GetClipComments = async (page, IdClip) => {
    try {
        const response = await axios.get(`${url}/clips/GetClipComments?page=${page}&IdClip=${IdClip}`)
        return response;
    } catch (error) {
        return error
    }
}
export const GetClipCommentsLoguedo = async (page, IdClip, token) => {
    try {
        const response = await axios.get(`${url}/clips/GetClipCommentsLoguedo?page=${page}&IdClip=${IdClip}`, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        return error
    }
};

export const UpdateClipTitle = async (page, IdClip, token) => {
    try {
        const response = await axios.get(`${url}/clips/UpdateClipTitle?IdClip=${page}&title=${IdClip}`, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        return error
    }
}
export const DeleteClipByIDAndUserID = async (IdClip, token) => {
    try {
        const response = await axios.get(`${url}/clips/DeleteClipByIDAndUserID?IdClip=${IdClip}`, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        return error
    }
};


export const MoreViewOfTheClip = async (ClipId, token) => {
    try {
        const res = await axios.post(
            `${url}/clips/MoreViewOfTheClip`,
            {
                ClipId: ClipId,
            }, {
            headers: { Authorization: token },
        });
        return res;
    } catch (error) {

        return error
    }
};