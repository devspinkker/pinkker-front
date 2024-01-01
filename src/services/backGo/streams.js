const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
	token = newObject;
};

const baseURL = "https://pinkker-backend-2-xw7b.fl0.io";

export async function getStreamById(streamId) {
	try {
		const response = await axios.post(`${baseURL}/stream/getStreamById`, {
			IdStream: streamId,
		});
		return response.data;
	} catch (error) {
		console.error('Error en getStreamById:', error.message);
		throw error;
	}
}

// Función para obtener streams por categoría
export async function getStreamsByCategory(category, page) {
	try {
		const response = await axios.get(`${baseURL}/stream/getStreamsByCategorie`, {
			params: {
				page: page,
				Categorie: category,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		return (error)
	}
}

// Función para obtener streams por nombre de usuario
export async function getStreamByUserName(userName) {
	try {
		const response = await axios.get(`${baseURL}/stream/getStreamByNameUser?Streamer=${userName}`)
		return response.data
	} catch (error) {
		console.error('Error en getStreamByUserName:', error.message);
		throw error;
	}
}

// Función para obtener streams de usuarios que sigo
async function getStreamsIFollow(followingIds) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/getStreamsIdsStreamer`,
			{ FollowingIds: followingIds },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error en getStreamsIFollow:', error.message);
		throw error;
	}
}

// Función para actualizar la información de un stream
export async function updateStreamInfo(token, streamInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/update_stream_info`,
			streamInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.log(error);
		// return error
	}
}

// Función para obtener streams en línea
export async function GetAllsStreamsOnline() {
	try {
		const response = await axios.get(
			`${baseURL}/stream/GetAllsStreamsOnline`
		);
		return response.data;
	} catch (error) {
		console.error('Error en GetAllsStreamsOnline:', error.message);
		throw error;
	}
}

// Función para actualizar la fecha de inicio de un stream
async function updateStartDate(streamInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/update_start_date`,
			streamInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error en updateStartDate:', error.message);
		throw error;
	}
}
async function updateOnlineStatus(updateInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/update_online`,
			updateInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error en updateOnlineStatus:', error.message);
		throw error;
	}
}
async function closeStream() {
	try {
		const response = await axios.post(
			`${baseURL}/stream/closeStream`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error en closeStream:', error.message);
		throw error;
	}
}

// Función para obtener streams en línea
async function getStreamingsOnline() {
	try {
		const response = await axios.get(
			`${baseURL}/stream/get_streamings_online`
		);
		return response.data;
	} catch (error) {
		console.error('Error en getStreamingsOnline:', error.message);
		throw error;
	}
}
export async function getCategoriesWithLimit(param) {
	try {
		const response = await axios.get(`${baseURL}/categorie/GetCategories`)
		return response.data
	} catch (error) {
		console.error('Error en getStreamByUserName:', error.message);
		throw error;
	}
}
