import axios from "axios";
const url = process.env.REACT_APP_BACKGO;
var token = null;

export const setToken = (newObject) => {
  token = newObject;
};

export const PostCreate = async (formData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios.post(`${url}/post/postCreate`, formData, config);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const IdOfTheUsersWhoClicked = async (idAdvertisements, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/advertisements/IdOfTheUsersWhoClicked`, {
      idAdvertisements
    }, config);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const CitaPost = async (formData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios.post(`${url}/post/Citapost`, formData, config);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const PostGetFollow25h = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${url}/post/postGetFollow`, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const PostGets = async () => {
  try {
    const res = await axios.get(`${url}/post/PostGets`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const GetCommentPost = async (id, page = 1, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${url}/post/GetCommentPost?id=${id}&page=${page}`,
      config
    );
    return res;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

export const RePost = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/Repost`, { idPost: id }, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const LikePost = async (object) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/posttLike`, object, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const DislikePost = async (object) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/postDislike`, object, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const CommentPost = async (object) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/CommentPost`, object, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTweetFollowing = async (page, limit) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${url}/get_tweets_following?page=${page}`,
      config
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTweetUser = async (id, page, limit) => {
  try {

    const res = await axios.get(
      `${url}/post/getPostUser?id=${id}&page=${page}&limit=${limit}`,
    );
    return res.data;
  } catch (error) {
  }
};
export const getPostUserLogueado = async (id, page, limit, token) => {
  try {

    const res = await axios.get(
      `${url}/post/getPostUserLogueado?id=${id}&page=${page}&limit=${limit}`,

      {
        headers: { Authorization: token },
      },
    );
    return res.data;
  } catch (error) {
  }
};


export const GetPostsWithImages = async (id, page, limit) => {
  try {

    const res = await axios.get(
      `${url}/post/GetPostsWithImages?id=${id}&page=${page}&limit=${limit}`,
    );
    return res.data;
  } catch (error) {
  }
};

export const GetCommunityPostsGallery = async (id, token, ExcludeFilterIDs = [],) => {
  try {

    const res = await axios.post(
      `${url}/communities/GetCommunityPostsGallery`, {
      community_ids: id,
      ExcludeFilterIDs: ExcludeFilterIDs,
    }, {
      headers: { Authorization: token },
    },
    );
    return res.data;
  } catch (error) {
  }
};

export const PostGetIdLogueado = async (id, token) => {
  try {

    const res = await axios.get(
      `${url}/post/PostGetIdLogueado?id=${id}`, {
      headers: { Authorization: token },
    },
    );
    return res.data;
  } catch (error) {
  }
};
export const getTweetId = async (id) => {
  try {

    const res = await axios.get(
      `${url}/post/PostGetId?id=${id}`,
    );
    return res.data;
  } catch (error) {
  }
};

export const GetTweetsRecommended = async (token, ExcludeIDs) => {
  try {
    console.log({ ExcludeIDs });
    const res = await axios.post(
      `${url}/post/GetTweetsRecommended`,
      { ExcludeIDs },

      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    return error
  }
};
export const GetPostCommunitiesFromUser = async (token, ExcludeIDs) => {
  try {
    console.log({ ExcludeIDs });
    const res = await axios.post(
      `${url}/post/GetPostCommunitiesFromUser`,
      { ExcludeIDs },

      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    return error
  }
};

export const GetRandomPostcommunities = async (token, ExcludeIDs = []) => {
  try {
    const res = await axios.post(
      `${url}/post/GetRandomPostcommunities`,
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
export const getTrends = async (page = 1) => {
  try {
    const response = await axios.get(`${url}/post/GetTrends?page=${page}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTweetsByHashtag = async (hashtag, page = 1) => {
  try {
    const response = await axios.get(`${url}/post/GetTweetsByHashtag?page=${page}&hashtag=${hashtag}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTrendsByPrefix = async (prefix) => {
  try {
    const response = await axios.get(`${url}/post/GetTrendsByPrefix?hashtag=${prefix}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};