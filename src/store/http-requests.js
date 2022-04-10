import { ENDPOINTS } from 'store/config.js';

const apiDrinksUrl = ENDPOINTS.drinks;
const apiFoodsUrl = ENDPOINTS.foods;
const apiMenusUrl = ENDPOINTS.menus;

//#region "GENERIC VERBS"

/**
 * Generic GET request for all items provided from the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @returns {Promise} - Array of drink objects
 */
 async function getItems(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        return response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Generic GET request for single item as found by ID in the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {String} _id - mongoDB ObjectID
 * @returns {Promise} - menu item object
 */
async function getItem(apiUrl, _id) {
    try {
        const response = await fetch(apiUrl + _id);
        if (!response || !response.ok) return null;
        return response.json();
    } catch (err) {
        console.error(err);
    }
}

/**
 * Generic POST request for single item to the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {Object} data - item
 * @returns {Promise} - response Object
 */
 function postItem(apiUrl, data) {
    const settings = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        return fetch(apiUrl, settings);
    } catch (err) {
        console.error(err);
    }
}

/**
 * Generic PUT request to update a single food as found by ID in the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {String} _id - mongoDB ObjectID
 * @param {Object} data - food Object
 * @returns {Promise} - response Object
 */
 function putItem(apiUrl, _id, data) {
    const settings = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        return fetch(apiUrl + _id, settings);
    } catch (err) {
        console.error(err);
    }
}

/**
 * Generic DELETE request for single item as found by ID in the specified endpoint.
 * @param {String} _id - mongoDB ObjectID
 * @param {String} apiUrl - API endpoint
 * @returns {Promise} - response Object
 */
 function deleteItem(apiUrl, _id) {
    try {
        return fetch(apiUrl + _id, { method: "DELETE" });
    } catch (err) {
        console.error(err);
    }
}

//#endregion

const foodsRequests = {
    getAll: () => getItems(apiFoodsUrl),
    get: (_id) => getItem(apiFoodsUrl, _id),
    post: (data) => postItem(apiFoodsUrl, data),
    put: (_id, data) => putItem(apiFoodsUrl, _id, data),
    delete: (_id) => deleteItem(apiFoodsUrl, _id)
}

const drinksRequests = {
    getAll: () => getItems(apiDrinksUrl),
    get: (_id) => getItem(apiDrinksUrl, _id),
    post: (data) => postItem(apiDrinksUrl, data),
    put: (_id, data) => putItem(apiDrinksUrl, _id, data),
    delete: (_id) => deleteItem(apiDrinksUrl, _id)
}

const restaurantmenusRequests = {
    get: (_id) => getItem(apiMenusUrl, _id),
    put: (_id, data) => putItem(apiMenusUrl, _id, data)
}

export { foodsRequests, drinksRequests, restaurantmenusRequests };