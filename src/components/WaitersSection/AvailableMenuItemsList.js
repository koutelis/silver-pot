import React, { useState, useEffect } from "react";
import { FOODS, DRINKS } from "store/config.js";
import { cloneObject } from "store/utils";
import { AvailableMenuItem } from "components/WaitersSection/MenuItem.js";
import styles from "styles/WaitersSection.module.css";

const Navigation = (props) => {
    const { itemsType, filter, menuItems, onClick } = props;

    const defaultCategories = cloneObject( ((itemsType === "foods") ? FOODS : DRINKS).categories );
    defaultCategories.none = { label: "ALL" };

    const items = menuItems[itemsType];
    const itemsNav = ["none"].concat(
        Object
            .keys(items)
            .filter(category => items[category].length)
    ).map(category => {
        const activeMask = filter === category ? styles["active"] : "";
        const classList = [styles["categories-nav--link"], activeMask].join(" "); 
        return (
            <div 
                key={category}
                id={category}
                className={classList}
                onClick={onClick}
            >
                {defaultCategories[category].label}
            </div>
        );
    });

    return (
        <div className={styles["categories-nav"]}>
            {itemsNav}
        </div>
    );
}

const ItemsList = (props) => {
    const { itemsType, menuItems, onSelect } = props;
    let filter = props.filter;

    const items = menuItems[itemsType];
    const defaults = (itemsType === "foods") ? FOODS : DRINKS;
    const categories = (filter === "none") ? Object.keys(defaults.categories) : [filter];

    /**
     * Helper of prepareItemsList().
     * @param {Array} categorizedList 
     * @returns {JSX[]}
     */
    const populateMenuItems = (categorizedList) => {
        return categorizedList.map(item => (
            <AvailableMenuItem 
                key={item._id}
                itemData={item}
                itemType={itemsType} 
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
            return (
                <div className={styles["menu-category-heading"]}>
                    ~ {title} ~
                </div>
            );
        }
    }

    const itemsList = categories.map(category => {
        const categorizedList = items[category];
        if (!categorizedList || !categorizedList.length) return;

        return (
            <div key={category}>
                {getMenuItemsHeading(defaults.categories[category].label)}
                <div>{populateMenuItems(categorizedList)}</div>
            </div>
        );
    });

    return (
        <div className={styles["item-list-container"]}>
            <div className={styles["item-list"]}>
                {itemsList.length ? itemsList : <h2>No {itemsType} found...</h2>}
            </div>
        </div>
    );
}

/**
 * SUBCOMPONENT of WaitersSection.js
 * Contains a list of menu items (either foods or drinks).
 * @param {Object} props { itemsType: String, menuItems: Object, onSelect: function }
 * @returns {JSX}
 */
const AvailableMenuItemsList = (props) => {
    const { itemsType, menuItems, onSelect } = props;
    const [ filter, setFilter ] = useState("none");

    const foodMenuExists = Object.keys(menuItems.foods).length > 0;
    if (itemsType === "foods" && !foodMenuExists) return ( 
        <h2 className={styles["title"]}>
            A menu has not been set for today...
        </h2>
     );

    useEffect(() => {
        const defaults = (itemsType === "foods") ? FOODS : DRINKS;
        const filterExists = Object.keys(defaults.categories).includes(filter);
        const filterContainsItems = filter === "none" || Boolean(menuItems[itemsType][filter]?.length);
        if (!filterExists || !filterContainsItems) setFilter("none");
    }, [itemsType]);

    const cbCategoryChange = (e) => {
        setFilter(e.target.id);
    }

    return (
        <div>
            <Navigation 
                itemsType={itemsType}
                filter={filter}
                menuItems={menuItems}
                onClick={cbCategoryChange}
            />

            <ItemsList
                itemsType={itemsType}
                filter={filter}
                menuItems={menuItems}
                onSelect={onSelect}
            />
        </div>
    );
}

export default AvailableMenuItemsList;
