import React from "react";
import { GrClose } from "react-icons/gr";
import styles from "styles/ManageMenu.module.css";

/**
 * COMPONENT of FoodList.js
 * @param {Object} props - {foodData: Object, onClick: function, onDelete: function}
 * @returns 
 */
const MenuItem = (props) => {
    const {_id, category, name, description} = props.itemData;

    return <div className={styles["menu-item"]} onClick={(e) => props.onClick(_id)} >
        <div title={`delete ${name}`} className={styles["btn--del-item"]} onClick={(e) => { e.stopPropagation(); props.onDelete(_id) }} >
            <GrClose />
        </div>
        <fieldset>
            <legend>{category}</legend>
            <div>
                <h3>{name}</h3>
            </div>
            <div>
                <span>{description}</span>
            </div>
        </fieldset>
    </div>
}

export default MenuItem;
