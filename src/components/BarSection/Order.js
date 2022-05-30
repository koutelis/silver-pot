import React, { useEffect, useState } from "react";
import { CompleteButton } from "components/generic.js";
import { ORDERS } from "store/config.js";
import { DrinkDetails, DessertDetails } from "components/BarSection/BarItemDetails.js";
import styles from "styles/BarSection.module.css";

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
            return (
                <DessertDetails 
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
    const [ drinks, setDrinks ] = useState([]);
    const [ foods, setFoods ] = useState([]);
    
    useEffect(() => {
        // set drinks
        const drinksCache = JSON.parse(localStorage.getItem(`orderDrinks-${orderData._id}`));
        if (drinksCache) {
            const updatedCache = orderData.drinks.map(drink => {
                const tmp = { ...drink };
                if (drinksCache[tmp._id]) {
                    tmp.complete = drinksCache[tmp._id].complete;
                }
                return tmp;
            });           
            setDrinks(updatedCache);
        } else {
            setDrinks(orderData.drinks);
        }
        
        // set foods
        const foodsCache = JSON.parse(localStorage.getItem(`orderBarFoods-${orderData._id}`));
        if (foodsCache) {
            const updatedCache = orderData.foods.map(food => {
                const tmp = { ...food };
                if (tmp.category === "dessert" && foodsCache[tmp._id]) {
                    tmp.complete = foodsCache[tmp._id].complete;
                }
                return tmp;
            });           
            setFoods(updatedCache);
        } else {
            setFoods(orderData.foods);
        }
    }, [orderData]);

    // manage foods cache
    useEffect(() => {
        const hasDesserts = foods.filter(food => food.category === "dessert").length > 0;
        if (!hasDesserts) localStorage.removeItem(`orderBarFoods-${orderData._id}`);
        else {
            const tmp = {};
            foods.filter(food => food.category === "dessert").forEach(dessert => tmp[dessert._id] = dessert);
            localStorage.setItem(`orderBarFoods-${orderData._id}`, JSON.stringify(tmp));
        }
    }, [foods]);

    // manage drinks cache
    useEffect(() => {
        if (!drinks.length) localStorage.removeItem(`orderDrinks-${orderData._id}`);
        else {
            const tmp = {};
            drinks.forEach(drink => tmp[drink._id] = drink);
            localStorage.setItem(`orderDrinks-${orderData._id}`, JSON.stringify(tmp))
        };
    }, [drinks]);

    const hasItemsToDisplay = drinks.length || foods.some(food => food.category === "dessert");
    if (!hasItemsToDisplay) return null;

    /**
     * CLICK event handler for checkboxes/radios and their corresponding labels.
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
        ["orderDrinks-", "orderBarFoods-"].forEach(prefix => {
            localStorage.removeItem(`${prefix}${orderData._id}`);
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

    return (
        <div className={styles["order-container"]} style={{ backgroundColor }}>
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
    );
}

export default Order;

