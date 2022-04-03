import React from "react";
import { categories } from "store/defaults.js";
import styles from "styles/ModalManageMenuItem.module.css"

/**
 * INPUT component for InputFoodAddons CONTAINER.
 * props.value regards the expected input value
 * @param {Object} props - { label: String, name: String, value: String, className: String, onChange: function }
 * @returns {JSX}
 */
const InputFoodDataBox_Categories = (props) => {
    
    const {label, name, value, className, onChange: liftStateUp} = props;

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

    /**
     * Prepare the category DDL
     * @returns {JSX}
     */
    const setupCategories = () => {
        const options = Object
            .entries(categories.foods)
            .map(([val, desc]) => <option key={val} value={val}>{desc}</option>)

        return <select value={value} name={name} onChange={cbInputChanged}>
            {options}
        </select>
    }

    return <div className={`${styles["menu-item"]} ${styles[className]}`}>
        <label htmlFor={name}>{label}</label>
        {setupCategories()}
    </div>
}

export default InputFoodDataBox_Categories;
