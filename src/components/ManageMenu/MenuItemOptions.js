import React, { useState, useEffect } from "react";
import { CURRENCY } from "store/config.js";
import { cloneObject } from "store/utils.js";
import MenuItemOptionsForm from "components/ManageMenu/MenuItemOptionsForm.js";

/**
 * SUBCOMPONENT of ManageMenuItem_Modal.js
 * @param {Object} props 
 * @returns {JSX}
 */
export const FoodOptions = (props) => {
    const { itemData, onChange, onAdd, onRemove } = props;
    const [ optionsVisibility, setOptionsVisibility ] = useState({ addons: false, removables: false })

    // runs whenever item data change, to adjust the options' visibility
    useEffect(() => {
        if (itemData) {
            setOptionsVisibility({
                addons: itemData.addons.length > 0,
                removables: itemData.removables.length > 0,
            });
        }
    }, [itemData])

    /**
     * Callback to toggle the visibility of the food's clicked option.
     * @param {String} optionName
     */
    const cbToggleVisibility = (optionName) => {
        setOptionsVisibility(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionName)] = !newState[optionName]
            return newState;
        })
    }

    return (
        <>
            <MenuItemOptionsForm
                visible={optionsVisibility.addons}
                optionsList={itemData.addons}
                optionsProperty="addons"
                optionName="addon"
                priceLabel={`extra cost (${CURRENCY.sign})`}
                btnLabel="+1 addon"
                onSelect={cbToggleVisibility}
                onChange={onChange}
                onAdd={onAdd}
                onRemove={onRemove}
            />
            <MenuItemOptionsForm 
                visible={optionsVisibility.removables}
                optionsList={itemData.removables}
                optionsProperty="removables"
                optionName="removable"
                priceLabel={`dicount (${CURRENCY.sign})`}
                btnLabel="+1 removable"
                onSelect={cbToggleVisibility}
                onChange={onChange}
                onAdd={onAdd}
                onRemove={onRemove}
            />
        </>
    );
}

/**
 * SUBCOMPONENT of ManageMenuItem_Modal.js
 * @param {Object} props 
 * @returns {JSX}
 */
export const DrinkOptions = (props) => {
    const { itemData, onChange, onAdd, onRemove } = props;
    const [ optionsVisibility, setOptionsVisibility ] = useState({ sizes: false })

    // runs whenever item data change, to adjust the options' visibility
    useEffect(() => {
        if (itemData) setOptionsVisibility({ sizes: itemData.sizes.length > 0 });
    }, [itemData])

    /**
     * Callback to toggle the visibility of the drink's clicked option.
     * @param {String} optionName
     */
    const cbToggleVisibility = (optionName) => {
        setOptionsVisibility(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionName)] = !newState[optionName]
            return newState;
        })
    }

    return (
        <MenuItemOptionsForm 
            visible={optionsVisibility.sizes}
            optionsList={itemData.sizes} 
            optionsProperty="sizes"
            optionName="size"
            priceLabel={`Price (${CURRENCY.sign})`}
            btnLabel="+1 size"
            onSelect={cbToggleVisibility} 
            onChange={onChange} 
            onAdd={onAdd} 
            onRemove={onRemove}
        />
    );
}
