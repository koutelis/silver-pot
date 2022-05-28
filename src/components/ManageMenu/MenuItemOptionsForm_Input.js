import React from "react";
import { DelButton, Input } from "components/generic.js";
import styles from "styles/ManageMenu.module.css"

/**
 * INPUT component for MenuItemOptionsForm CONTAINER
 * @param {Object} props - { label: String, nameLabel: String, name: String, priceLabel: String, price: Number, cbInputChanged: function, cbRemove: function }
 * @returns {JSX}
 */
const MenuItemOptionsForm_Input = (props) => {
    const { label, nameLabel, name, priceLabel, price, cbInputChanged: liftStateUp, cbRemove } = props;

    /**
     * CHANGE handler for NAME input (lift state up)
     * @param {Event} e 
     */
    const cbNameChanged = (e) => {
        liftStateUp({ 
            name: e.target.value, 
            price 
        }); 
    }

    /**
     * CHANGE handler for PRICE input (lift state up)
     * @param {Event} e 
     */
    const cbPriceChanged = (e) => {
        liftStateUp({ 
            name, 
            price: e.target.value
        });
    }

    return (
        <div className={styles["option-box"]}>
            <fieldset>
                <legend>{label}</legend>
                <div className={styles["option-box__inputs"]}>
                    <Input name="name" label={nameLabel} value={name} 
                        placeholder="excluded if empty" onChange={cbNameChanged} 
                    />
                    <Input name="price" label={priceLabel} value={price} 
                        type="Number" min="0" max="5" step="0.25" onChange={cbPriceChanged} 
                    />
                </div>
            </fieldset>
            <DelButton className={styles["btn--del-option"]} onClick={cbRemove} tooltip={`delete ${label}`} />
        </div>
    );
}

export default MenuItemOptionsForm_Input;
