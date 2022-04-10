import React, { useState } from "react";
import { FOODS as defaults } from "store/config.js";
import FoodItem from "components/WaitersSection/FoodItem.js";
import FoodItemAdd_Modal from "components/WaitersSection/FoodItemAdd_Modal.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props
 * @returns {JSX}
 */
 const FoodList = (props) => {
    const [ selectedFood, setSelectedFood ] = useState(null);
    const { items, onSelect: liftStateUp } = props;

    const cbAddFoodToMenu = (foodOrder) => {
        setSelectedFood(null);
        liftStateUp(foodOrder);
    }

    let foodList = [];
    const categories = Object.keys(defaults.categories);
    categories.forEach(category => {
        const currentList = items[category];
        if (currentList && currentList.length) {
            foodList.push(<>
                <div className={styles["menu-category-heading"]}>~ {defaults.categories[category]} ~</div>
                <div>
                    {currentList.map(item => <FoodItem key={item._id} foodData={item} onClick={() => setSelectedFood(item)} />)}
                </div>
            </>);
        }
    });

    if (foodList.length === 0) foodList = <h2>A menu has not been set for today...</h2>;

    return <div>
        {foodList}
        <FoodItemAdd_Modal 
            foodData={selectedFood}
            onClose={() => setSelectedFood(null)} 
            onAddToMenu={cbAddFoodToMenu} />
    </div>
 }

export default FoodList
