import React, { useState, useEffect } from "react";
import { ManageFood_Defaults as defaults } from "store/defaults.js";
import { foodRequests } from "store/http-requests.js";
import { cloneObject } from "store/utils.js";
import { GrClose } from "react-icons/gr";
import { Button } from "components/generic.js";
import InputFoodData from "components/ManageMenu/ManageFoods/ManageFood_Modal/InputFoodData.js";
import InputFoodAddons from "components/ManageMenu/ManageFoods/ManageFood_Modal/InputFoodAddons.js";
import InputFoodRemovables from "components/ManageMenu/ManageFoods/ManageFood_Modal/InputFoodRemovables.js";
import styles from "styles/ManageMenu_Modal.module.css";


/**
 * MODAL for adding/editing a 'food' menu option.
 * Parent container of all components in the ModalManageMenuItem group, child of ManageFoods.js
 * @param {Object} props { visible: Boolean, closeButtonHandler: function, submitButtonHandler: function, selectedFoodId: String }
 * @returns {JSX}
 */
const ModalManageMenuItem = (props) => {
    const { visible, closeButtonHandler, submitButtonHandler, selectedFoodId, selectedCategory } = props;

    const [formModel, setFormModel] = useState(cloneObject(defaults.formModel));
    const [foodData, setFoodData] = useState(cloneObject(defaults.foodData));
    const [addonsData, setAddonsData] = useState(cloneObject(defaults.addonsData));
    const [removablesData, setRemovablesData] = useState(cloneObject(defaults.removablesData));
    const [displayAddons, setDisplayAddons] = useState(false);
    const [displayRemovables, setDisplayRemovables] = useState(false);

    // reset form inputs and preselect category according to category filter (from ManageFoods.js)
    useEffect(() => {
        if (selectedFoodId) foodRequests.get(selectedFoodId).then(data => fillFormData(data));
        else resetFormData();
    }, [selectedFoodId, selectedCategory])

    /**
     * Helper of useEffect.
     * Fill form data when function gets a valid foodId.
     * @param {Object} data 
     */
    const fillFormData = (data) => {
        const {category, title, description, basePrice, size, addons, removables} = data;
        
        // set food data
        setFoodData({category, title, description, basePrice, size});

        // set addons
        const newAddonsData = cloneObject(defaults.addonsData);
        for (let i = 0; i < addons.length; i++) {
            newAddonsData[`addon${i + 1}`] = addons[i]
        }
        setAddonsData(newAddonsData);

        // set removables
        const newRemovablesData = cloneObject(defaults.removablesData);
        for (let i = 0; i < removables.length; i++) {
            newRemovablesData[`removable${i + 1}`] = removables[i]
        }
        setRemovablesData(newRemovablesData);
    }

    /**
     * Reset all inputs.
     */
    const resetFormData = () => {
        setFoodData({
            ...cloneObject(defaults.foodData),
            category: selectedCategory
        });

        setAddonsData( cloneObject(defaults.addonsData) );
        setDisplayAddons(false);

        setRemovablesData( cloneObject(defaults.removablesData) );
        setDisplayRemovables(false);
    }

    // multiple dispatch for cbDataChanged()
    const attributeDataHandlers = {
        "main": setFoodData,
        "addons": setAddonsData,
        "removables": setRemovablesData
    }

    /**
     * CHANGE event handler for all children inputs.
     * @param {Object} data {attribute: ("main", "addons", "removables"), value: any}.
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
     * If valid: POST food to DB, reset inputs and close modal (through parent)
     * else: display informative message and keep modal open.
     * @param {Event} e
     */
    const cbButtonSubmit = (e) => {
        e.preventDefault();
        const isValid = Boolean(
            formModel.main && Object.entries(formModel.main).every(([k, v]) => Boolean(v) || k === "description" || k === "size")
        );
        if (isValid) {
            formModel.id = selectedFoodId;
            submitButtonHandler(formModel);
            resetFormData();
        } else {
            alert("missing content");
        }
    }

    const cbAddonsOnClick = () => {
        setDisplayAddons(!displayAddons);
    }

    const cbRemovablesOnClick = () => {
        setDisplayRemovables(!displayRemovables);
    }

    const cbCloseModal = () => {
        resetFormData();
        closeButtonHandler();
    }

    const mask = visible ? "" : " hidden"
    const btnText = selectedFoodId ? "Save" : "Add"

    return (
        <>
            <div className={`${styles["overlay"]}${mask}`} onClick={cbCloseModal}></div>
            <div className={`${styles["add-item-window"]}${mask}`}>
                <div className={styles["btn--close-modal"]} onClick={cbCloseModal}><GrClose /></div>
                <form className={styles["add-item-form"]} >
                    <InputFoodData foodData={foodData} onChange={cbDataChanged} />
                    <InputFoodAddons addonsData={addonsData} visible={displayAddons} onSelect={cbAddonsOnClick} onChange={cbDataChanged} />
                    <InputFoodRemovables removablesData={removablesData} visible={displayRemovables} onSelect={cbRemovablesOnClick} onChange={cbDataChanged} />
                    <Button type="button" onClick={cbButtonSubmit} text={btnText} />                    
                </form>
            </div>
        </>
    )
}

export default ModalManageMenuItem