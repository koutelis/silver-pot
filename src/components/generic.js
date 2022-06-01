import React from "react";
import { GrBug, GrClose, GrFormCheckmark, GrFormPrevious, GrFormNext, GrStatusGood, GrTrash, GrTroubleshoot } from "react-icons/gr";
import styles from "styles/generic.module.css";

/**
 * Generic button
 * @param {Object} props
 * @returns {JSX}
 */
const Button = (props) => {
    const { text, className, ...rest } = props;
    const classList = [styles["btn"], className ?? ""].join(" ");

    return (
        <button className={classList} type="button" {...rest}>
            {text}
        </button>
    );
};

/**
 * Generic component wrapper for specific card-like container.
 * @param {Object} props
 * @returns {JSX}
 */
const Card = (props) => {
    const classList = [styles["card"], props.className ?? ""].join(" ");

    return ( <div className={classList}>{props.children}</div> );
};

/**
 * Generic pair of Checkbox and Label or Radio and Label.
 * @param {Object} props 
 * @returns {JSX}
 */
const Checkbox_Label = (props) => {
    const {type, name, value, checked, label, onClick} = props;
    const classList = [styles["checkbox-label-pair"], props.className ?? ""].join(" ");

    return (
        <div className={classList}>
            <input type={type} name={name} onChange={onClick} value={value} checked={checked}  />
            <label htmlFor={name} onClick={onClick}>
                {label}
            </label>
        </div>
    );
}

/**
 * Generic trash delete button
 * @param {Object} props
 * @returns {JSX}
 */
 const CompleteButton = (props) => {
    const { className, tooltip, onClick } = props;
    const classList = [styles["btn--complete"], className ?? ""].join(" ");

    const cbClick = (e) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <div title={tooltip} className={classList} onClick={cbClick}>
            <GrStatusGood />
        </div>
    );
};

/**
 * Generic trash delete button
 * @param {Object} props
 * @returns {JSX}
 */
const DelButton = (props) => {
    const { className, text, tooltip, onClick } = props;
    const classList = [styles["btn--del"], className ?? ""].join(" ");

    const cbClick = (e) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <div title={tooltip} className={classList} onClick={cbClick}>
            <GrTrash /><span>{text ?? ""}</span>
        </div>
    );
};

/**
 * Generic DropDownList populated by the passed options Object
 * @param {Object} props - {hasEmpty: Boolean, label: String, onChange: function, options: Object}
 * @returns {JSX}
 */
const DropDownList = (props) => {
    let { className, hasEmpty, label, onChange, options, value } = props;
    const classList = [styles["dropdownlist"], className ?? ""].join(" ");
    options = Object.entries(options).map(([k, v]) => (
        <option key={k} value={k}>{v.label ?? v}</option>
    ));

    if (options.length === 0) {
        return (
            <div className={classList}>
                <label>No options available</label>
            </div>
        );
    }

    hasEmpty = hasEmpty ?? false;
    if (hasEmpty) options.splice(0, 0, <option key="empty" value="">-</option>);

    return (
        <div className={classList}>
            <label htmlFor={label}> {label} </label>
            <select name={label} onChange={onChange} value={value ?? ""}>
                {options}
            </select>
        </div>
    );
};

/**
 * Generic label & input text box.
 * @param {Object} props
 * @returns {JSX}
 */
const Input = (props) => {
    const { className, label, name, ...rest } = props;
    const classList = [styles["input"], className ?? ""].join(" ");

    return (
        <div className={classList}>
            <label htmlFor={name}>{label}</label>
            <input name={name} {...rest} />
        </div>
    );
};

/**
 * Generic label & input text box for integers with incr/decr buttons.
 * @param {Object} props
 * @returns {JSX}
 */
 const IntegerInput = (props) => {
    const { className, label, name, onChange, ...rest } = props;
    let { min, max, step, value } = props;
    min = min ? Number(min) : 999;
    max = max ? Number(max) : 999;
    step = (step && step !== "any") ? Number(step) : 1;
    value = Number(value);

    const classList = [styles["input"], styles["input-numeric"], className ?? ""].join(" ");

    const cbChange = (e) => {
        let newValue = Number(e.target.value);
        if (isNaN(newValue) || newValue < min || newValue > max) {
            newValue = value;
        }
        onChange(newValue);
    }

    const cbClickLeft = () => {
        const newValue = value - step;
        onChange(newValue >= min ? newValue : value);
    }

    const cbClickRight = () => {
        const newValue = value + step;
        onChange(newValue <= max ? newValue : value);
    }

    return (
        <div className={classList}>
            <label htmlFor={name}>{label}</label>
            <div className={styles["input-numeric__controls"]}>
                <div onClick={cbClickLeft}><GrFormPrevious /></div>
                <input name={name} min={min} max={max} step={step} onChange={cbChange} value={value} {...rest} />
                <div onClick={cbClickRight}><GrFormNext /></div>
            </div>
        </div>
    );
};

/**
 * Generic modal window with overlay and close button.
 * @param {Object} props
 * @returns {JSX}
 */
const ModalWindow = (props) => {
    const { onClose, visible } = props;
    const isClosable = props.isClosable ?? true;
    const mask = visible ? "" : "hidden";

    const overlayClassList = [
        styles[isClosable ? "overlay" : "overlay-trans"],
        mask,
    ].join(" ");

    const modalClassList = [
        styles["modal-window"],
        styles[isClosable ? "" : "modal-window__2"],
        mask,
    ].join(" ");

    const cbOverlayClick = (e) => {
        e.stopPropagation();
        if (isClosable) onClose();
    };

    return (
        <>
            <div className={overlayClassList} onClick={cbOverlayClick}></div>
            <div className={modalClassList}>
                <div className={styles["btn--close-modal"]} onClick={onClose}>
                    <GrClose />
                </div>
                {props.children}
            </div>
        </>
    );
};

/**
 * Generic modal alert window with overlay and OK button.
 * @param {Object} props
 * @returns {JSX}
 */
 const ModalAlert = (props) => {
    const { onOK, message } = props;

    const classList = [styles["modal-window"], styles["modal-alert"]].join(" ");

    return (
        <>
            <div className={styles["overlay-above"]}></div>
            <div className={classList}>
                <div className={styles["modal-content"]}>
                    {message}
                </div>
                <div className={styles["modal-controls"]}>
                    <Button className={styles["btn-pass"]} text="OK" onClick={onOK} />
                </div>
            </div>
        </>
    );
};

/**
 * Generic modal confirm window with overlay and cancel/yes buttons.
 * @param {Object} props
 * @returns {JSX}
 */
 const ModalConfirm = (props) => {
    const { onOK, onCancel, message } = props;

    const classList = [styles["modal-window"], styles["modal-alert"]].join(" ");

    return (
        <>
            <div className={styles["overlay-above"]}></div>
            <div className={classList}>
                <div className={styles["modal-content"]}>
                    {message}
                </div>
                <div className={styles["modal-controls"]}>
                    <Button className={styles["btn-pass"]} text="no" onClick={onCancel} />
                    <Button className={styles["btn-act"]} text="yes" onClick={onOK} />
                </div>
            </div>
        </>
    );
};

const LoadingSpinner = (props) => {
    const { text } = props;
    
    return (
        <div className={styles["spinner-container"]}>
            <div className={styles["spinner"]}></div>
            <div>{text ?? ""}</div>
        </div>
    );
};

/**
 * Generic label & input textarea.
 * @param {Object} props
 * @returns {JSX}
 */
const TextArea = (props) => {
    const { className, label, name, ...rest } = props;
    const classList = [styles["input-textarea"], className ?? ""].join(" ");

    return (
        <div className={classList}>
            <label htmlFor={name}>{label}</label>
            <textarea name={name} {...rest} />
        </div>
    );
};

const TickImage = (props) => {
    const { className } = props;
    const classList = [styles["tick-container"], className ?? ""].join(" ");
    
    return (
        <div className={classList}>
            <GrFormCheckmark />
        </div>
    );
}

/**
 * Generic heading.
 * @param {Object} props
 * @returns {JSX}
 */
const Title = (props) => {
    const { className, text } = props;
    const classList = [styles["title"], className ?? ""].join(" ");

    return (
        <div className={classList}>
            <h1>{text}</h1>
        </div>
    );
};

/**
 * Temporary component designating a pending implementation.
 * @param {Object} props
 * @returns {JSX}
 */
const Unimplemented = (props) => {
    return (
        <div className={styles["unimplemented"]}>
            <h2>{props.title}</h2>
            <h3>Not implemented yet...</h3>
            <div>
                <GrTroubleshoot />
            </div>
        </div>
    );
};

/**
 * Temporary component designating a pending implementation.
 * @param {Object} props
 * @returns {JSX}
 */
 const NotFound = (props) => {
    return (
        <div className={styles["unimplemented"]}>
            <h2>{props.title}</h2>
            <h3>404 - Page not found...</h3>
            <div>
                <GrBug />
            </div>
        </div>
    );
};

export {
    Button,
    Card,
    Checkbox_Label,
    CompleteButton,
    DelButton,
    DropDownList,
    Input,
    LoadingSpinner,
    ModalWindow,
    ModalAlert,
    ModalConfirm,
    IntegerInput,
    TextArea,
    TickImage,
    Title,
    Unimplemented,
    NotFound,
};
