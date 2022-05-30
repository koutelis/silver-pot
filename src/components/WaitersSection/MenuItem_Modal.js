import React, { useState, useEffect } from "react";
import { Button, DelButton, Input, TextArea, ModalWindow } from "components/generic.js";
import { cloneObject, toCurrency } from "store/utils.js";
import { FoodOptions, DrinkOptions } from "components/WaitersSection/MenuItemOptions.js";
import styles from "styles/WaitersSection.module.css";

const MenuItemMainData = (props) => {
    const { menuItem, mode, onRemoveItem, totalPrice, quantity } = props;
    const { basePrice, category, description, name } = menuItem;

    let displayTotal = toCurrency(totalPrice);
    if (quantity > 1) displayTotal += ` x ${quantity} = ${toCurrency(totalPrice * quantity)}`;

    return (
        <div className={styles["add-item-form__data1"]}>
            <div>
                <span>[ {category} ] - {menuItem.availability} available</span>
            </div>
            <div>
                <h2>{name}</h2>
            </div>
            <div className={styles["add-item-form__data2"]}>
                <div>
                    <label htmlFor="description">description:</label>
                    <span name="description">{description ?? "-"}</span>
                </div>
                <div>
                    <label htmlFor="basePrice">regular price:</label>
                    <span name="basePrice">{toCurrency(basePrice)}</span>
                </div>
                <div>
                    <label htmlFor="totalPrice">total cost:</label>
                    <span name="totalPrice">{displayTotal}</span>
                </div>
                {
                    (mode === "edit") && 
                    <DelButton className={styles["add-item-form__del"]} 
                        onClick={onRemoveItem} tooltip={`delete ${name}`} 
                    />
                }
            </div>
        </div>
     );
}

const QuantityInput = (props) => {
    const { max, mode, onChange, value } = props;

    if (mode !== "add") return null;

    return (
        <Input 
            className="" 
            type="number" 
            min="1" max={max} step="1" value={value} 
            label="quantity" 
            name="quantity" 
            onChange={onChange} 
        />
    );
}

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props { menuItem: Object, menuItemType: String, mode: String, onClose: function, onMenuItemAdd: function, onMenuItemEdit: function, onMenuItemRemove: function }
 * @returns {JSX}
 */
const MenuItem_Modal = (props) => {
    const [ visible, setVisible ] = useState(false);
    const [ selectedOptions, setSelectedOptions ] = useState({});
    const [ itemTotalCost, setItemTotalCost ] = useState(0);
    const [ quantity, setQuantity ] = useState(1);
    const { menuItemData, menuItemType, mode, onClose, onMenuItemAdd, onMenuItemEdit, onMenuItemRemove } = props;
    const { data: menuItem, index: menuItemIndex } = menuItemData;

    // runs only the first time to populate the options (addons/removables/sizes/comments)
    useEffect(() => {
        setVisible(Boolean(menuItem));
        if (!menuItem) return;
        
        setSelectedOptions(() => prepareMenuItemOptions());
        setQuantity(1);
    }, [menuItem, menuItemType]);

    // runs when the options change to set the correct total price
    useEffect(() => {
        if (!menuItem) return;
        setItemTotalCost(() => (calcTotalPrice()));

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
                const defaultSize = {name: "default", price: basePrice, checked: false};
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
            
            return menuItem.basePrice + addonsTotalPrice - removablesTotalPrice;
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
    const cbOptionsChanged_cbx = (optionsProperty, isChecked, optionIndex) => {
        setSelectedOptions(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)][optionIndex].checked = isChecked;
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
        onMenuItemRemove(menuItemType, menuItemIndex);
    }

    /**
     * Callback handler for the submit (add/save) button
     */
    const cbSubmit = () => {
        const orderedItem = {
            ...menuItem,
            ...selectedOptions,
            totalPrice: itemTotalCost
        }

        if (mode === "add") onMenuItemAdd(menuItemType, orderedItem, quantity);
        else onMenuItemEdit(menuItemType, orderedItem, menuItemIndex);

        setVisible(false);
    }

    
    if (!visible || !menuItem) return null;

    const form = (
        <form className={styles["add-item-form"]} >
            <MenuItemMainData menuItem={menuItem} mode={mode} quantity={quantity}
                totalPrice={itemTotalCost} onRemoveItem={cbRemoveItem} 
            />
            {
                (menuItemType === "foods")
                    ? <FoodOptions onCheckboxChange={cbOptionsChanged_cbx} options={selectedOptions} />
                    : <DrinkOptions onRadioChange={cbOptionsChanged_radio} options={selectedOptions} /> 
            }
            <TextArea 
                label="Comments:" 
                name="comments" 
                value={selectedOptions.comments} 
                onChange={cbInputChanged} 
                placeholder="special requests"
                type="text"
            />

            <QuantityInput
                mode={mode}
                value={quantity}
                max={menuItem.availability ?? 10} 
                onChange={(e) => setQuantity(+e.target.value)}
            />
            
            <Button 
                className={styles["btn--add"]}
                onClick={cbSubmit} 
                text={(mode === "add") ? "Add to Menu" : "Save Changes"} 
            />
        </form>
     );

    return (
        <ModalWindow 
                    onClose={cbCloseModal} 
                    visible={visible} 
                    isClosable={mode === "add"}> 
            {form} 
        </ModalWindow>
     );
}

export default MenuItem_Modal;