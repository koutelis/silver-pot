import React from "react";
import styles from "styles/WaitersSection.module.css";

/**
 * Generic multiple choice checkbox with labels.
 * @param {Object} props 
 * @returns {JSX}
 */
 const OptionsCheckBoxes = (props) => {
    const { className, groupName, propertyName, onClick, selections } = props;

    const cbCbxChange = (e, selection, index) => {
        const data = {
            ...selection,
            checked: e.target.checked
        }
        onClick(propertyName, data, index);
    }
    
    const mask = Object.keys(selections).length ? "" : "hidden";
    const classList = [ styles["input"], (className ?? ""), mask ].join(" ");

    return <div className={classList}>
        <p>{groupName}</p>
        {selections.map((selection, index) => {
            const { _id, checked, name, price } = selection;
            return <div key={_id}>
                <input type="checkbox" name={name} onChange={(e) => cbCbxChange(e, selection, index)} value={price} checked={checked}  />
                <label htmlFor={name}>{name} - {price.toFixed(2)}eu</label>
            </div>
        })}
    </div>
}

export default OptionsCheckBoxes;