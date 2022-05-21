import React, { useEffect, useState } from "react";
import { CompleteButton } from "components/generic.js";
import { ORDERS } from "store/config.js";
import { DrinkDetails, DessertDetails } from "components/BarSection/BarItemDetails.js";
import styles from "styles/BarSection.module.css";

/**
 * SUBCOMPONENT of OrdersList.js
 * @returns {JSX}
 */
const Order = (props) => {
    const { orderData, onComplete } = props;
    const [isVisible, setIsVisible] = useState(true);
    const [drinks, setDrinks] = useState([]);
    const [foods, setFoods] = useState([]);
    
    useEffect(() => {
        // set drinks
        const drinksCache = localStorage.getItem(`orderDrinks-${orderData._id}`);
        if (drinksCache) {
            setDrinks(JSON.parse(drinksCache));
        } else {
            const orderedDrinks = [ ...orderData.drinks ];
            setDrinks(orderedDrinks);
        }
        
        // set foods
        let foodsCache = localStorage.getItem(`orderFoods-${orderData._id}`);
        if (foodsCache) {
            foodsCache = JSON.parse(foodsCache);
            // fix foods as handled by the kitchen
            foodsCache.forEach((food, index) => {
                if (food.category !== "dessert") food.complete = orderData.foods[index].complete;
            })
            setFoods(foodsCache);
        } else {
            setFoods(orderData.foods);
        }
    }, [orderData]);

    // manage drinks cache
    useEffect(() => {
        if (!drinks) localStorage.removeItem(`orderDrinks-${orderData._id}`);
        else localStorage.setItem(`orderDrinks-${orderData._id}`, JSON.stringify(drinks));
    }, [drinks]);

    // manage drinks cache
    useEffect(() => {
        if (!foods) localStorage.removeItem(`orderFoods-${orderData._id}`);
        else localStorage.setItem(`orderFoods-${orderData._id}`, JSON.stringify(foods));
    }, [foods]);

    const hasItemsToDisplay = drinks.length || foods.some(food => food.category === "dessert");
    if (!hasItemsToDisplay) return null;

    /**
     * CLICK event handler for checkboxes/radios and their corresponding labels.
     * @param {Boolean} prevCheckedStatus 
     * @param {Number} index 
     */
    const cbDrinkClick = (prevCheckedStatus, index) => {
        setDrinks(snapshot => {
            const tmp = [ ...snapshot ];
            tmp[index].complete = !prevCheckedStatus;
            return tmp;
        })
    }

    /**
     * CLICK event handler for checkboxes/radios and their corresponding labels.
     * @param {Boolean} prevCheckedStatus 
     * @param {Number} index 
     */
     const cbDessertClick = (prevCheckedStatus, index) => {
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
        // clear relevant cache
        ["orderDrinks-", "orderFoods-"].forEach(prefix => {
            const key = `${prefix}${orderData._id}`;
            const cache = localStorage.getItem(key);
            if (cache) localStorage.removeItem(key);
        })

        const completedOrder = { ...orderData, drinks, foods };
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
                <DrinksList 
                    drinks={drinks}
                    onClick={cbDrinkClick}
                />
                <DessertsList 
                    foods={foods}
                    onClick={cbDessertClick}
                />
            </div>
            <CompleteButton 
                className={styles["btn--order-complete"]} 
                tooltip={`submit order for ${orderData.table}`} 
                onClick={cbComplete} 
            />
        </div>
    </div>
}

const DrinksList = (props) => {
    const { drinks, onClick } = props;
    return drinks.map((drink, index) => (
        <DrinkDetails 
            key={index} 
            data={drink} 
            onClick={() => onClick(drink.complete, index)} 
        />
    ));
}

const DessertsList = (props) => {
    const { foods, onClick } = props;
    return foods.map((food, index) => {
        if (food.category === "dessert") {
            return <DessertDetails 
                key={index} 
                data={food} 
                onClick={() => onClick(food.complete, index)} 
            />;
        }
    });
}

export default Order;

