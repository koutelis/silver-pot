import React from "react";
import { CURRENCY } from "store/config.js";
import styles from "styles/ManageMenu.module.css";  //STEF:TODO

const MenuItem = (props) => {
    const { itemData, onClick } = props;
    const { basePrice, name, description } = itemData;

    return <div className={styles["menu-item"]} onClick={onClick}>
        <div>
            <h3>{name}<span> {CURRENCY.sign}{basePrice.toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default MenuItem;