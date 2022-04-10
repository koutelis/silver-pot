import React from "react";
import FoodItem from "components/WaitersSection/FoodItem.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props
 * @returns {JSX}
 */
 const SelectedFoodList = (props) => {
    const { foods, onSelect } = props;

    if (foods.length === 0) return <div><h2>No menu items have been selected...</h2></div>;

    return <div>
        {foods.map((item, index) => <FoodItem key={item._id + index} foodData={item} onClick={() => onSelect(item)} />)}
    </div>
 }

export default SelectedFoodList
