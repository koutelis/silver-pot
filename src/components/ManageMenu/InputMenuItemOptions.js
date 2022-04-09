import React from "react";
import { Button } from "components/generic.js";
import InputMenuOptionsBox from "components/ManageMenu/InputMenuItemOptionsBox.js";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * SUBCONTAINER component for ModalAddFood and ModalAddDrink forms
 * @param {Object} props - {visible: Boolean, optionsList: Array, optionsProperty: String, optionName: String, priceLabel: String, btnLabel: String, onSelect: function, onChange: function, onAdd: function, onRemove: function}
 * @returns {JSX}
 */
const InputMenuItemOptions = (props) => {
    const { visible, optionsList, optionsProperty, optionName, priceLabel, btnLabel,
        onSelect, onChange: liftStateUp, onAdd, onRemove } = props;

    const mask = visible ? "" : "hidden"
    const headingSide = `(${visible ? "hide" : "show"})`;

    return <div className={styles["inputs__column"]}>
        <div className={styles["inputs__heading"]} onClick={() => onSelect(optionsProperty)}>
            <h3>{optionsProperty}</h3>
            <span>{headingSide}</span>
        </div>
        <div className={mask} style={{width: "100%"}} >
            {optionsList.map((item, index) => {
                return <InputMenuOptionsBox
                    key={index}
                    label={`${optionName} ${index + 1}`} 
                    nameLabel="Name"
                    name={item.name} 
                    priceLabel={priceLabel}
                    price={item.price} 
                    cbInputChanged={(data) => liftStateUp(optionsProperty, data, index)} 
                    cbRemove={() => onRemove(optionsProperty, index)}
                />
            })}
            <Button className={styles["btn--add-option"]} onClick={() => onAdd(optionsProperty)} type="button" text={btnLabel} />
        </div>
    </div>
}

export default InputMenuItemOptions