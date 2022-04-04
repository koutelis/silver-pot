import React from "react";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * INPUT component for InputDrinkData CONTAINER.
 * props.value regards the expected input value
 * @param {Object} props - { label: String, name: String, value: any, className: String, onChange: function, ...rest: attributes for <textarea> }
 * @returns {JSX}
 */
const InputFoodDataBox_Description = (props) => {

    const {label, name, value, className, onChange: liftStateUp, ...rest} = props;

    /**
     * CHANGE handler for title input (lift state up)
     * @param {Event} e 
     */
    const cbInputChanged = (e) => {
        // lift state up
        liftStateUp({
            attribute: name,
            value: e.target.value
        });
    }

    return <div className={`${styles["menu-item"]} ${styles[className]}`}>
        <label htmlFor={name}>{label}</label>
        <textarea required value={value} name={name} {...rest} onChange={cbInputChanged} />
    </div>
}

export default InputFoodDataBox_Description;
