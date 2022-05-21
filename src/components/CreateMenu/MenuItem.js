import React from "react";
import { toCurrency } from "store/utils.js";
import styles from "styles/CreateMenu.module.css";

/**
 * COMPONENT of DailyMenu_DnD.js
 * A single restaurant menu item.
 * @param {Object} props - { itemData: {_id: String, basePrice: Number, name: String, description: String}, fontSize: Number, isPrintView: Boolean }
 * @returns {JSX}
 */
 const MenuItem = (props) => {
    const { itemData, fontSize, isPrintView } = props;
    const {basePrice, name, description} = itemData;

    const className = isPrintView ? "" : styles["menu-item"];
    const style = isPrintView ? {fontSize: `${fontSize}px`} : null;

    return <div className={className} style={style}>
        <div>
            <h3>{name}<span> - {toCurrency(basePrice)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default MenuItem;