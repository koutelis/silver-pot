import React from "react";
import { Input } from "components/generic.js";
import { toCurrency } from "store/utils.js";
import styles from "styles/CreateMenu.module.css";

const MenuItemBlock = (props) => {
    const { itemData, onAvailabilityChange } = props;
    const { availability, basePrice, name, description } = itemData;

    const cbAvailabilityChange = (e) => {
        onAvailabilityChange(e, itemData);
    }

    return (
        <div className={styles["menu-item"]}>
            <div>
                <h3>{name}<span> - {toCurrency(basePrice)}</span></h3>
                <div>{description}</div>
            </div>
            
            <Input 
                title="set availability"
                name={name} 
                type="number" min="0" step="1" 
                value={availability} 
                onChange={cbAvailabilityChange} 
            />
        </div>
    );
}

const MenuItemPrintable = (props) => {
    const { itemData, fontSize } = props;
    const { basePrice, name, description } = itemData;

    return (
        <div style={{fontSize: `${fontSize}px`}}>
            <div>
                <h3>{name}<span> - {toCurrency(basePrice)}</span></h3>
            </div>
            <div>
                {description}
            </div>
        </div>
    );
}

/**
 * COMPONENT of DailyMenu_DnD.js
 * A single restaurant menu item.
 * @param {Object} props - { itemData: {_id: String, basePrice: Number, name: String, description: String}, fontSize: Number, isPrintView: Boolean }
 * @returns {JSX}
 */
const MenuItem = (props) => {
    return (
        props.isPrintView
        ? <MenuItemPrintable {...props} />
        : <MenuItemBlock {...props} />
    );
}

export default MenuItem;