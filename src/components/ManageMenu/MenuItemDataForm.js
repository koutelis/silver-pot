import React, { useState } from "react";
import { DropDownList, Input, TextArea } from "components/generic.js";
import { CURRENCY } from "store/config.js";
import styles from "styles/ManageMenu.module.css"

/**
 * SUBCOMPONENT of ManageMenuItem_Modal.js
 * @param {Object} props - {itemData: {}, heading: String, categories: {}, onChange: function}
 * @returns {JSX}
 */
const MenuItemDataForm = (props) => {
    const { itemData, heading, categories, onChange: liftStateUp } = props;
    const [ displayData, setDisplayData ] = useState(true);
    
    /**
     * CHANGE event handler for all inputs (lift state up)
     * @param {Event} e 
     */
    const cbInputChanged = (e) => {
        const { name: property, value } = e.target;
        liftStateUp({ property, value });
    }

    const mask = displayData ? "" : " hidden";

    return (
        <div className={styles["inputs__column"]}>
            <h3 className={styles["inputs__heading"]} onClick={(e) => setDisplayData(!displayData)}>{heading}</h3>
            <div className={`${styles["inputs__grid-container"]} ${mask}`}>
                <DropDownList label="Category" options={categories} 
                    value={itemData.category} onChange={cbInputChanged}
                />
                <Input name="name" label="Name" required={true} value={itemData.name} 
                    type="text" placeholder="menu item's name" onChange={cbInputChanged} 
                />
                <TextArea name="description" label="Description" value={itemData.description} 
                    type="text" placeholder="extra information" onChange={cbInputChanged} 
                />
                <Input name="basePrice" label={`Price (${CURRENCY.sign})`} value={itemData.basePrice} 
                    type="number" min="1" max="20" step="0.5" required={true} onChange={cbInputChanged} 
                />
                <Input name="posDirections" label="POS info" value={itemData.posDirections} 
                    type="text" placeholder="where to find this item in the cash-register..." onChange={cbInputChanged} 
                />
            </div>
        </div>
    )
}

export default MenuItemDataForm;