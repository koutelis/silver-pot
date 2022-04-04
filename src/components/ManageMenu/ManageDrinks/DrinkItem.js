import React from "react";
import { GrClose } from "react-icons/gr";
import styles from "styles/ManageMenu.module.css";

/**
 * Component of DrinkList.js
 * @param {Object} props - {drinkData: Object, onClick: function, onDelete: function}
 * @returns {JSX}
 */
const DrinkItem = (props) => {
    const {_id, category, title, description} = props.drinkData;

    return <div className={styles["menu-item"]} onClick={(e) => props.onClick(_id)} >
        <div title={`delete ${title}`} className={styles["btn--del-item"]} onClick={(e) => { e.stopPropagation(); props.onDelete(_id) }} >
            <GrClose />
        </div>
        <fieldset>
            <legend>{category}</legend>
            <div>
                <h3>{title}</h3>
            </div>
            <div>
                <span>{description}</span>
            </div>
        </fieldset>
    </div>
}

export default DrinkItem;
