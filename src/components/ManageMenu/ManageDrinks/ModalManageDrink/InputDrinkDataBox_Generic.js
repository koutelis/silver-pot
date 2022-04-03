import React from "react";
import styles from "styles/ModalManageMenuItem.module.css"

/**
 * INPUT component for InputFoodData CONTAINER.
 * props.value regards the expected input value
 * @param {Object} props - { label: String, name: String, value: any, onChange: function, className: String, ...rest: attributes for <input> }
 * @returns {JSX}
 */
const InputDrinkDataBox_Generic = (props) => {

    const {label, name, value, className, onChange: liftStateUp, ...rest} = props;

    /**
     * CHANGE handler for title input (lift state up)
     * @param {Event} e 
     */
    const inputHandler = (e) => {
        liftStateUp({
            attribute: name,
            value: e.target.value
        });
    }

    return <div className={`${styles["menu-item"]} ${styles[className]}`}>
        <label htmlFor={name}>{label}</label>
        <input required value={value} name={name} {...rest} onChange={inputHandler} />
    </div>
}

export default InputDrinkDataBox_Generic;
