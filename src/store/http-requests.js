import { ENDPOINTS } from 'store/defaults.js';

const apiDrinksUrl = ENDPOINTS.drinks;
const apiFoodsUrl = ENDPOINTS.foods;
const apiMenusUrl = ENDPOINTS.menus;

//#region "GENERIC VERBS"

/**
 * Generic GET request for all items provided from the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @returns {Array[Object]} - Array of drink objects
 */
 async function getItems(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Generic GET request for single item as found by ID in the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {String} _id - mongoDB ObjectID
 * @returns {Object} - menu item object
 */
async function getItem(apiUrl, _id) {
    try {
        const response = await fetch(`${apiUrl}${_id}`);
        const result = await response.json();
        if (!result) throw Error("A single item should have been returned, given a valid _id");
        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * Generic POST request for single item to the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {Object} data - item
 * @returns {Object} - response Object
 */
 async function postItem(apiUrl, data) {
    const settings = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(apiUrl, settings);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * Generic DELETE request for single item as found by ID in the specified endpoint.
 * @param {String} _id - mongoDB ObjectID
 * @param {String} apiUrl - API endpoint
 * @returns {Object} - response Object
 */
 async function deleteItem(apiUrl, _id) {
    try {
        const response = await fetch(`${apiUrl}${_id}`, { method: "DELETE" });
        return response;
    } catch (err) {
        console.error(err);
    }
}

/**
 * Generic PUT request to update a single food as found by ID in the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {String} _id - mongoDB ObjectID
 * @param {Object} data - food Object
 * @returns {Boolean} - whether successfully edited or not
 */
 async function putItem(apiUrl, _id, data) {
    const settings = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}${_id}`, settings);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

//#endregion

const foodRequests = {
    getAll: () => getItems(apiFoodsUrl),
    get: (_id) => getItem(apiFoodsUrl, _id),
    post: (data) => postItem(apiFoodsUrl, data),
    delete: (_id) => deleteItem(apiFoodsUrl, _id),
    put: (_id, data) => putItem(apiFoodsUrl, _id, data)
}

const drinkRequests = {
    getAll: () => getItems(apiDrinksUrl),
    get: (_id) => getItem(apiDrinksUrl, _id),
    post: (data) => postItem(apiDrinksUrl, data),
    delete: (_id) => deleteItem(apiDrinksUrl, _id),
    put: (_id, data) => putItem(apiDrinksUrl, _id, data)
}

const menuRequests = {
    getTemplate: () => getItem(apiMenusUrl, "template"),
    saveTemplate: (data) => postItem(apiMenusUrl, data)
}

export { foodRequests, drinkRequests, menuRequests };
