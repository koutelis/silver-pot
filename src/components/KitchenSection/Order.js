import React, { useEffect, useState } from "react";
import { CompleteButton } from "components/generic.js";
import { ORDERS } from "store/config.js";
import FoodDetails from "components/KitchenSection/FoodDetails.js";
import styles from "styles/KitchenSection.module.css";

const KitchenFoodsDetails = (props) => {
    const { foods, onClick } = props;
    return foods.map((food, index) => {
        if (food.category !== "dessert") {
            return (
                <FoodDetails 
                    key={index} 
                    data={food} 
                    onClick={() => onClick(food.complete, index)} 
                />
            );
        }
    });
}

/**
 * SUBCOMPONENT of OrdersList.js
 * @returns {JSX}
 */
const Order = (props) => {
    const { orderData, onComplete } = props;
    const [ isVisible, setIsVisible ] = useState(true);
    const [ foods, setFoods ] = useState([]);

    useEffect(() => {
        const cache = JSON.parse(localStorage.getItem(`orderFoods-${orderData._id}`));
        if (cache) {
            const updatedCache = orderData.foods.map(food => {
                const tmp = { ...food };
                if (tmp.category !== "dessert" && cache[tmp._id]) {
                    tmp.complete = cache[tmp._id].complete;
                }
                return tmp;
            });           
            setFoods(updatedCache);
        } else {
            setFoods(orderData.foods);
        }
    }, [orderData]);

    // manage cache
    useEffect(() => {
        const hasFoods = foods.filter(food => food.category !== "dessert").length > 0;
        if (!hasFoods) localStorage.removeItem(`orderFoods-${orderData._id}`);
        else {
            const tmp = {};
            foods.filter(food => food.category !== "dessert").forEach(food => tmp[food._id] = food);
            localStorage.setItem(`orderFoods-${orderData._id}`, JSON.stringify(tmp));
        }
    }, [foods]);

    const hasFoodsToDisplay = foods.some(food => food.category !== "dessert");
    if (!hasFoodsToDisplay) return null;

    /**
     * CLICK event handler for checkboxes/radios and their corresponding labels.
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

    return (
        <div className={styles["order-container"]} style={{ backgroundColor }}>
            <div className={styles["order__heading"]} onClick={cbToggleVisibility}>
                <h3>{orderData.time} {"\u2013"} Table {orderData.table}</h3>
                <span>{headingSide}</span>
            </div>
            <div className={detailsClassList}>
                <div>
                    <KitchenFoodsDetails foods={foods} onClick={cbFoodClick} />
                </div>
                <CompleteButton 
                    className={styles["btn--order-complete"]} 
                    tooltip={`submit order for ${orderData.table}`} 
                    onClick={cbComplete} 
                />
            </div>
        </div>
    );
}

export default Order;
