import React from "react";
import { GrClose } from "react-icons/gr";
import styles from "styles/ManageMenuItems.module.css";

/**
 * Component of FoodList.js
 * @param {Object} props - {foodData: Object, onClick: function, onDelete: function}
 * @returns 
 */
const FoodItem = (props) => {
    const {_id, category, title, description} = props.foodData;

    return <div className={styles["menu-item"]} onClick={(e) => props.onClick(_id)} >
        <div className={styles["btn--del-item"]} onClick={(e) => { e.stopPropagation(); props.onDelete(_id) }} >
            <GrClose />
        </div>
        <fieldset>
            <legend>{category}</legend>
            <div>
                <h3>{title}</h3>
            </div>
            <div>
                <span>{description}</span>
            </div>
        </fieldset>
    </div>
}

export default FoodItem;
