import React, { useEffect, useState } from "react";
import { CompleteButton } from "components/generic.js";
import { ORDERS } from "store/config.js";
import FoodDetails from "components/KitchenSection/FoodDetails.js";
import styles from "styles/KitchenSection.module.css";

/**
 * SUBCOMPONENT of OrdersList.js
 * @returns {JSX}
 */
const Order = (props) => {
    const { orderData, onComplete } = props;
    const [isVisible, setIsVisible] = useState(true);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        console.log(orderData);
        let cache = localStorage.getItem(`orderFoods-${orderData._id}`);
        if (cache) {
            cache = JSON.parse(cache);
            // fix desserts as handled by the baristas
            cache.forEach((food, index) => {
                if (food.category === "dessert") food.complete = orderData.foods[index].complete;
            })

            // include new un-cached orders
            // orderData.foods.forEach(food => {
            //     if (!food.cached ) cache[]
            // })
            setFoods(cache);
        } else {
            setFoods(orderData.foods);
        }
    }, [orderData]);

    // manage cache
    useEffect(() => {
        if (!foods) localStorage.removeItem(`orderFoods-${orderData._id}`);
        else {
            const tmp = [ ...orderData.foods ];
            tmp.forEach(food => food.cached = true);
            localStorage.setItem(`orderFoods-${orderData._id}`, JSON.stringify(tmp));
        }
    }, [foods]);

    const hasFoodsToDisplay = foods.some(food => food.category !== "dessert");
    if (!hasFoodsToDisplay) return null;

    /**
     * CLICK event handler for checkboxes/radios and their corresponding labels.
     * @param {Boolean} prevCheckedStatus 
     * @param {Number} index 
     */
    const cbFoodClick = (prevCheckedStatus, index) => {
        setFoods(snapshot => {
            const tmp = [ ...snapshot ];
            tmp[index].complete = !prevCheckedStatus;
            return tmp;
        })
    }

    /**
     * CLICK event handler for the TICK button.
     * Mark order as complete in the database
     */
    const cbComplete = () => {
        localStorage.removeItem(`orderFoods-${orderData._id}`);
        const completedOrder = { ...orderData, foods };
        onComplete(completedOrder);
    }

    /**
     * Callback to toggle the visibility of an order.
     */
    const cbToggleVisibility = () => setIsVisible(!isVisible);

    const backgroundColor = ORDERS.tables[orderData.table].color;
    const headingSide = `(${isVisible ? "hide" : "show"})`;
    const detailsClassList = [styles["order__details"], isVisible ? "" : "hidden"].join(" ");

    return <div className={styles["order-container"]} style={{ backgroundColor }}>
        <div className={styles["order__heading"]} onClick={cbToggleVisibility}>
            <h3>{orderData.time} {"\u2013"} Table {orderData.table}</h3>
            <span>{headingSide}</span>
        </div>
        <div className={detailsClassList}>
            <div>
                {foods
                    .filter(food => food.category !== "dessert")
                    .map((food, index) => (
                        <FoodDetails 
                            key={index} 
                            data={food} 
                            onClick={() => cbFoodClick(food.complete, index)} 
                        />
                    ))}
            </div>
            <CompleteButton 
                className={styles["btn--order-complete"]} 
                tooltip={`submit order for ${orderData.table}`} 
                onClick={cbComplete} 
            />
        </div>
    </div>
}

export default Order;
