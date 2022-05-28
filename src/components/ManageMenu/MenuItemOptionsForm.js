import React from "react";
import { Button } from "components/generic.js";
import MenuItemOptionsForm_Input from "components/ManageMenu/MenuItemOptionsForm_Input.js";
import styles from "styles/ManageMenu.module.css"

/**
 * SUBCONTAINER component for MenuItemOptions.js
 * @param {Object} props - {visible: Boolean, optionsList: Array, optionsProperty: String, optionName: String, priceLabel: String, btnLabel: String, onSelect: function, onChange: function, onAdd: function, onRemove: function}
 * @returns {JSX}
 */
const MenuItemOptionsForm = (props) => {
    const { visible, optionsList, optionsProperty, optionName, priceLabel, btnLabel,
        onSelect, onChange: liftStateUp, onAdd, onRemove } = props;

    const mask = visible ? "" : "hidden"
    const containerClassList = [styles["options-container"], mask].join(" ");
    const headingSide = `(${visible ? "hide" : "show"})`;

    return (
        <div className={styles["inputs__column"]}>
            <div className={styles["inputs__heading"]} onClick={() => onSelect(optionsProperty)}>
                <h3>{optionsProperty}</h3>
                <span>{headingSide}</span>
            </div>
            <div className={containerClassList} >
                {optionsList.map((item, index) => {
                    return ( 
                        <MenuItemOptionsForm_Input
                            key={index}
                            label={`${optionName} ${index + 1}`} 
                            nameLabel="Name"
                            name={item.name} 
                            priceLabel={priceLabel}
                            price={item.price} 
                            cbInputChanged={(data) => liftStateUp(optionsProperty, data, index)} 
                            cbRemove={() => onRemove(optionsProperty, index)}
                        />
                    );
                })}
                <Button 
                    className={styles["btn--add-option"]} 
                    onClick={() => onAdd(optionsProperty)} 
                    text={btnLabel} 
                />
            </div>
        </div>
    );
}

export default MenuItemOptionsForm