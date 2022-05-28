import React from "react";
import { toCurrency } from "store/utils.js";
import { TickImage } from "components/generic.js";
import styles from "styles/CashierSection.module.css";

/**
 * SUBCOMPONENT of Order.js
 * @param {Object} props
 * @returns {JSX}
 */
const MenuItem = (props) => {
    const { complete, name, totalPrice, posDirections } = props.itemData;

    const tickMast = complete ? "" : styles["invisible"];
    const tickClassList = [styles["tick-container"], tickMast].join(" ");

    return (
        <div className={styles["menu-item"]}>
            <TickImage className={tickClassList} />
            <div>
                <h3><span className={styles["menu-item__price"]}> {toCurrency(totalPrice)}</span> - {name}</h3>
                <div>{posDirections ?? ""}</div>
            </div>
        </div>
    );
}

export default MenuItem;