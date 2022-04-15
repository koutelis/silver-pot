import React from "react";
import { GrClose } from "react-icons/gr";
import styles from "styles/generic.module.css";

/**
 * Generic button
 * @param {Object} props
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
 * Generic X delete button
 * @param {Object} props
 * @returns {JSX}
 */
const DelButton = (props) => {
    const { className, tooltip, name, onClick } = props;
    const classList = [ styles["btn--del"], (className ?? "") ].join(" ");

    const cbClick = (e) => { 
        e.stopPropagation(); 
        onClick();
    }

    return <div title={tooltip} className={classList} onClick={cbClick} >
        <GrClose />
    </div>
}

/**
 * Generic DropDownList populated by the passed options Object
 * @param {Object} props - {hasEmpty: Boolean, label: String, onChange: function, options: Object}
 * @returns {JSX}
 */
 const DropDownList = (props) => {
    let {className, hasEmpty, label, onChange, options, value} = props;
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
        <select name={label} onChange={onChange} value={value ?? ""}>
            {options}
        </select>
    </div>
}

/**
 * Generic label & input text box.
 * @param {Object} props 
 * @returns {JSX}
 */
const Input = (props) => {
    const { className, label, name, ...rest } = props;
    const classList = [ styles["input"], (className ?? "") ].join(" ");

    return <div className={classList}>
        <label htmlFor={name}>{label}</label>
        <input name={name} {...rest} />
    </div>
}

/**
 * Generic modal window with overlay and close button.
 * @param {Object} props 
 * @returns {JSX}
 */
const ModalWindow = (props) => {
    const { onClose, visible } = props;
    const mask = visible ? "" : " hidden"

    const cbOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    }

    return <>
        <div className={`${styles["overlay"]}${mask}`} onClick={cbOverlayClick}></div>
        <div className={`${styles["modal-window"]}${mask}`}>
            <div className={styles["btn--close-modal"]} onClick={onClose}><GrClose /></div>
            {props.children}
        </div>
    </>
}

/**
 * Generic modal window with overlay and close button.
 * Transparent and non-closable overlay.
 * @param {Object} props 
 * @returns {JSX}
 */
 const ModalWindow_2 = (props) => {
    const { onClose, visible } = props;
    const mask = visible ? "" : " hidden"

    return <>
        <div className={`${styles["overlay-trans"]}${mask}`}></div>
        <div className={`${styles["modal-window__2"]}${mask}`}>
            <div className={styles["btn--close-modal"]} onClick={onClose}><GrClose /></div>
            {props.children}
        </div>
    </>
}

/**
 * Generic label & input textarea.
 * @param {Object} props 
 * @returns {JSX}
 */
 const TextArea = (props) => {
    const { className, label, name, ...rest } = props;
    const classList = [ styles["input-textarea"], (className ?? "") ].join(" ");

    return <div className={classList}>
        <label htmlFor={name}>{label}</label>
        <textarea name={name} {...rest} />
    </div>
}

/**
 * Generic heading.
 * @param {Object} props 
 * @returns {JSX}
 */
const Title = (props) => {
    const { className, text } = props;
    const classList = [ styles["title"], (className ?? "") ].join(" ");

    return <div className={classList}>
        <h1>{text}</h1>
    </div>
}

/**
 * Temporary component designating a pending implementation.
 * @param {Object} props 
 * @returns {JSX}
 */
const Unimplemented = (props) => {
    return <div style={{color: "white", textAlign: "center"}}>
        <h2 style={{color: "var(--attentive-color__pale)"}}>{props.title}</h2>
        <h3>Not implemented yet...</h3>
    </div>
}

export { Button, Card, DelButton, DropDownList, Input, ModalWindow, ModalWindow_2, TextArea, Title, Unimplemented };