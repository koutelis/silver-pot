import React from "react";
import { CURRENCY } from "store/config.js";
import styles from "styles/WaitersSection.module.css";

/**
 * COMPONENT of MenuItemOrder_Modal.js
 * Multiple-choice group with labels for either checkboxes or radio buttons.
 * @param {Object} props 
 * @returns {JSX}
 */
 const OptionsGroup = (props) => {
    const { className, groupName, propertyName, onClick, selections, type } = props;

    if (!selections) return <></>

    const mask = Object.keys(selections).length ? "" : "hidden";
    const classList = [ styles["option-group"], (className ?? ""), mask ].join(" ");

    const cbChange = (e, index) => {
        onClick(propertyName, e.target.checked, index);
    }
    
    return <div className={classList}>
        <p>{groupName}</p>
        {selections.map((selection, index) => {
            const { checked, name, price } = selection;
            return <div key={index}>
                <input type={type} name={name} onChange={(e) => cbChange(e, index)} value={price} checked={checked}  />
                <label htmlFor={name}>{name} - {CURRENCY.sign}{price.toFixed(2)}</label>
            </div>
        })}
    </div>
}

export default OptionsGroup;