import React, { useState, useEffect } from "react";
import { Button, TextArea, ModalWindow, ModalWindow_2 } from "components/generic.js";
import { cloneObject } from "store/utils.js";
import { FoodOptions, DrinkOptions } from "components/WaitersSection/MenuItemOptions.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props { menuItem: Object, menuItemType: String, mode: String, onClose: function, onMenuItemAdd: function, onMenuItemEdit: function, onMenuItemRemove: function }
 * @returns {JSX}
 */
const MenuItemOrder_Modal = (props) => {
    const [visible, setVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const { menuItem, menuItemType, mode, onClose, onMenuItemAdd, onMenuItemEdit, onMenuItemRemove } = props;

    // runs only the first time to populate the options (addons/removables/sizes/comments)
    useEffect(() => {
        setVisible(Boolean(menuItem));
        if (!menuItem) return;
        setSelectedOptions(() => prepareMenuItemOptions());
    }, [menuItem, menuItemType]);

    // runs when the options change to set the correct total price
    useEffect(() => {
        if (!menuItem) return;
        setTotalPrice(() => calcTotalPrice());

    }, [selectedOptions]);

    /**
     * Helper of 1st useEffect.
     * Populates the menu item's available options (addons/removables/sizes/comments)
     * @returns {Object} where each of its properties has an Array of options as value
     */
    const prepareMenuItemOptions = () => {
        if (menuItemType === "foods") {
            if (mode === "add") {
                const { addons, removables } = menuItem;
                return { 
                    addons: addons.map(adn => { return {...adn, checked: false}; }), 
                    removables: removables.map(rmv => { return {...rmv, checked: false}; }),
                    comments: ""
                };
            } else {
                const { addons, removables, comments } = menuItem;
                return { addons, removables, comments };
            }
        }
        else {
            if (mode === "add") {
                const { basePrice, sizes } = menuItem;
                const defaultSize = {name: 'default', price: basePrice, checked: false};
                let providedSizes = sizes.map(size => { return {...size, checked: false}; });
                let availableSizes = providedSizes.length ? [] : [ defaultSize ];
                availableSizes = availableSizes.concat(sizes.map(size => { return {...size, checked: false}; }));
                availableSizes[0].checked = true;
                return {
                    sizes: availableSizes,
                    comments: ""
                };
            } else {
                const { sizes, comments } = menuItem;
                return { sizes, comments };
            }
        };
    }

    /**
     * Helper of 2nd useEffect.
     * Calculates the menu item's total price according to selected options.
     * @returns {Number} Float
     */
    const calcTotalPrice = () => {
        if (menuItemType === "foods") {
            const addonsTotalPrice = selectedOptions.addons.reduce((total, current) => {
                return (current.checked) ? total + current.price : total;
            }, 0);
            const removablesTotalPrice = selectedOptions.removables.reduce((total, current) => {
                return (current.checked) ? total + current.price : total;
            }, 0);
            
            return basePrice + addonsTotalPrice - removablesTotalPrice;
        } else {
            return selectedOptions.sizes.filter(size => size.checked)[0].price;
        }
    }

    /**
     * CHANGE event handler for all inputs
     * @param {Event} e 
     */
     const cbInputChanged = (e) => {
        const { name: property, value } = e.target;
        setSelectedOptions(snapshot => {
            return {
                ...snapshot,
                [property]: value
            }
        });
    }

    /**
     * CHANGE event handler for the options checkboxes
     */
    const cbOptionsChanged_cbx = (optionsProperty, isChecked, index) => {
        setSelectedOptions(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)][index].checked = isChecked;
            return newState;
        });
    }
    
    /**
     * CHANGE event handler for the options radiogroup
     */
     const cbOptionsChanged_radio = (optionsProperty, isChecked, optionIndex) => {
        setSelectedOptions(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].forEach((size, index) => size.checked = (index === optionIndex));
            return newState;
        });
    }

    /**
     * CLICK event callback for closing this modal. 
     */
    const cbCloseModal = () => {
        setSelectedOptions({});
        setVisible(false);
        onClose();
    }

    /**
     * Callback handler for the delete item button
     */
    const cbRemoveItem = () => {
        setVisible(false);
        onMenuItemRemove(menuItemType, menuItem._id);
    }

    /**
     * Callback handler for the submit (add/save) button
     */
    const cbSubmit = () => {
        const itemOrder = {
            ...menuItem,
            ...selectedOptions,
            totalPrice
        }
        
        const dispatch = (mode === "add") ? onMenuItemAdd : onMenuItemEdit;
        dispatch(menuItemType, itemOrder);
        setSelectedOptions({});
        setVisible(false);
    }

    if (!visible) return null;

    const { basePrice, category, description, name } = menuItem;
    const form = <form className={styles["add-item-form"]} >
        <div className={styles["add-item-form__main-data"]}>
            <div>
                <label htmlFor="category">Category</label>
                <span name="category">{category}</span>
            </div>
            <div>
                <label htmlFor="name">name</label>
                <span name="name">{name}</span>
            </div>
            <div>
                <label htmlFor="description">description</label>
                <span name="description">{description ?? "-"}</span>
            </div>
            <div>
                <label htmlFor="basePrice">basePrice</label>
                <span name="basePrice">{basePrice}</span>
            </div>
            <div>
                <label htmlFor="totalPrice">totalPrice</label>
                <span name="totalPrice">{totalPrice}</span>
            </div>
        </div>

        {
            (menuItemType === "foods")
                ? <FoodOptions onCheckboxChange={cbOptionsChanged_cbx} options={selectedOptions} />
                : <DrinkOptions onRadioChange={cbOptionsChanged_radio} options={selectedOptions} /> 
        }

        <TextArea 
            label="Comments" 
            name="comments" 
            value={selectedOptions.comments} 
            onChange={cbInputChanged} 
            placeholder="special requests"
            type="text"
        />
        {(mode === "edit") && <Button type="button" onClick={cbRemoveItem} text="Remove" />}
        <Button 
            type="button" 
            onClick={cbSubmit} 
            text={(mode === "add") ? "Add to Menu" : "Save Changes"} 
        />
    </form>

    return (mode === "add")
        ? <ModalWindow onClose={cbCloseModal} visible={visible}> {form} </ModalWindow>
        : <ModalWindow_2 onClose={cbCloseModal} visible={visible}> {form} </ModalWindow_2>
}

export default MenuItemOrder_Modal;
