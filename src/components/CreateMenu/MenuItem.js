import React from "react";
import styles from "styles/ManageMenuItems.module.css";

/**
 * Component of MenuList_DnD.js
 * @param {Object} props - { itemData: Object }
 * @returns 
 */
const MenuItem = (props) => {
    const {_id, basePrice, title, description} = props.itemData;

    return <div className={styles["menu-item"]}>
        <div>
            <h3>{title}<span> €{basePrice.toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default MenuItem;
