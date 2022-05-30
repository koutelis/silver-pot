import React from "react";
import { toCurrency } from "store/utils.js";
import { Checkbox_Label } from "components/generic.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of MenuItemOrder_Modal.js
 * @param {Object} props { onCheckboxChange: function, options: Object }
 * @returns {JSX}
 */
const FoodOptions = (props) => {
    const { onCheckboxChange, options } = props;

    return (
        <>
            <OptionsGroup 
                className={styles["food-addons"]}
                type="checkbox" 
                groupName="Select Addons" 
                propertyName="addons" 
                selections={options.addons} 
                onClick={onCheckboxChange} 
            />
            <OptionsGroup 
                className={styles["food-removables"]}
                type="checkbox" 
                groupName="Select Removables" 
                propertyName="removables" 
                selections={options.removables} 
                onClick={onCheckboxChange} 
            />
        </>
     );
}

/**
 * SUBCOMPONENT of MenuItemOrder_Modal.js
 * @param {Object} props { onRadioChange: function, options: Object }
 * @returns {JSX}
 */
 const DrinkOptions = (props) => {
    const { onRadioChange, options } = props;

    return (
        <OptionsGroup 
            type="radio" 
            groupName="Select Size"
            propertyName="sizes" 
            selections={options.sizes} 
            onClick={onRadioChange} 
        />
    )
}

/**
 * SUBCOMPONENT of FoodOptions/DrinkOptions
 * Multiple-choice group with labels for either checkboxes or radio buttons.
 * @param {Object} props { className: String, groupName: String, propertyName: String, onClick: function, selections: Object, type: String }
 * @returns {JSX}
 */
 const OptionsGroup = (props) => {
    const { className, groupName, propertyName, onClick, selections, type } = props;

    if (!selections || !selections.length) return null;

    const mask = Object.keys(selections).length ? "" : "hidden";
    const classList = [ styles["option-group"], (className ?? ""), mask ].join(" ");

    /**
     * CLICK event handler for checkboxes/radios and their corresponding labels.
     * @param {Boolean} prevCheckedStatus 
     * @param {Number} index 
     */
    const cbClick = (prevCheckedStatus, index) => {
        onClick(propertyName, !prevCheckedStatus, index);
    }
    
    return (
        <div className={styles["option-group-container"]}>
            <div>{groupName}</div>
            <div className={classList}>
                {selections.map((selection, index) => {
                    const { checked, name, price } = selection;
                    return (
                        <Checkbox_Label 
                            key={index} 
                            type={type} 
                            name={name} 
                            value={price} 
                            checked={checked} 
                            label={`${name} - ${toCurrency(price)}`}
                            onClick={() => cbClick(checked, index)} 
                        />
                    );
                })}
            </div>
        </div>
     );
}

export { FoodOptions, DrinkOptions };