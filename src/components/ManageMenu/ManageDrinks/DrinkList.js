import React from "react";
import DrinkItem from "components/ManageMenu/ManageDrinks/DrinkItem.js";
import styles from "styles/ManageMenuItems.module.css";

/**
 * Container of 'drink' items
 * @param {Object} props - { drinksData: Object, onFoodClick: function, onFoodDelete: function }
 * @returns {JSX}
 */
const DrinkList = (props) => {
    const { drinksData, onDrinkClick, onDrinkDelete } = props;

    if (drinksData.length === 0) return <h2>No options found...</h2>

    return <>
        <h2>Available Options:</h2>
        <div className={styles["item-list"]} >
            {drinksData.map(drink => 
                <DrinkItem 
                    key={drink._id} 
                    drinkData={drink} 
                    onClick={onDrinkClick} 
                    onDelete={onDrinkDelete} 
                />)
            }
        </div>
    </>
}

export default DrinkList
