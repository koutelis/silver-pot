import React from "react";
import MenuItem from "components/ManageMenu/MenuItem.js";
import styles from "styles/ManageMenu.module.css";

/**
 * CONTAINER of menu items
 * @param {Object} props - { itemsData: Object, onItemClick: function, onDeleteItem: function }
 * @returns {JSX}
 */
const MenuItemsList = (props) => {
    const { items, onItemClick, onDeleteItem } = props;

    if (items.length === 0) return (
        <div className={`${styles["item-list-container"]} ${styles["item-list-container__empty"]}`} >
            <h3>No options found...</h3>
        </div>
    )

    return (
        <div className={styles["item-list-container"]} >
            <h3>Available Options:</h3>
            <div className={styles["item-list"]} >
                {items.map(item => 
                    <MenuItem 
                        key={item._id} 
                        itemData={item} 
                        onClick={() => onItemClick(item._id)} 
                        onDelete={onDeleteItem} 
                    />)
                }
            </div>
        </div>
    );
}

export default MenuItemsList
