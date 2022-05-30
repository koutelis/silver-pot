import React, { useState, useEffect } from "react";
import { foodsRequests } from "store/connections.js";
import { Button, DropDownList, Input, ModalWindow } from "components/generic.js";
import { FOODS as defaults } from "store/config";
import styles from "styles/CreateMenu.module.css";

/**
 * COMPONENT of CreateMenu.js
 * A modal window to add an item to the daily menu.
 * @param {Object} props - { onClose: function, onSelection: function, selectedItems: {}, visible: Boolean }
 * @returns {JSX}
 */
const MenuItemAdd_Modal = (props) => {
    const [ selectedItemId, setSelectedItemId ] = useState("");
    const [ availability, setAvailability ] = useState(10);
    const [ menuCatalogue, setMenuCatalogue ] = useState([]);
    const [ filteredOptions, setFilteredOptions ] = useState({});
    const [ filter, setFilter ] = useState("");
    const { onClose, onSelection, selectedItems, visible } = props;

    // runs only the first time to populate the items DDL options from DB
    useEffect(async () => {
        let isMounted = true;
        const fetchedFoods = await foodsRequests.getAll();
        if (isMounted) setMenuCatalogue(fetchedFoods);

        return () => { isMounted = false };
    }, []);

    // runs on changes to exlude already added items from the DDL
    useEffect(() => {
        let selectedItemsIds;
        if (filter !== "" && selectedItems[filter]) {
            selectedItemsIds = selectedItems[filter].map(item => item._id)
        } else {
            selectedItemsIds = Object
                .values(selectedItems)
                .reduce((res, arr) => res.concat(arr), [])
                .map(item => item._id);
        }

        let result = {};
        menuCatalogue
            .filter(option => filter === "" || option.category === filter)
            .filter(option => !selectedItemsIds.includes(option._id))
            .forEach(option => result[option._id] = {"label": option.name});

        setFilteredOptions(result);
    }, [menuCatalogue, filter, selectedItems]);

    const cbAvailabilityChanged = (e) => {
        setAvailability(e.target.value);
    }
    
    // set the DDL label:
    let labelText = "Select item";
    if (filter === "main") {
        labelText = `Add a main dish`;
    } else if (filter.length) {
        const article = "aeiou".includes(filter[0]) ? "an" : "a";
        labelText = `Add ${article} ${filter}`;
    }

    return (
        <ModalWindow onClose={onClose} visible={visible}>
            <form className={styles["modal-form"]} >
                <DropDownList 
                    className={styles["ddl--menu-item-add"]} 
                    hasEmpty={true} 
                    label={labelText} 
                    onChange={e => setSelectedItemId(e.target.value)} 
                    options={filteredOptions} 
                    value={selectedItemId}
                />
                <Input 
                    label="Approximate servings available" name="availability" type="number" 
                    min="1" max="1000" step="1" value={availability} onChange={cbAvailabilityChanged} 
                />
                <DropDownList 
                    className={styles["ddl--category"]} 
                    hasEmpty={true} 
                    label="Filter by Category"
                    onChange={e => setFilter(e.target.value)} 
                    options={defaults.categories} 
                    value={filter}
                />
                <Button 
                    onClick={() => onSelection(selectedItemId, availability)} 
                    text="ADD TO MENU" 
                />
            </form>
        </ModalWindow>
    );
}

export default MenuItemAdd_Modal;