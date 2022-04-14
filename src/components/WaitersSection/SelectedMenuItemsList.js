import React from "react";
import MenuItem from "components/WaitersSection/MenuItem.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props
 * @returns {JSX}
 */
const SelectedMenuItemsList = (props) => {
    const { itemsType, items, onSelect } = props;

    return <div>
        <h2>Selected {itemsType}:</h2>
        {
            (items.length === 0)
            ? <h2>None</h2>
            : items.map((item, index) => <MenuItem key={item._id + index} itemData={item} onClick={() => onSelect("edit", itemsType, item)} />)
        }
    </div>
}

export default SelectedMenuItemsList