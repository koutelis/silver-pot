import React, { useState, useEffect } from "react";
import { FOODS as foodsDefaults, DRINKS as drinksDefaults } from "store/config.js";
import { foodsRequests, drinksRequests } from "store/connections.js";
import { cloneObject } from "store/utils.js";
import { Button, ModalWindow } from "components/generic.js";
import { FoodOptions, DrinkOptions } from "components/ManageMenu/MenuItemOptions.js";
import MenuItemDataForm from "components/ManageMenu/MenuItemDataForm.js";
import styles from "styles/ManageMenu.module.css"

/**
 * MODAL for adding/editing/deleting an item in the overall available menu.
 * Child of ManageMenuItems.js
 * @param {Object} props { visible: Boolean, cbModalClose: function, cbModalSubmit: function, selectedItemId: String }
 * @returns {JSX}
 */
const ManageMenuItem_Modal = (props) => {
    const { cbModalClose, menuItemType, selectedCategory, selectedItemId, cbModalSubmit, visible } = props;
    const defaults = (menuItemType === "foods") ? foodsDefaults : drinksDefaults;
    const requestsHandler = (menuItemType === "foods") ? foodsRequests : drinksRequests;
    const [ itemData, setItemData ] = useState( cloneObject(defaults.itemData) );

    // reset form inputs and preselect category according to category filter (from ManageMenuItems.js)
    useEffect(async () => {
        let isMounted = true;
        if (selectedItemId) {
            const data = await requestsHandler.get(selectedItemId);
            if (isMounted) setItemData({...data});
        } else resetFormData();
        return () => { isMounted = false };
    }, [selectedItemId, menuItemType, selectedCategory])

    /**
     * Reset all inputs.
     */
    const resetFormData = () => {
        setItemData({
            ...cloneObject(defaults.itemData),
            category: selectedCategory
        });
    }

    /**
     * CHANGE event handler for the main data of the current menu item
     * @param {Object} data {property: String, value: any}
     */
    const cbItemDataChanged = (data) => {
        const { property, value } = data;
        setItemData(snapshot => {
            return {
                ...snapshot,
                [property]: value
            }
        });
    }  

    /**
     * CHANGE event handler for the main data of the current menu item
     * @param {Object} data {optionsProperty: String, data: Object, index: Number}
     */
    const cbOptionDataChanged = (optionsProperty, data, index) => {
        setItemData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)][index] = data;
            return newState;
        });
    }

    /**
     * Push a new option to its relevant Array
     * @param {String} optionsProperty 
     */
    const cbAddOption = (optionsProperty) => {
        setItemData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].push(cloneObject(defaults[String(optionsProperty)]));
            return newState;
        });
    }

    /**
     * Remove an option from its relevant Array by index
     * @param {String} optionsProperty 
     */
    const cbRemoveOption = (optionsProperty, index) => {
        setItemData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].splice(index, 1);
            return newState;
        });
    }
    
    /**
     * CLICK event handler for the 'submit' button.
     * If valid: POST item to DB, reset inputs and close modal (through parent)
     * else: display informative message and keep modal open.
     * @param {Event} e
     */
    const cbButtonSubmit = (e) => {
        e.preventDefault();

        const isValid = Boolean(itemData.name);
        if (!isValid) {
            displayConfirm("missing content");
            return;
        }

        if (menuItemType === "foods") {
            itemData.addons = filterOptions(itemData.addons);
            itemData.removables = filterOptions(itemData.removables);
        } else {
            itemData.sizes = filterOptions(itemData.sizes);
        }

        cbModalSubmit(selectedItemId, itemData);
        resetFormData();
    }

    const filterOptions = (options) => {
        return Object
            .values(options)
            .filter(opt => Boolean(opt) && Boolean(opt.name))
            .map(opt => {
                if (!opt.price) opt.price = 0;
                return opt;
            });
    }

    if (!visible) return null;
    
    return (
        <ModalWindow onClose={() => cbModalClose()} visible={visible} >
            <form className={styles["add-item-form"]} >
                <MenuItemDataForm 
                    itemData={itemData}
                    heading="Item data"
                    categories={defaults.categories}
                    onChange={cbItemDataChanged} 
                />
                {
                    (menuItemType === "foods")
                        ? <FoodOptions
                            itemData={itemData} 
                            onChange={cbOptionDataChanged} 
                            onAdd={cbAddOption} 
                            onRemove={cbRemoveOption}
                        />
                        : <DrinkOptions 
                            itemData={itemData} 
                            onChange={cbOptionDataChanged} 
                            onAdd={cbAddOption} 
                            onRemove={cbRemoveOption}
                        />
                }
                <Button 
                    onClick={cbButtonSubmit} 
                    text={selectedItemId ? "Save" : "Add"} 
                />
            </form>
        </ModalWindow>
    );
}

export default ManageMenuItem_Modal