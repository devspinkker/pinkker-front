import axios from "axios";
const url = process.env.REACT_APP_BACKGO;
var token = null;

export const setToken = (newObject) => {
  token = newObject;
};

export const PostCreate = async (formData) => {
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

export const GetCommentPost = async (id) => {

  const res = await axios.get(`${url}/post/GetCommentPost?id=${id}`);
  return res;

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
      `${url}/post/get_tweets_user?id=${id}&page=${page}&limit=${limit}`,
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
    const res = await axios.post(
      `${url}/post/GetTweetsRecommended`,
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