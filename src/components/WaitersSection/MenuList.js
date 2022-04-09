import React from "react";
import { FOODS as defaults } from "store/config.js";
import MenuItem from "components/CreateMenu/MenuItem.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props
 * @returns {JSX}
 */
 const MenuList = (props) => {
    const { items, visible } = props;

    const categories = Object.keys(defaults.categories);
    let result = [];

    const setCategorizedList = (items) => {
        return <div>
            {items.map(item => <MenuItem key={item._id} itemData={item} />)}
        </div>
    }

    categories.forEach(category => {
        const currentList = items[category];
        if (currentList && currentList.length) {
            result.push(<>
                <div className={styles["menu-category-heading"]}>~ {defaults.categories[category]} ~</div>
                {setCategorizedList(currentList)}
            </>);
        }
    });

    if (result.length === 0) result = <h2>A menu has not been set for today...</h2>;
    
    const mask = visible ? "" : "hidden";

    return <div className={mask}>
        {result}
    </div>
 }

export default MenuList
