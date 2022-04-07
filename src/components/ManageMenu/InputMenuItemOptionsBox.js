import React from "react";
import { GrClose } from "react-icons/gr";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * INPUT component for InputFoodAddons CONTAINER
 * @param {Object} props - { label: String, nameLabel: String, name: String, priceLabel: String, price: Number, cbInputChanged: function, cbRemove: function }
 * @returns {JSX}
 */
const InputMenuItemOptionsBox = (props) => {
    const { label, nameLabel, name, priceLabel, price, cbInputChanged: liftStateUp, cbRemove } = props;

    /**
     * CHANGE handler for TITLE input (lift state up)
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

    return <div className={styles["menu-item"]}>
        <fieldset>
            <legend>{label}</legend>
            <div>
                <label htmlFor="name">{nameLabel}</label>
                <input value={name} name="name" placeholder="excluded if empty" onChange={cbNameChanged} />
            </div>
            <div>
                <span>
                    <label htmlFor="price">{priceLabel}</label>
                    <input value={price} name="price" type="Number" min="0" max="5" step="0.25" onChange={cbPriceChanged}/>
                </span>
            </div>
            <div>
                <div className={styles["btn--del-option"]} onClick={cbRemove} title={`remove ${label}`}><GrClose /></div>
            </div>
        </fieldset>
    </div>
}

export default InputMenuItemOptionsBox;
