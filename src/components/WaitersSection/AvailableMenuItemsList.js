import React from "react";
import { FOODS, DRINKS } from "store/config.js";
import MenuItem from "components/WaitersSection/MenuItem.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * Contains a list of menu items (either foods or drinks).
 * @param {Object} props
 * @returns {JSX}
 */
 const AvailableMenuItemsList = (props) => {
    const { itemsType, menuItems, onSelect } = props;

    const defaults = (itemsType === "foods") ? FOODS : DRINKS;
    const items = (itemsType === "foods") ? menuItems.foods : menuItems.drinks;

    let itemsList = [];
    const categories = Object.keys(defaults.categories);
    categories.forEach(category => {
        const currentList = items[category];
        if (currentList && currentList.length) {
            itemsList.push(<div key={category}>
                <div className={styles["menu-category-heading"]}>~ {defaults.categories[category]} ~</div>
                <div>
                    {currentList.map(item => <MenuItem key={item._id} itemData={item} onClick={() => onSelect("add", itemsType, item)} />)}
                </div>
            </div>);
        }
    });

    if (itemsList.length === 0) itemsList = <h2>A menu has not been set for today...</h2>;

    return <div>
        {itemsList}
    </div>
 }

export default AvailableMenuItemsList
