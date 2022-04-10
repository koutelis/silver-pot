import React, { useState, useEffect } from "react";
import { foodsRequests } from "store/http-requests.js";
import { Button, DropDownList, ModalWindow } from "components/generic.js";
import { FOODS as defaults } from "store/config";
import styles from "styles/CreateMenu.module.css";

/**
 * COMPONENT of CreateMenu.js
 * A modal window to add an item to the daily menu.
 * @param {Object} props - { onClose: function, onSelection: function, selectedItems: {}, visible: Boolean }
 * @returns {JSX}
 */
const MenuItemAdd_Modal = (props) => {
    const [selectedItemId, setSelectedItemId] = useState("");
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState({});
    const [filter, setFilter] = useState("");
    const { onClose, onSelection, selectedItems, visible } = props;

    // runs only the first time to populate the items DDL options
    useEffect(async () => {
        // fetch items from DB
        const fetchedItems = await foodsRequests.getAll();
        setOptions(fetchedItems);
    }, []);

    // runs when the category filter is changed
    useEffect(() => {
        let selectedItemsIds;
        if (filter !== "" && selectedItems[filter]) {
            selectedItemsIds = selectedItems[filter].map(item => item._id);
        } else {
            selectedItemsIds = Object.values(selectedItems).map(item => item._id);
        }

        let result = {};
        options
            .filter(option => filter === "" || option.category === filter)
            .filter(option => !selectedItemsIds.includes(option._id))
            .forEach(option => result[option._id] = option.name);
        setFilteredOptions(result);
    }, [options, filter, selectedItems]);

    let labelText = "Select item";
    if (filter === "main") {
        labelText = `Add a main dish`;
    } else if (filter.length) {
        const article = "aeiou".includes(filter[0]) ? "an" : "a";
        labelText = `Add ${article} ${filter}`;
    }

    return <ModalWindow onClose={onClose} visible={visible}>
        <form className={styles["modal-form"]} >
            <DropDownList 
                className={styles["ddl--menu-item-add"]} 
                hasEmpty={true} 
                label={labelText} 
                onChange={e => setSelectedItemId(e.target.value)} 
                options={filteredOptions} 
            />
            <DropDownList 
                className={styles["ddl--category"]} 
                hasEmpty={true} 
                label="Filter by Category"
                onChange={e => setFilter(e.target.value)} 
                options={defaults.categories} 
            />
            <Button 
                type="button" 
                onClick={() => onSelection(selectedItemId)} 
                text="ADD TO MENU" 
            />                    
        </form>
    </ModalWindow>
}

export default MenuItemAdd_Modal;