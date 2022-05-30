import React from "react";
import { MenuItem } from "components/WaitersSection/MenuItem.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of Order_Modal.js
 * @param {Object} props { itemsType: String, items: Array, onSelectL function }
 * @returns {JSX}
 */
const SelectedMenuItemsList = (props) => {
    const { itemsType, items, onSelect } = props;

    return (
        <div className={styles["selected-items-group"]}>
            <div className={styles["selected-items-group-title"]}>
                <h2>{itemsType}</h2><span>({items.length} selected)</span>
            </div>

            {items.map((item, index) => <MenuItem 
                key={item._id + index} 
                itemData={item} 
                onClick={() => onSelect("edit", itemsType, item, index)} 
            />)}
        </div>
     );
}

export default SelectedMenuItemsList;