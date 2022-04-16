import React from "react";
import { CURRENCY } from "store/config.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of MenuItemsList.js
 * @param {Object} props - {itemData: Object, onClick: function}
 * @returns {JSX}
 */
const MenuItem = (props) => {
    const { itemData, onClick } = props;
    const { basePrice, name, description, totalPrice } = itemData;
    console.log(itemData);

    return <div className={styles["menu-item"]} onClick={onClick}>
        <div>
            <h3>{name}<span> {CURRENCY.sign}{(totalPrice ?? basePrice).toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default MenuItem;