import React from "react";
import Order from "components/CashierSection/Order.js";
import styles from "styles/CashierSection.module.css";

/**
 * SUBCOMPONENT of ManageOrders.js
 * @returns {JSX}
 */
const OrdersList = (props) => {
    const { orders, onOrderClick } = props;

    const createList = Object
        .entries(orders)
        .map(([id, order]) => <Order key={id} orderData={order} onClick={onOrderClick} />);

    return (
        <div className={styles["orders-container"]}>
            {createList}
        </div>
    );
}

export default OrdersList;