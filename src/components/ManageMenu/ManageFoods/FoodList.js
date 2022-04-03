import React from "react";
import FoodItem from "components/ManageMenu/ManageFoods/FoodItem.js";
import styles from "styles/ManageMenuItems.module.css";

/**
 * Container of 'food' items
 * @param {Object} props - { foodsData: Object, onFoodClick: function, onFoodDelete: function }
 * @returns {JSX}
 */
const FoodList = (props) => {
    const { foodsData, onFoodClick, onFoodDelete } = props;

    if (foodsData.length === 0) return <h2>No options found...</h2>

    return <>
        <h2>Available Options:</h2>
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
    </>
}

export default FoodList
