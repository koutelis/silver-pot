import React from "react";
import Order from "components/KitchenSection/Order.js";
import styles from "styles/KitchenSection.module.css";

/**
 * SUBCOMPONENT of KitchenSection.js
 * @returns {JSX}
 */
const OrdersList = (props) => {
    const { orders, onOrderComplete } = props;

    const list = orders
        .filter(order => !order.kitchenComplete)
        .map(order => <Order key={order._id} orderData={order} onComplete={onOrderComplete}/>);
    
    const output = list.length ? list : <h2 className={styles["title"]}>No pending orders...</h2>

    return <div className={styles["orders-container"]}>
        {output}
    </div>
}

export default OrdersList;
