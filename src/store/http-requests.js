
//#region "FOODS"

const apiFoodUrl = "http://localhost:3001/api/foods/";

/**
 * GET request for all stored foods.
 * @returns {Array[Object]} - Array of food objects
 */
async function getFoods() {
    try {
        const response = await fetch(apiFoodUrl);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * GET request for single food.
 * @param {String} _id - mongoDB ObjectID
 * @returns {Object} - food object
 */
async function getFood(_id) {
    try {
        const response = await fetch(`${apiFoodUrl}${_id}`);
        const result = await response.json();
        if (result.length === 1) return result[0];
        else throw Error("A single food should have been returned, given a valid _id")
    } catch (err) {
        console.error(err);
    }
}

/**
 * POST request for single food.
 * @param {Object} data - food Object
 * @returns {Object} - response Object
 */
async function postFood(data) {
    const settings = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(apiFoodUrl, settings);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * DELETE request for single food.
 * @param {String} _id - mongoDB ObjectID
 * @returns {Object} - response Object
 */
async function deleteFood(_id) {
    try {
        const response = await fetch(`${apiFoodUrl}${_id}`, { method: "DELETE" });
        return response;
    } catch (err) {
        console.error(err);
    }
}

/**
 * PUT request to update a single food.
 * @param {String} _id - mongoDB ObjectID
 * @param {Object} data - food Object
 * @returns {Boolean} - whether successfully edited or not
 */
async function putFood(_id, data) {
    const settings = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiFoodUrl}${_id}`, settings);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
}


const foodRequests = {
    getAll: getFoods,
    get: getFood,
    post: postFood,
    delete: deleteFood,
    put: putFood
}

//#endregion

//#region "DRINKS"

const apiDrinksUrl = "http://localhost:3001/api/drinks/";

async function getDrinks() {}

async function getDrink(_id) {}

async function postDrink(data) {}

async function deleteDrink(_id) {}

async function putDrink(_id, data) {}

const drinkRequests = {
    getAll: getDrinks,
    get: getDrink,
    post: postDrink,
    delete: deleteDrink,
    put: putDrink
}

//#endregion

export { foodRequests, drinkRequests };
