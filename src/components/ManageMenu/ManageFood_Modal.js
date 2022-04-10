import React, { useState, useEffect } from "react";
import { FOODS as defaults } from "store/config.js";
import { foodsRequests } from "store/http-requests.js";
import { cloneObject } from "store/utils.js";
import { Button, ModalWindow } from "components/generic.js";
import InputMenuItemData from "components/ManageMenu/InputMenuItemData.js";
import InputMenuItemOptions from "components/ManageMenu/InputMenuItemOptions.js";
import styles from "styles/ManageMenu_Modal.module.css";

/**
 * MODAL for adding/editing a 'food' menu option.
 * Parent container of all components in the ModalManageMenuItem group, child of ManageFoods.js
 * @param {Object} props { visible: Boolean, closeButtonHandler: function, submitButtonHandler: function, selectedFoodId: String }
 * @returns {JSX}
 */
const ModalManageMenuItem = (props) => {
    const { visible, closeButtonHandler, submitButtonHandler, selectedFoodId, selectedCategory } = props;
    const [foodData, setFoodData] = useState( cloneObject(defaults.foodData) );
    const [optionsVisibility, setOptionsVisibility] = useState({ addons: false, removables: false })

    // reset form inputs and preselect category according to category filter (from ManageFoods.js)
    useEffect(async () => {
        if (selectedFoodId) {
            const data = await foodsRequests.get(selectedFoodId);
            const {_id, timeRanges, ...usefullData} = data;

            setOptionsVisibility({
                addons: usefullData.addons.length > 0,
                removables: usefullData.removables.length > 0,
            })
            setFoodData(usefullData);
        } else resetFormData();
    }, [selectedFoodId, selectedCategory])

    /**
     * Reset all inputs.
     */
    const resetFormData = () => {
        setOptionsVisibility({
            addons: false,
            removables: false,
        })
        setFoodData({
            ...cloneObject(defaults.foodData),
            category: selectedCategory
        });
    }

    const cbFoodDataChanged = (data) => {
        const { property, value } = data;
        setFoodData(snapshot => {
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
        setFoodData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)][index] = data;
            return newState;
        });
    }

    const cbAddOption = (optionsProperty) => {
        setFoodData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].push(cloneObject(defaults[String(optionsProperty)]));
            return newState;
        });
    }

    const cbRemoveOption = (optionsProperty, index) => {
        setFoodData(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)].splice(index, 1);
            return newState;
        });
    }

    const cbCloseModal = () => {
        resetFormData();
        closeButtonHandler();
    }

    /**
     * CLICK event handler for the 'submit' button.
     * If valid: POST food to DB, reset inputs and close modal (through parent)
     * else: display informative message and keep modal open.
     * @param {Event} e
     */
    const cbButtonSubmit = (e) => {
        e.preventDefault();

        const isValid = Boolean(foodData.name) && Boolean(foodData.basePrice);
        if (!isValid) {
            alert("missing content");
            return;
        }

        // filter optional data and set empty prices to zero
        foodData.addons = Object
            .values(foodData.addons)
            .filter(adn => Boolean(adn) && Boolean(adn.name))
            .map(adn => {
                if (!adn.price) adn.price = "0";
                return adn;
            });
        foodData.removables = Object
            .values(foodData.removables)
            .filter(rmv => Boolean(rmv) && Boolean(rmv.name))
            .map(rmv => {
                if (!rmv.price) rmv.price = "0";
                return rmv;
            });

        submitButtonHandler(selectedFoodId, foodData);
        resetFormData();
    }

    const btnText = selectedFoodId ? "Save" : "Add"

    return <ModalWindow onClose={cbCloseModal} visible={visible} >
        <form className={styles["add-item-form"]} >
            <InputMenuItemData 
                itemData={foodData}
                heading="Food data"
                categories={defaults.categories}
                onChange={cbFoodDataChanged} 
            />
            <InputMenuItemOptions
                visible={optionsVisibility.addons}
                optionsList={foodData.addons}
                optionsProperty="addons"
                optionName="addon"
                priceLabel="added cost (&euro;)"
                btnLabel="+1 addon"
                onSelect={cbToggleVisibility}
                onChange={cbOptionDataChanged}
                onAdd={cbAddOption}
                onRemove={cbRemoveOption}
            />
            <InputMenuItemOptions 
                visible={optionsVisibility.removables}
                optionsList={foodData.removables}
                optionsProperty="removables"
                optionName="removable"
                priceLabel="discount (&euro;)"
                btnLabel="+1 removable"
                onSelect={cbToggleVisibility}
                onChange={cbOptionDataChanged}
                onAdd={cbAddOption}
                onRemove={cbRemoveOption}
            />
            <Button onClick={cbButtonSubmit} text={btnText} />                    
        </form>
    </ModalWindow>
}

export default ModalManageMenuItem