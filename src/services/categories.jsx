import axios from "axios";

const url = process.env.REACT_APP_DEV_API_URL + "/categories";

export const getAllCategories = async () => {
  try {
    let response = await axios.get(`${url}/get_categories`);
    return response.data;
  } catch (error) {
    console.log("Error while calling participateBet", error);
  }
};

const getCategoriesWithLimit = async (limit) => {
  try {
    let response = await axios.get(`${url}/get_categories?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log("Error while calling participateBet", error);
  }
};

export const getCategorieByName = async (categorie) => {
  try {
    let response = await axios.get(
      `${url}/get_categories_by_name/?name=${categorie}`
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling participateBet", error);
  }
};

export const followCategorie = async (token, categorieFollow) => {
  try {
    const res = await axios.post(
      `${url}/follow_categorie`,
      {
        categorieFollow,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling participateBet", error);
  }
};

export const unfollowCategorie = async (token, categorieFollow) => {
  try {
    const res = await axios.post(
      `${url}/unfollow_categorie`,
      {
        categorieFollow,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling participateBet", error);
  }
};

export const userFollowCategorie = async (token, categorieFollow) => {
  try {
    const res = await axios.post(
      `${url}/user_follow_categorie`,
      {
        categorieFollow,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling participateBet", error);
  }
};
