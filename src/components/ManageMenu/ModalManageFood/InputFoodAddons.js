import React from 'react';
import InputFoodAddonBox from 'components/ManageMenu/ModalManageFood/InputFoodAddonBox.js';
import styles from 'styles/ModalManageFood.module.css'

/**
 * SUBCONTAINER component for ModalManageFood CONTAINER form
 * @param {Object} props - {addonsData: Object, visible: Boolean, onSelect: function, onChange: function}
 * @returns {JSX}
 */
const InputFoodAddons = (props) => {

    const { addonsData, visible, onSelect: onHeaderClick, onChange: liftStateUp } = props;

    /**
     * CHANGE event handler for Food ADDONS input (lift state up)
     * @param {Object} data - {name: String, title: String, price: Number}
     */
    const cbInputChanged = (data) => {
        let { name, title, price } = data;

        const newAddons = {
            ...addonsData,
            [name]: {title, price: +price, amount: 1}
        }

        liftStateUp({
            attribute: "addons",
            value: newAddons
        });
    }

    const mask = visible ? "" : " hidden";

    return (
        <div className={styles["inputs__column"]}>
            <h3 className={styles["inputs__heading"]} onClick={onHeaderClick}>Addons</h3>
            <div className={mask}>
                <InputFoodAddonBox label="item 1" name="addon1" title={addonsData["addon1"]["title"]} price={addonsData["addon1"]["price"]} cbInputChanged={cbInputChanged} />
                <InputFoodAddonBox label="item 2" name="addon2" title={addonsData["addon2"]["title"]} price={addonsData["addon2"]["price"]} cbInputChanged={cbInputChanged} />
                <InputFoodAddonBox label="item 3" name="addon3" title={addonsData["addon3"]["title"]} price={addonsData["addon3"]["price"]} cbInputChanged={cbInputChanged} />
            </div>
        </div>
    )
}

export default InputFoodAddons