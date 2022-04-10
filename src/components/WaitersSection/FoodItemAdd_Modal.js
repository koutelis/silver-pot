import React, { useState, useEffect } from "react";
import { Button, Input, ModalWindow } from "components/generic.js";
import { FOODS as defaults } from "store/config.js";
import { cloneObject } from "store/utils.js";
import OptionsCheckBoxes from "components/WaitersSection/OptionsCheckBoxes.js";
import styles from "styles/WaitersSection.module.css";

const FoodItemAdd_Modal = (props) => {
    const [visible, setVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const { foodData, onClose, onAddToMenu } = props;

    const { basePrice, category, description, name, addons, removables } = foodData ?? cloneObject(defaults.foodData);

    // runs only the first time to populate the options (addons, removables and comments)
    useEffect(() => {
        setVisible(Boolean(foodData));
        if (foodData) {
            let result = { 
                addons: addons.map(adn => { return {...adn, checked: false}; }), 
                removables: removables.map(rmv => { return {...rmv, checked: false}; }),
                comments: ""
            };
            setSelectedOptions(result);
        }
    }, [foodData]);

    /**
     * Reset all inputs.
     */
     const resetFormData = () => {
        setSelectedOptions({});
        setVisible(false);
    }

    const cbAddToMenu = () => {
        const foodOrder = cloneObject(foodData);
        foodOrder.addons = selectedOptions.addons.filter(adn => adn.checked)
        foodOrder.removables = selectedOptions.removables.filter(rmv => rmv.checked)
        foodOrder.comments = selectedOptions.comments

        const addonsTotalPrice = foodOrder.addons.reduce((total, current) => total + current.price, 0);
        const removablesTotalPrice = foodOrder.removables.reduce((total, current) => total + current.price, 0);
        foodOrder.totalPrice = foodOrder.basePrice + addonsTotalPrice - removablesTotalPrice;

        onAddToMenu(foodOrder);
        resetFormData();
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

    const cbCloseModal = () => {
        setSelectedOptions({});
        setVisible(false);
        onClose();
    }

    /**
     * CHANGE event handler for the options checkboxes
     */
    const cbOptionsChanged = (optionsProperty, data, index) => {
        setSelectedOptions(snapshot => {
            const newState = cloneObject(snapshot);
            newState[String(optionsProperty)][index] = data;
            return newState;
        });
    }

    if (!visible) return <></>;

    return <ModalWindow onClose={cbCloseModal} visible={visible}>
        <form className={styles["add-item-form"]} >
            <label>{category}</label>
            <label>{name}</label>
            <label>{description}</label>
            <label>{basePrice}</label>
            
            <OptionsCheckBoxes className="" groupName="Addons" propertyName="addons" selections={selectedOptions.addons} onClick={cbOptionsChanged} />
            <OptionsCheckBoxes className="" groupName="Removables" propertyName="removables" selections={selectedOptions.removables} onClick={cbOptionsChanged} />

            <Input label="Special requests" name="comments" type="text" value={selectedOptions.comments} onChange={cbInputChanged} />

            <Button type="button" onClick={cbAddToMenu} text="Add to Menu" />                    
        </form>
    </ModalWindow>
}

export default FoodItemAdd_Modal;
