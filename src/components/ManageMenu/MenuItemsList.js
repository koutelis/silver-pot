import React from "react";
import MenuItem from "components/ManageMenu/MenuItem.js";
import styles from "styles/ManageMenu.module.css";

/**
 * Container of menu items
 * @param {Object} props - { itemsData: Object, onItemClick: function, onDeleteItem: function }
 * @returns {JSX}
 */
const MenuItemsList = (props) => {
    const { itemsData, onItemClick, onDeleteItem } = props;

    if (itemsData.length === 0) return <div className={styles["item-list-container2"]} >
        <h3>No options found...</h3>
    </div>

    return <div className={styles["item-list-container"]} >
        <h3>Available Options:</h3>
        <div className={styles["item-list"]} >
            {itemsData.map(food => 
                <MenuItem 
                    key={food._id} 
                    itemData={food} 
                    onClick={() => onItemClick(food._id)} 
                    onDelete={onDeleteItem} 
                />)
            }
        </div>
    </div>
}

export default MenuItemsList
