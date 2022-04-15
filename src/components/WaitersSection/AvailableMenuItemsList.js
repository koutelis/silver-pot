import React, { useState, useEffect } from "react";
import { FOODS, DRINKS } from "store/config.js";
import { cloneObject } from "store/utils";
import MenuItem from "components/WaitersSection/MenuItem.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * Contains a list of menu items (either foods or drinks).
 * @param {Object} props
 * @returns {JSX}
 */
 const AvailableMenuItemsList = (props) => {
    const { itemsType, menuItems, onSelect } = props;
    const [filter, setFilter] = useState("none");
    const [itemsNavHtml, setItemsNavHtml] = useState(null);
    const [itemsHtml, setItemsHtml] = useState(null);

    // runs whenever there are changes to set the view
    useEffect(() => {
        setItemsNavHtml( prepareItemsNavigation() );
        setItemsHtml( prepareItemsList() );
    }, [itemsType, filter, menuItems]);

    /**
     * Helper of useEffect.
     * Set the navigation bar that filters menu items.
     * @returns {JSX}
     */
    const prepareItemsNavigation = () => {
        const defaultCategories = cloneObject( ((itemsType === "foods") ? FOODS : DRINKS).categories );
        defaultCategories.none = "ALL";
        const items = (itemsType === "foods") ? menuItems.foods : menuItems.drinks;
        const itemsNav = ["none"].concat(
            Object
                .keys(items)
                .filter(category => items[category].length)
            ).map(category => {
                const activeMask = filter === category ? styles["active"] : "";
                const classList = [styles["categories-nav--link"], activeMask].join(" "); 
                return <div 
                    key={category}
                    id={category}
                    className={classList}
                    onClick={(e) => setFilter(e.target.id)}>
                        {defaultCategories[category]}
                </div>;
            });

        return itemsNav;
    }

    /**
     * Helper of useEffect.
     * Set the list of menu items to be displayed according to filters.
     * @returns {JSX}
     */
    const prepareItemsList = () => {
        const defaults = (itemsType === "foods") ? FOODS : DRINKS;
        const isFilterValid = filter === "none" || Object.keys(defaults.categories).includes(filter);

        if (!isFilterValid) {
            setFilter("none");
            return [];
        }
        
        const categories = (filter === "none") ? Object.keys(defaults.categories) : [filter];
        const items = (itemsType === "foods") ? menuItems.foods : menuItems.drinks;

        const itemsList = categories.map(category => {
            const categorizedList = items[category];
            if (!categorizedList || !categorizedList.length) return;

            return <div key={category}>
                {getMenuItemsHeading(defaults.categories[category])}
                <div>{populateMenuItems(categorizedList)}</div>
            </div>;
        });

        return itemsList.length ? itemsList : <h2>A menu has not been set for today...</h2>;
    }

    /**
     * Helper of prepareItemsList().
     * @param {Array} categorizedList 
     * @returns {JSX[]}
     */
    const populateMenuItems = (categorizedList) => {
        return categorizedList.map(item => (
            <MenuItem 
                key={item._id} itemData={item} 
                onClick={() => onSelect("add", itemsType, item)} 
            />
        ));
    }

    /**
     * Helper of prepareItemsList().
     * @param {String} title 
     * @returns {JSX}
     */
    const getMenuItemsHeading = (title) => {
        if (filter === "none") {
            return <div className={styles["menu-category-heading"]}>
                ~ {title} ~
            </div>
        }
    }

    return <div>
        <div className={styles["categories-nav"]}>
            {itemsNavHtml}
        </div>
        <div className={styles["item-list-container"]}>
            <div className={styles["item-list"]}>
                {itemsHtml}
            </div>
        </div>
    </div>
 }

export default AvailableMenuItemsList;
