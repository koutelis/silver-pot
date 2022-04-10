import React, { useState } from "react";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * SUBCONTAINER component for ModalManageMenuItem CONTAINER form
 * @param {Object} props - {itemData: {}, heading: String, categories: {}, onChange: function}
 * @returns {JSX}
 */
const InputMenuItemData = (props) => {
    const { itemData, heading, categories, onChange: liftStateUp } = props;
    const [displayData, setDisplayData] = useState(true);
    
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

                <div className={styles["input-field"]}>
                    <label htmlFor="category">Category</label>
                    <select value={itemData.category} name="category" onChange={cbInputChanged}>
                        {Object
                            .entries(categories)
                            .map(([val, desc]) => <option key={val} value={val}>{desc}</option>)}
                    </select>
                </div>

                <div className={styles["input-field"]}>
                    <label htmlFor="name">Name</label>
                    <input required value={itemData.name} name="name" type="text" placeholder="menu item's name" onChange={cbInputChanged} />
                </div>

                <div className={styles["input-field"]}>
                    <label htmlFor="description">Description</label>
                    <textarea value={itemData.description} name="description" type="text" placeholder="extra information" onChange={cbInputChanged} />
                </div>

                <div className={styles["input-field"]}>
                    <label htmlFor="basePrice">Price</label>
                    <input required value={itemData.basePrice} name="basePrice" type="number" min="1" max="20" step="0.5" onChange={cbInputChanged} />
                </div>

            </div>
        </div>
    )
}

export default InputMenuItemData;