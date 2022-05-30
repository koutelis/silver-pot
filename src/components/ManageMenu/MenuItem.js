import React from "react";
import { DelButton } from "components/generic.js";
import styles from "styles/ManageMenu.module.css";

/**
 * SUBCOMPONENT of MenuItemsList.js
 * @param {Object} props - {itemData: Object, onClick: function, onDelete: function}
 * @returns {JSX}
 */
const MenuItem = (props) => {
    const { _id, category, name, description } = props.itemData;
    const { onClick, onDelete } = props;

    return (
        <div className={styles["menu-item"]} onClick={() => onClick(_id)} >
            <DelButton className={styles["btn--del-item"]} 
                tooltip={`delete ${name}`} onClick={() => onDelete(_id)} 
            />
            <fieldset>
                <legend>{category}</legend>
                <div><h3>{name}</h3></div>
                <div><span>{description}</span></div>
            </fieldset>
        </div>
    );
}

export default MenuItem;
