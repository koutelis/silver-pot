import React from "react";
import styles from "styles/ModalManageMenuItem.module.css"

/**
 * INPUT component for InputDrinkSizes CONTAINER
 * @param {Object} props - { label: String, name: String, title: String, price: Number, cbInputChanged: function }
 * @returns {JSX}
 */
const InputDrinkSizeBox = (props) => {
    
    const { label, name, price, cbInputChanged: liftStateUp } = props;

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
                <span>
                    <label htmlFor={`${name}-price`}>Price (&euro;)</label>
                    <input value={price} name={`${name}-price`} type="Number" min="0.25" max="5" step="0.25" onChange={cbPriceChanged}/>
                </span>
            </div>
        </fieldset>
    </div>
}



export default InputDrinkSizeBox;