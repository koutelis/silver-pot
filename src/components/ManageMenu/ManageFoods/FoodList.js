import React from "react";
import FoodItem from "components/ManageMenu/ManageFoods/FoodItem.js";
import styles from "styles/ManageMenu.module.css";

/**
 * Container of 'food' items
 * @param {Object} props - { foodsData: Object, onFoodClick: function, onFoodDelete: function }
 * @returns {JSX}
 */
const FoodList = (props) => {
    const { foodsData, onFoodClick, onFoodDelete } = props;

    if (foodsData.length === 0) return <div className={styles["item-list-container2"]} >
        <h3>No options found...</h3>
    </div>

    return <div className={styles["item-list-container"]} >
        <h3>Available Options:</h3>
        <div className={styles["item-list"]} >
            {foodsData.map(food => 
                <FoodItem 
                    key={food._id} 
                    foodData={food} 
                    onClick={onFoodClick} 
                    onDelete={onFoodDelete} 
                />)
            }
        </div>
    </div>
}

export default FoodList
