import React from "react";
import styles from "styles/generic.module.css";

/**
 * Generic button
 * @param {Object} props {text: String, ...rest}
 * @returns {JSX}
 */
const Button = (props) => {
    const {text, className, ...rest} = props;
    const classList = [ styles["btn"], (className ?? "") ].join(" ");

    return <button className={classList} {...rest}>{text}</button>
}

/**
 * Generic component wrapper for specific card-like container.
 * @param {Object} props 
 * @returns {JSX}
 */
const Card = (props) => {
    const classList = [ styles["card"], (props.className ?? "") ].join(" ");

    return <div className={classList}>{props.children}</div>
}

/**
 * Generic DropDownList populated by the passed options Object
 * @param {Object} props - {hasEmpty: Boolean, label: String, onChange: function, options: Object}
 * @returns {JSX}
 */
 const DropDownList = (props) => {
    let {className, hasEmpty, label, onChange, options} = props;
    const classList = [ styles["dropdownlist"], (className ?? "") ].join(" ");
    
    options = Object
        .entries(options)
        .map(([k, v]) => <option key={k} value={k}>{v}</option>);

    if (options.length === 0) return <div className={classList}>
        <label>No options available</label>
    </div>;
    
    hasEmpty = hasEmpty ?? false;
    if (hasEmpty) options.splice(0, 0, <option key="empty" value="">-</option>);
    
    return <div className={classList}>
        <label htmlFor={label}> {label} </label>
        <select name={label} onChange={onChange}>
            {options}
        </select>
    </div>
}

const Title = (props) => {
    const { className, text } = props;
    const classList = [ styles["title"], (className ?? "") ].join(" ");

    return <div className={classList}>
        <h1>{text}</h1>
    </div>
}

export { Button, Card, DropDownList, Title };