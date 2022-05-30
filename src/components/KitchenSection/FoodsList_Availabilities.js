import React from "react";
import { Input } from "components/generic.js";
import { FOODS } from "store/config.js";
import styles from "styles/KitchenSection.module.css";

/**
 * SUBCOMPONENT of FoodsList_Availabilities
 * @param {Object} props
 * @returns {JSX}
 */
const FoodItem = (props) => {
    const { foodData, onChange } = props;
    const { availability, category, _id, name } = foodData;
    const isAvailable = availability > 0;

    const cbChange = (e) => {
        onChange(_id, category, +e.target.value);
    }

    const strikeOut = !isAvailable ? styles["unavailable"] : "";
    const classList = [styles["food-item"], styles["selectable"], strikeOut].join(" ");

    return (
        <div className={classList}>
            <div>{name}</div>
            <Input 
                title="set availability"
                name={_id} 
                type="number" min="0" step="1" 
                value={availability} 
                onChange={cbChange} 
            />
        </div>
    );
}

/**
 * SUBCOMPONENT of ManageAvailabilities.js
 * @param {Object} props
 * @returns {JSX}
 */
const FoodsList_Availabilities = (props) => {
    const { foods, onChange } = props;

    const foodMenuExists = Object.keys(foods).length > 0;
    if (!foodMenuExists) return ( <h2>A menu has not been set for today...</h2> );

    /**
     * Helper of prepareItemsList().
     * @param {Array} categorizedList 
     * @returns {JSX[]}
     */
    const populateMenuItems = (categorizedList) => {
        return categorizedList.map(food => (
            <FoodItem 
                key={food._id}
                foodData={food}
                onChange={onChange} 
            />
        ));
    }

    const categories = Object.keys(FOODS.categories);

    const itemsList = categories.map(category => {
        const categorizedList = foods[category];
        if (!categorizedList?.length) return;

        return (
            <div key={category}>
                <div className={styles["menu-category-heading"]}>
                    ~ {FOODS.categories[category].label} ~
                </div>
                <div>{populateMenuItems(categorizedList)}</div>
            </div>
        );
    });

    return (
        <div className={styles["food-list-container"]}>
            <div className={styles["food-list"]}>
                {itemsList.length ? itemsList : <h2>No foods found...</h2>}
            </div>
        </div>
    );
}

export default FoodsList_Availabilities;