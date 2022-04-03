import React from "react";
import styles from "styles/Card.module.css";


/**
 * Generic component wrapper for specific card-like container.
 * @param {Object} props 
 * @returns {JSX}
 */
const Card = (props) => {
    return <div className={styles.card}>
        {props.children}
    </div>
}

/**
 * Generic button
 * @param {Object} props {text: String, ...rest}
 * @returns {JSX}
 */
const Button = (props) => {
    const {text, ...rest} = props;

    return <button {...rest}>{text}</button>
}

/**
 * Generic DropDownList populated by the passed options Object
 * @param {Object} props - {hasEmpty: Boolean, label: String, onChange: function, options: Object}
 * @returns {JSX}
 */
 const DropDownList = (props) => {
    const label = props.label;
    
    const options = Object
        .entries(props.options)
        .map(([k, v]) => <option key={k} value={k}>{v}</option>);

    if (options.length === 0) return <label>No options available</label>;
    
    const hasEmpty = props.hasEmpty ?? false;
    if (hasEmpty) options.splice(0, 0, <option key="empty" value="">-</option>);
    
    return <>
        <label htmlFor={label}> {label} </label>
        <select name={label} onChange={props.onChange}>
            {options}
        </select>
    </>
}

export { Button, Card, DropDownList };
