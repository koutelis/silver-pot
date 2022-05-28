import React from "react";
import { toCurrency } from "store/utils.js";
import { ORDERS } from "store/config.js";
import MenuItem from "components/CashierSection/MenuItem.js";
import styles from "styles/CashierSection.module.css";

const MenuItemsList = (props) => {
    const { label, items } = props;

    if (!items.length) return null;

    const itemsList = items.map((item, index) => <li key={index}><MenuItem itemData={item} /></li>)
    const itemsTotalPrice = items.reduce((total, item) => total + item.totalPrice, 0);

    return (
        <>
            <div>
                <h3>{label}: <span className={styles["order-content__price"]}>{toCurrency(itemsTotalPrice)}</span></h3>
            </div>
            <div>
                <ul>{itemsList}</ul>
            </div>
        </>     
    );   
}

/**
 * SUBCOMPONENT of OrdersList.js
 * @param {Object} props
 * @returns {JSX}
 */
const Order = (props) => {
    const { onClick, orderData } = props;
    const { _id, drinks, foods, table, totalCost, time } = orderData;

    const backgroundColor = ORDERS.tables[orderData.table].color;

    return (
        <div className={styles["order-content"]} style={{ backgroundColor }} onClick={() => onClick(_id)} >
            <fieldset>
                <legend>{time} {"\u2013"} Table {table} {"\u2013"} <span className={styles["order-content__totalCost"]}>{toCurrency(totalCost)}</span></legend>
                <MenuItemsList label="Foods" items={foods} />
                <MenuItemsList label="Drinks" items={drinks} />
            </fieldset>
        </div>
    );
}

export default Order;
