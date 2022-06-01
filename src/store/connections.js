import io from "socket.io-client";
import { ENDPOINTS, WEB_SOCKETS } from 'store/config.js';
import { todayAsString } from "store/utils.js";

const socket = io(WEB_SOCKETS.orders);
const apiBaseIrl = ENDPOINTS.base;
const apiDrinksUrl = ENDPOINTS.drinks;
const apiDrinksCatUrl = ENDPOINTS.drinksCategorized;
const apiFoodsUrl = ENDPOINTS.foods;
const apiMenusUrl = ENDPOINTS.menus;
const apiOrdersUrl = ENDPOINTS.orders;
const apiUsersUrl = ENDPOINTS.users;

//#region "GENERIC VERBS"

/**
 * Generic GET request for all items provided from the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @returns {Promise} - Array of drink objects
 */
const getAll = async (apiUrl) => {
    try {
        const response = await fetch(apiUrl);
        return response.json();
    } catch (err) {
        return onError(err);
    }
}

/**
 * Generic GET request for single item as found by ID in the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {String} _id - mongoDB ObjectID
 * @returns {Promise} - menu item object
 */
const getItem = async (apiUrl, _id) => {
    try {
        const response = await fetch(apiUrl + _id);
        if (!response?.ok) return null;
        return response.json();
    } catch (err) {
        return onError(err);
    }
}

/**
 * Generic POST request for single item to the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {Object} data - item
 * @returns {Promise} - response Object
 */
 const postItem = (apiUrl, data) => {
    const settings = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        return fetch(apiUrl, settings);
    } catch (err) {
        return onError(err);
    }
}

/**
 * Generic PUT request to update a single food as found by ID in the specified endpoint.
 * @param {String} apiUrl - API endpoint
 * @param {String} _id - mongoDB ObjectID
 * @param {Object} data - food Object
 * @returns {Promise} - response Object
 */
 const putItem = (apiUrl, _id, data) => {
    const settings = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        return fetch(apiUrl + _id, settings);
    } catch (err) {
        return onError(err);
    }
}

/**
 * Generic DELETE request for single item as found by ID in the specified endpoint.
 * @param {String} _id - mongoDB ObjectID
 * @param {String} apiUrl - API endpoint
 * @returns {Promise} - response Object
 */
 const deleteItem = (apiUrl, _id) => {
    try {
        return fetch(apiUrl + _id, { method: "DELETE" });
    } catch (err) {
        return onError(err);
    }
}

const getTodaysMenu = async (_id) => {
    const res = await getItem(apiMenusUrl, _id);
    if (!res) {
        const date = todayAsString();
        const drinks = await drinksRequests.getAllCategorized();
        const drinksCategorized = {};
        drinks.forEach((elem) => (drinksCategorized[elem._id] = elem.items));
        const data = {
            date,
            fontSize: 14,
            foods: [],
            drinks: drinksCategorized
        }
        await restaurantmenusRequests.put(date, data);
        return getItem(apiMenusUrl, date);
    }

    return res;
}

const deletePastMenus = () => {
    try {
        return fetch(apiMenusUrl, { method: "DELETE" });
    } catch (err) {
        return onError(err);
    }
}

const onError = (err) => {
    // console.error(err);
    return Promise.resolve(null);
}

//#endregion

//#region "HTTP REQUESTS"

const getConnection = () => getAll(apiBaseIrl);

const foodsRequests = {
    getAll: () => getAll(apiFoodsUrl),
    get: (_id) => getItem(apiFoodsUrl, _id),
    post: (data) => postItem(apiFoodsUrl, data),
    put: (_id, data) => putItem(apiFoodsUrl, _id, data),
    delete: (_id) => deleteItem(apiFoodsUrl, _id)
}

const drinksRequests = {
    getAll: () => getAll(apiDrinksUrl),
    getAllCategorized: () => getAll(apiDrinksCatUrl),
    get: (_id) => getItem(apiDrinksUrl, _id),
    post: (data) => postItem(apiDrinksUrl, data),
    put: (_id, data) => putItem(apiDrinksUrl, _id, data),
    delete: (_id) => deleteItem(apiDrinksUrl, _id)
}

const restaurantmenusRequests = {
    getTemplate: () => getItem(apiMenusUrl, "template"),
    getCurrent: () => getTodaysMenu( todayAsString() ),
    updateCurrent: (data) => putItem(apiMenusUrl, todayAsString(), data),
    put: (_id, data) => putItem(apiMenusUrl, _id, data),
    deletePast: deletePastMenus
}

const ordersRequests = {
    getAll: () => getAll(apiOrdersUrl),
    getByTable: (tableNum) => getItem(apiOrdersUrl + "table/", tableNum),
    post: (data) => postItem(apiOrdersUrl, data),
    put: (_id, data) => putItem(apiOrdersUrl, _id, data),
    delete: (_id) => deleteItem(apiOrdersUrl, _id)
}

const usersRequests = {
    getAll: () => getAll(apiUsersUrl),
    get: (email) => getItem(apiUsersUrl, email),
    post: (data) => postItem(apiUsersUrl, data),
    put: (email, data) => putItem(apiUsersUrl, email, data),
    delete: (email) => deleteItem(apiUsersUrl, email)
}

//#endregion

//#region "SOCKETS"

/**
 * Get new WebSocket to subscript to the MongoDB orders collection.
 * @returns {function} - WebSocket listener removal function
 */
const mongoSubscribe = (onChangeHandler, event) => {
    socket.on(event, onChangeHandler);

    const cleanup = () => socket.off(event, onChangeHandler);
    return cleanup;
}

const subscriptions = {
    subscribeToOrderUpdates: (onChangeHandler) => mongoSubscribe(onChangeHandler, "ordersUpdated"),
    subscribeToMenuUpdates: (onChangeHandler) => mongoSubscribe(onChangeHandler, "menuUpdated"),
    subscribeToUsersUpdates: (onChangeHandler) => mongoSubscribe(onChangeHandler, "usersUpdated")
}

//#endregion

export { 
    getConnection,
    foodsRequests, 
    drinksRequests, 
    restaurantmenusRequests, 
    ordersRequests, 
    usersRequests,
    subscriptions 
};
