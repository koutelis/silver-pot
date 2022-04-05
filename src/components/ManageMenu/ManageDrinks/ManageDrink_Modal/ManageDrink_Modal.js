import React, { useState, useEffect } from "react";
import { DRINKS as defaults } from "store/defaults.js";
import { drinkRequests } from "store/http-requests.js";
import { cloneObject } from "store/utils.js";
import { GrClose } from "react-icons/gr";
import { Button } from "components/generic.js";
import InputDrinkData from "components/ManageMenu/ManageDrinks/ManageDrink_Modal/InputDrinkData.js";
import InputDrinkSizes from "components/ManageMenu/ManageDrinks/ManageDrink_Modal/InputDrinkSizes.js";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * MODAL for adding/editing a 'drink' menu option.
 * Parent container of all components in the ManageDrink_Modal group, child of ManageDrinks.js
 * @param {Object} props { visible: Boolean, closeButtonHandler: function, submitButtonHandler: function, selectedDrinkId: String }
 * @returns {JSX}
 */
const ManageDrink_Modal = (props) => {
    const { visible, closeButtonHandler, submitButtonHandler, selectedDrinkId, selectedCategory } = props;
    
    const [formModel, setFormModel] = useState( cloneObject(defaults.formModel) );
    const [drinkData, setDrinkData] = useState( cloneObject(defaults.drinkData) );
    const [sizeData, setSizeData] = useState( cloneObject(defaults.sizeData) );

    // reset form inputs and preselect category according to category filter (from ManageDrinks.js)
    useEffect(() => {
        if (selectedDrinkId) drinkRequests.get(selectedDrinkId).then(data => fillFormData(data));
        else resetFormData();
    }, [selectedDrinkId, selectedCategory])

    /**
     * Helper of useEffect.
     * Fill form data when function gets a valid drinkId.
     * @param {Object} data 
     */
    const fillFormData = (data) => {
        const {category, title, description, basePrice, sizes} = data;

        // set drink data
        setDrinkData({category, title, description, basePrice});

        // set sizes
        const newSizeData = cloneObject(defaults.sizeData);
        Object.entries(sizes).forEach(([size, price]) => newSizeData[size] = price);
        setSizeData(newSizeData);
    }

    /**
     * Reset all inputs.
     */
    const resetFormData = () => {
        setDrinkData({
            ...cloneObject(defaults.drinkData),
            category: selectedCategory
        });

        setSizeData( cloneObject(defaults.sizeData) );
    }

    // multiple dispatch for cbDataChanged()
    const attributeDataHandlers = {
        "main": setDrinkData,
        "sizes": setSizeData
    }

    /**
     * CHANGE event handler for all children inputs.
     * @param {Object} data {attribute: ("main", "size"), value: any}.
     */
    const cbDataChanged = (data) => {
        const {attribute, value} = data;
        const cbHandler = attributeDataHandlers[attribute];
        cbHandler(value);
        setFormModel(snapshot => {
            return {
                ...snapshot,
                [attribute]: value
            }
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
        const isValid = Boolean(
            formModel.main && Object.entries(formModel.main).every(([k, v]) => Boolean(v) || k === "description" || k === "size")
        );
        if (isValid) {
            formModel.id = selectedDrinkId;
            submitButtonHandler(formModel);
            resetFormData();
        } else {
            alert("missing content");
        }
    }

    const cbCloseModal = () => {
        resetFormData();
        closeButtonHandler();
    }

    const mask = visible ? "" : " hidden"
    const btnText = selectedDrinkId ? "Save" : "Add"

    return (
        <>
            <div className={`${styles["overlay"]}${mask}`} onClick={cbCloseModal}></div>
            <div className={`${styles["add-item-window"]}${mask}`}>
                <div className={styles["btn--close-modal"]} onClick={cbCloseModal}><GrClose /></div>
                <form className={styles["add-item-form"]} >
                    <InputDrinkData drinkData={drinkData} onChange={cbDataChanged} />
                    <InputDrinkSizes sizeData={sizeData} onChange={cbDataChanged} />
                    <Button className={styles["btn"]} onClick={cbButtonSubmit} type="button" text={btnText} />
                </form>
            </div>
        </>
    )
}

export default ManageDrink_Modal