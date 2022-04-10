import React from "react";
import styles from "styles/ManageMenu.module.css";  //STEF:TODO

const FoodItem = (props) => {
    const {_id, basePrice, name, description} = props.foodData;

    return <div className={styles["menu-item"]} onClick={props.onClick}>
        <div>
            <h3>{name}<span> €{basePrice.toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default FoodItem;
