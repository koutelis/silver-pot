import { ordersRequests } from "store/connections.js";
import { cloneObject, currentTimeString, todayAsString } from "store/utils.js";

/**
 * Calculate the cost of all selected menu items and their relevant selected options
 * @param {Object} order current order
 * @returns {Number}
 */
const calculateTotalCost = (order) => {
    const foodsTotalPrice = order.foods.reduce((total, current) => total + current.totalPrice, 0);
    const drinksTotalPrice = order.drinks.reduce((total, current) => total + current.totalPrice, 0);
    return foodsTotalPrice + drinksTotalPrice;
}


/**
 * Helper of cbSubmitOrder().
 * Prepare current order by filtering menu item options, to be sent to DB.
 * @param {Object} currentOrder
 * @returns {Object}
 */
const prepFinalizedOrder = (currentOrder) => {
    const finalizedOrder = cloneObject(currentOrder);
    finalizedOrder.time = currentTimeString();

    // filter-out unchecked options
    finalizedOrder.foods.forEach(food => {
        food.addons = food.addons.filter(adn => adn.checked);
        food.removables = food.removables.filter(rmv => rmv.checked);
        food.complete = false;
    });

    finalizedOrder.drinks.forEach(drink => {
        // also rename property 'sizes' to 'size'
        drink.size = drink.sizes.filter(size => size.checked)[0];
        drink.complete = false;
    });

    return finalizedOrder;
}

const sendOrderToDB = async (finalizedOrder, availableItems) => {
    // rename id property to let mongoose create new distinct ones, 
    /// but keep original as reference
    finalizedOrder.foods = finalizedOrder.foods.map(food => {
        const { _id, ...rest } = food;
        return { ...rest, foodId: _id};
    });
    finalizedOrder.drinks = finalizedOrder.drinks.map(drink => {
        const { _id, ...rest } = drink;
        return { ...rest, drinkId: _id};
    });

    // check for existing ongoing order
    const tableExistingOrder = await ordersRequests.getByTable(finalizedOrder.table);
    if (tableExistingOrder) {
        let updatedFoods = finalizedOrder.foods.concat(tableExistingOrder.foods);

        finalizedOrder = {
            ...finalizedOrder,
            foods: updatedFoods,
            drinks: finalizedOrder.drinks.concat(tableExistingOrder.drinks),
            totalCost: finalizedOrder.totalCost + tableExistingOrder.totalCost
        };
    }

    // set flags
    const hasPendingFoods = finalizedOrder.foods.some(food => food.category !== "dessert" && !food.complete);
    const hasPendingDesserts = finalizedOrder.foods.some(food => food.category === "dessert" && !food.complete);
    const hasPendingDrinks = finalizedOrder.drinks.some(drink => !drink.complete);
    finalizedOrder.kitchenComplete = !hasPendingFoods;
    finalizedOrder.barComplete = !(hasPendingDrinks || hasPendingDesserts);
    finalizedOrder.paymentComplete = false;
    finalizedOrder.date = availableItems?.date ?? todayAsString();

    // send to DB
    if (tableExistingOrder) ordersRequests.put(tableExistingOrder._id, finalizedOrder);
    else ordersRequests.post(finalizedOrder);
}

export { calculateTotalCost, prepFinalizedOrder, sendOrderToDB };