import React from "react";
import { CURRENCY } from "store/config.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of MenuItemOrder_Modal.js
 * @param {Object} props { onCheckboxChange: function, options: Object }
 * @returns {JSX}
 */
const FoodOptions = (props) => {
    const { onCheckboxChange, options } = props;

    return <>
        <OptionsGroup 
            type="checkbox" 
            groupName="Select Addons" 
            propertyName="addons" 
            selections={options.addons} 
            onClick={onCheckboxChange} 
        />
        <OptionsGroup 
            type="checkbox" 
            groupName="Select Removables" 
            propertyName="removables" 
            selections={options.removables} 
            onClick={onCheckboxChange} 
        />
    </>
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

    const cbCbxClick = (e, index) => {
        onClick(propertyName, e.target.checked, index);
    }

    const cbLabelClick = (prevCheckedStatus, index) => {
        onClick(propertyName, !prevCheckedStatus, index);
    }
    
    return <div className={styles["option-group-container"]}>
        <div>{groupName}</div>
        <div className={classList}>
            {selections.map((selection, index) => {
                const { checked, name, price } = selection;
                return <div key={index}>
                    <input type={type} name={name} onChange={(e) => cbCbxClick(e, index)} value={price} checked={checked}  />
                    <label htmlFor={name} onClick={() => cbLabelClick(checked, index)}>
                        {name} - {CURRENCY.sign}{price.toFixed(2)}
                    </label>
                </div>
            })}
        </div>
    </div>
}

export { FoodOptions, DrinkOptions };