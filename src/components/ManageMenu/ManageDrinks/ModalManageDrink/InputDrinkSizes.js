import React from "react";
import InputDrinkSizeBox from "components/ManageMenu/ManageDrinks/ModalManageDrink/InputDrinkSizeBox.js";
import styles from "styles/ModalManageMenuItem.module.css"

/**
 * SUBCONTAINER component for ModalManageDrink CONTAINER form
 * @param {Object} props - {sizeData: Object, onChange: function}
 * @returns {JSX}
 */
const InputDrinkSizes = (props) => {

    const { sizeData, onChange: liftStateUp } = props;

    /**
     * CHANGE event handler for Food ADDONS input (lift state up)
     * @param {Object} data - {name: String, title: String, price: Number}
     */
    const cbInputChanged = (data) => {
        let { name, price } = data;

        const newSizes = {
            ...sizeData,
            [name]: +price
        }

        liftStateUp({
            attribute: "sizes",
            value: newSizes
        });
    }

    return (
        <div className={styles["inputs__column"]}>
            <h3 className={styles["inputs__heading"]}>Sizes</h3>
            <div>
                <InputDrinkSizeBox 
                    label="small" name="small" price={sizeData["small"]} cbInputChanged={cbInputChanged} 
                />
                <InputDrinkSizeBox 
                    label="regular" name="regular" price={sizeData["regular"]} cbInputChanged={cbInputChanged} 
                />
                <InputDrinkSizeBox 
                    label="large" name="large" price={sizeData["large"]} cbInputChanged={cbInputChanged} 
                />
            </div>
        </div>
    )
}

export default InputDrinkSizes