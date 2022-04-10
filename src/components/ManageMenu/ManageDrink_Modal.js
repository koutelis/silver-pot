import React, { useState, useEffect } from "react";
import { DRINKS as defaults } from "store/config.js";
import { drinksRequests } from "store/http-requests.js";
import { cloneObject } from "store/utils.js";
import { Button, ModalWindow } from "components/generic.js";
import InputMenuItemData from "components/ManageMenu/InputMenuItemData.js";
import InputMenuItemOptions from "components/ManageMenu/InputMenuItemOptions.js";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * MODAL for adding/editing a 'drink' menu option.
 * Child of ManageDrinks.js
 * @param {Object} props { visible: Boolean, closeButtonHandler: function, submitButtonHandler: function, selectedDrinkId: String }
 * @returns {JSX}
 */
const ManageDrink_Modal = (props) => {
    const { visible, closeButtonHandler, submitButtonHandler, selectedDrinkId, selectedCategory } = props;
    const [drinkData, setDrinkData] = useState( cloneObject(defaults.drinkData) );
    const [optionsVisibility, setOptionsVisibility] = useState({ sizes: false })

    // reset form inputs and preselect category according to category filter (from ManageDrinks.js)
    useEffect(async () => {
        if (selectedDrinkId) {
            const data = await drinksRequests.get(selectedDrinkId);
            const {category, name, description, basePrice, sizes} = data;
            setOptionsVisibility({ sizes: sizes.length > 0 });
            setDrinkData({category, name, description, basePrice, sizes});
        } else resetFormData();
    }, [selectedDrinkId, selectedCategory])

    /**
     * Reset all inputs.
     */
    const resetFormData = () => {
        setOptionsVisibility({ sizes: false })
        setDrinkData({
            ...cloneObject(defaults.drinkData),
            category: selectedCategory
        });
    }

    const cbDrinkDataChanged = (data) => {
        const { property, value } = data;
        setDrinkData(snapshot => {
            return {
                ...snapshot,
                [property]: value
            }
        });
    }  
    
    const cbToggleVisibility = (optionName) => {
        setOptionsVisibility(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionName)] = !newState[optionName]
            return newState;
        })
    }

    const cbOptionDataChanged = (optionsProperty, data, index) => {
        setDrinkData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)][index] = data;
            return newState;
        });
    }

    const cbAddOption = (optionsProperty) => {
        setDrinkData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].push(cloneObject(defaults[String(optionsProperty)]));
            return newState;
        });
    }

    const cbRemoveOption = (optionsProperty, index) => {
        setDrinkData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].splice(index, 1);
            return newState;
        });
    }

    /**
     * CLICK event handler for the 'submit' button.
     * If valid: POST drink to DB, reset inputs and close modal (through parent)
     * else: display informative message and keep modal open.
     * @param {Event} e
     */
    const cbButtonSubmit = (e) => {
        e.preventDefault();
        const isValid = Boolean(drinkData.name);
        if (!isValid) {
            alert("missing content");
            return;
        }
        
        // filter optional data and set empty prices to zero
        drinkData.sizes = Object
            .values(drinkData.sizes)
            .filter(size => Boolean(size) && Boolean(size.name))
            .map(size => {
                if (!size.price) size.price = "0";
                return size;
            });

        // override base price if sizes exist
        if (drinkData.sizes.length || !drinkData.basePrice) drinkData.basePrice = "0";

        submitButtonHandler(selectedDrinkId, drinkData);
        resetFormData();
    }

    const cbCloseModal = () => {
        resetFormData();
        closeButtonHandler();
    }

    const btnText = selectedDrinkId ? "Save" : "Add"

    return <ModalWindow onClose={cbCloseModal} visible={visible} >
        <form className={styles["add-item-form"]} >
            <InputMenuItemData 
                itemData={drinkData}
                heading="Drink data"
                categories={defaults.categories}
                onChange={cbDrinkDataChanged} 
            />
            <InputMenuItemOptions 
                visible={optionsVisibility.sizes}
                optionsList={drinkData.sizes} 
                optionsProperty="sizes"
                optionName="size"
                priceLabel="Price (&euro;)"
                btnLabel="+1 size"
                onSelect={cbToggleVisibility} 
                onChange={cbOptionDataChanged} 
                onAdd={cbAddOption} 
                onRemove={cbRemoveOption}
            />
            <Button onClick={cbButtonSubmit} type="button" text={btnText} />
        </form>
    </ModalWindow>
}

export default ManageDrink_Modal