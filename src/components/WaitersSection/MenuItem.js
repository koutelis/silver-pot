import React from "react";
import { toCurrency } from "store/utils.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of MenuItemsList.js
 * @param {Object} props - {itemData: Object, onClick: function}
 * @returns {JSX}
 */
const MenuItem = (props) => {
    const { itemData, onClick } = props;
    const { basePrice, name, description, totalPrice } = itemData;

    return <div className={styles["menu-item"]} onClick={onClick}>
        <div>
            <h3>{name}<span> {toCurrency(totalPrice ?? basePrice)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default MenuItem;