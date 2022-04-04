import React from "react";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * INPUT component for InputFoodAddons CONTAINER
 * @param {Object} props - { label: String, name: String, title: String, price: Number, cbInputChanged: function }
 * @returns {JSX}
 */
const InputFoodAddonBox = (props) => {
    const { label, name, title, price, cbInputChanged: liftStateUp } = props;

    /**
     * CHANGE handler for TITLE input (lift state up)
     * @param {Event} e 
     */
    const cbTitleChanged = (e) => {
        liftStateUp({ 
            name, 
            title: e.target.value, 
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
            title, 
            price: e.target.value
        });
    }

    return <div className={styles["menu-item"]}>
        <fieldset>
            <legend>{label}</legend>
            <div>
                <label htmlFor={name}>Name</label>
                <input value={title} name={name} placeholder="leave empty to exclude" onChange={cbTitleChanged} />
            </div>
            <div>
                <span>
                    <label htmlFor={`${name}-price`}>extra cost (&euro;)</label>
                    <input value={price} name={`${name}-price`} type="Number" min="0" max="5" step="0.25" onChange={cbPriceChanged}/>
                </span>
            </div>
        </fieldset>
    </div>
}

export default InputFoodAddonBox;
