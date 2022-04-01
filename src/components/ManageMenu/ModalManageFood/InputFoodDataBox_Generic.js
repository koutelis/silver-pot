import React from 'react';
import styles from 'styles/ModalManageFood.module.css'

/**
 * INPUT component for InputFoodAddons CONTAINER.
 * props.value regards the expected input value
 * @param {Object} props - { label: String, name: String, value: any, onChange: function, className: String, ...rest: attributes for <input> }
 * @returns {JSX}
 */
const InputFoodDataBox_Generic = (props) => {

    const {label, name, value, className, onChange: liftStateUp, ...rest} = props;

    /**
     * CHANGE handler for title input (lift state up)
     * @param {Event} e 
     */
    const inputHandler = (e) => {
        // lift state up
        liftStateUp({
            attribute: name,
            value: e.target.value
        });
    }

    return <div className={`${styles["food-item"]} ${styles[className]}`}>
        <label htmlFor={name}>{label}</label>
        <input required value={value} name={name} {...rest} onChange={inputHandler} />
    </div>
}

export default InputFoodDataBox_Generic;
