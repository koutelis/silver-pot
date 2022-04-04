import React from "react";
import DrinkItem from "components/ManageMenu/ManageDrinks/DrinkItem.js";
import styles from "styles/ManageMenu.module.css";

/**
 * Container of 'drink' items
 * @param {Object} props - { drinksData: Object, onFoodClick: function, onFoodDelete: function }
 * @returns {JSX}
 */
const DrinkList = (props) => {
    const { drinksData, onDrinkClick, onDrinkDelete } = props;

    if (drinksData.length === 0) return <div className={styles["item-list-container2"]} >
        <h3>No options found...</h3>
    </div>

    return <div className={styles["item-list-container"]} >
        <h3>Available Options:</h3>
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
    </div>
}

export default DrinkList
