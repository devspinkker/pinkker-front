import axios from "axios"
const url = process.env.REACT_APP_BACKGO
var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

export const CreateCommunity = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Necesario para enviar archivos
        },
    };

    const response = await axios.post(
        `${url}/communities/CreateCommunity`,
        formData,
        config
    );

    return response;
};
export const EditCommunity = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Necesario para enviar archivos
        },
    };

    const response = await axios.post(
        `${url}/communities/EditCommunity`,
        formData,
        config
    );

    return response;
};




export const AddMember = async ({ community_id, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/AddMember`, {
        community_id
    },
        config
    );
    return response
}



export const RemoveMember = async ({ community_id, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/RemoveMember`, {
        community_id
    },
        config
    );
    return response
}


export const BanMember = async ({ community_id, user_id, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/BanMember`, {
        community_id,
        user_id
    },
        config
    );
    return response
}
export const GetCommunityPosts = async ({ community_ids, ExcludeFilterIDs = [], token }) => {

    try {

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(
            `${url}/communities/GetCommunityPosts`, {
            community_ids,
            ExcludeFilterIDs
        },
            config
        );
        return response.data
    } catch (err) {
        return err.response?.data
    }
}
export const AddModerator = async ({ community_id, new_mod_id, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/AddModerator`, {
        community_id,
        new_mod_id
    },
        config
    );
    return response
}
export const DeletePost = async ({ CommunityID, PostId, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/DeletePost`, {
        CommunityID,
        PostId
    },
        config
    );
    return response
}
export const DeleteCommunity = async ({ CommunityID, totp_code, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/DeleteCommunity`, {
        CommunityID,
        totp_code
    },
        config
    );
    return response
}
export const FindCommunityByName = async ({ CommunityID, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(
        `${url}/communities/FindCommunityByName`, {
        ...config,
        params: {
            community: CommunityID, // Usamos 'community' como parámetro de consulta
        },
    },
        config
    );
    return response.data
}


export const GetCommunityRecommended = async ({ page, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await axios.get(
            `${url}/communities/GetCommunityRecommended`, {
            ...config,
            params: {
                page,
            },
        },
            config
        );
        return response.data
    } catch (err) {
        return err

    }
}




export const FindUserCommunities = async ({ UserId }) => {
    try {
        const response = await axios.post(
            `${url}/communities/FindUserCommunities`, {
            UserId: UserId,
        })
        return response.data

    } catch (error) {
        return 0
    }

}

export const CommunityOwnerUser = async ({ UserId }) => {

    const response = await axios.post(
        `${url}/communities/CommunityOwnerUser`, {
        UserId: UserId,
    })
    return response.data
}

export const GetCommunity = async ({ community }) => {

    const response = await axios.get(
        `${url}/communities/GetCommunity`, {
        params: {
            community: community,
        },
    },
    );
    return response.data
}

export const GetCommunityWithUserMembership = async ({ community, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(
        `${url}/communities/GetCommunityWithUserMembership`, {
        ...config,
        params: {
            community: community,
        },
    },
        config
    );
    return response.data
}


export const GetTop10CommunitiesByMembers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(
        `${url}/communities/GetTop10CommunitiesByMembers`,
        config
    )
    return response.data
}
export const GetTop10CommunitiesByMembersNoMember = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(
        `${url}/communities/GetTop10CommunitiesByMembersNoMember`,
        config
    )
    return response.data
}