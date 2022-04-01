import React, { useState, useEffect } from 'react';
import { ModalManageFood_Defaults as defaults } from 'store/defaults.js';
import { foodRequests } from 'store/http-requests.js';
import { cloneObject } from 'store/utils.js';
import { GrClose } from 'react-icons/gr';
import InputFoodData from 'components/ManageMenu/ModalManageFood/InputFoodData.js';
import InputFoodAddons from 'components/ManageMenu/ModalManageFood/InputFoodAddons.js';
import InputFoodRemovables from 'components/ManageMenu/ModalManageFood/InputFoodRemovables.js';
import styles from 'styles/ModalManageFood.module.css';

/**
 * MODAL for adding a new food menu option.
 * Parent container of all components in the ModalManageFood group, child of CreateFood
 * @param {Object} props { visible, closeButtonHandler, submitButtonHandler }
 * @returns {JSX}
 */
const ModalManageFood = (props) => {

    const { visible, closeButtonHandler, submitButtonHandler, selectedFoodId } = props;

    // state
    const [formModel, setFormModel] = useState(cloneObject(defaults.formModel));
    const [foodData, setFoodData] = useState(cloneObject(defaults.foodData));
    const [addonsData, setAddonsData] = useState(cloneObject(defaults.addonsData));
    const [removablesData, setRemovablesData] = useState(cloneObject(defaults.removablesData));
    const [displayAddons, setDisplayAddons] = useState(false);
    const [displayRemovables, setDisplayRemovables] = useState(false);

    useEffect(() => {
        if (selectedFoodId) foodRequests.get(selectedFoodId).then(data => fillFormData(data));
        else resetFormData();
    }, [selectedFoodId])

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
        setFoodData( cloneObject(defaults.foodData) );
        setAddonsData( cloneObject(defaults.addonsData) );
        setRemovablesData( cloneObject(defaults.removablesData) );
    }

    // multiple dispatch
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
        setFormModel({
            ...formModel,
            [attribute]: value
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
            formModel.main && Object.entries(formModel.main).every(([k, v]) => Boolean(v) || k === "size")
        );
        if (isValid) {
            formModel.id = selectedFoodId;
            submitButtonHandler(formModel);
            // resetFormData();
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

    const mask = visible ? "" : " hidden"

    return (
        <>
            <div className={`${styles["overlay"]}${mask}`} onClick={closeButtonHandler}></div>
            <div className={`${styles["add-food-window"]}${mask}`}>
                <div className={styles["btn--close-modal"]} onClick={closeButtonHandler}><GrClose /></div>
                <form className={styles["add-food-form"]} onSubmit={cbButtonSubmit}>
                    <InputFoodData foodData={foodData} onChange={cbDataChanged} />
                    <InputFoodAddons addonsData={addonsData} visible={displayAddons} onSelect={cbAddonsOnClick} onChange={cbDataChanged} />
                    <InputFoodRemovables removablesData={removablesData} visible={displayRemovables} onSelect={cbRemovablesOnClick} onChange={cbDataChanged} />
                    <button type="submit" className={styles["btn"]} >Upload</button>
                </form>
            </div>
        </>
    )
}

export default ModalManageFood