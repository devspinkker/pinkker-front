import axios from "axios"
const url = process.env.REACT_APP_BACKGO
var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

export const CreateCommunity = async ({ community_name, description, is_private, categories, totp_code, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${url}/communities/CreateCommunity`, {
        community_name,
        description,
        is_private,
        categories,
        totp_code
    },
        config
    );
    return response
}

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
    return response
}
export const GetCommunity = async ({ community, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(
        `${url}/communities/GetCommunity`, {
        ...config,
        params: {
            community: community, // Usamos 'community' como parámetro de consulta
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