import React from "react";
import Order from "components/KitchenSection/Order.js";
import styles from "styles/KitchenSection.module.css";

/**
 * SUBCOMPONENT of KitchenSection.js
 * @returns {JSX}
 */
const OrdersList = (props) => {
    const { orders, onOrderComplete, visible } = props;

    const getContent = () => {
        if (orders?.length) {
            return orders
                .filter(order => !order.kitchenComplete)
                .map(order => <Order key={order._id} orderData={order} onComplete={onOrderComplete}/>);
        } else {
            return ( <h2 className={styles["title"]}>No pending orders...</h2> );
        }
    }
        
    if (!visible) return null;
    
    return (
        <div className={styles["orders-container"]}>
            {getContent()}
        </div>
    );
}

export default OrdersList;
