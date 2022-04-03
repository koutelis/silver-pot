import React from "react";
import InputFoodRemovableBox from "components/ManageMenu/ManageFoods/ModalManageFood/InputFoodRemovableBox.js";
import styles from "styles/ModalManageMenuItem.module.css"

/**
 * SUBCONTAINER component for ModalAddFood CONTAINER form
 * @param {Object} props - {removablesData: Object, visible: Boolean, onSelect: function, onChange: function}
 * @returns {JSX}
 */
const InputFoodRemovables = (props) => {
    
    const { removablesData, visible, onSelect: onHeaderClick, onChange: liftStateUp } = props;

    /**
     * CHANGE event handler for Food REMOVABLES input (lift state up)
     * @param {Object} data - {name: String, title: String, price: Number}
     */
    const cbInputChanged = (data) => {
        let { name, title, price } = data;

        const newRemovables = {
            ...removablesData,
            [name]: {title, price: +price, amount: 1}
        }

        liftStateUp({
            attribute: "removables",
            value: newRemovables
        });
    }

    const mask = visible ? "" : " hidden";

    return (
        <div className={styles["inputs__column"]}>
            <h3 className={styles["inputs__heading"]} onClick={onHeaderClick}>Removables</h3>
            <div className={mask}>
                <InputFoodRemovableBox label="item 1" name="removable1" title={removablesData["removable1"]["title"]} price={removablesData["removable1"]["price"]} cbInputChanged={cbInputChanged} />
                <InputFoodRemovableBox label="item 2" name="removable2" title={removablesData["removable2"]["title"]} price={removablesData["removable2"]["price"]} cbInputChanged={cbInputChanged} />
                <InputFoodRemovableBox label="item 3" name="removable3" title={removablesData["removable3"]["title"]} price={removablesData["removable3"]["price"]} cbInputChanged={cbInputChanged} />
            </div>
        </div>
    )
}

export default InputFoodRemovables