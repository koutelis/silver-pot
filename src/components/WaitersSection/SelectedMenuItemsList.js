import React from "react";
import MenuItem from "components/WaitersSection/MenuItem.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of Order_Modal.js
 * @param {Object} props
 * @returns {JSX}
 */
const SelectedMenuItemsList = (props) => {
    const { itemsType, items, onSelect } = props;

    return <div className={styles["selected-items-group"]}>
        <h2>{itemsType} ({items.length} selected)</h2>
        {items.map((item, index) => <MenuItem 
            key={item._id + index} 
            itemData={item} 
            onClick={() => onSelect("edit", itemsType, item)} 
        />)}
    </div>
}

export default SelectedMenuItemsList;