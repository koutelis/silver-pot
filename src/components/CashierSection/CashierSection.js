import React, { useState, useEffect } from "react";
import { ordersRequests, subscriptions } from "store/connections.js";
import { ORDERS } from "store/config.js";
import { DropDownList, LoadingSpinner, Title } from "components/generic.js";
import ManageOrders from "components/CashierSection/ManageOrders.js";
import styles from "styles/CashierSection.module.css";

/**
 * FR5.
 * @returns {JSX}
 */
 export default () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ orders, setOrders ] = useState([]);
    const [ selectedOrderType, setSelectedOrderType ] = useState("pending");

    // runs only the first time and loads all available items of the specified type
    useEffect(() => {
        let isMounted = true;
        loadOrders(isMounted);

        // set websocket connection
        const socketCleanup = subscriptions.subscribeToOrderUpdates(loadOrders);
        return () => {
            socketCleanup();
            isMounted = false;
        }
    }, []);

    /**
     * Load all available menu items from the DB,
     * according to type (foods or drinks).
     */
    const loadOrders = async (isMounted = true) => {
        const fetchedOrders = await ordersRequests.getAll();
        if (isMounted) {
            setOrders( fetchedOrders ?? [] );
            setIsLoading(false);
        }
    }

    /**
     * CHANGE event handler for the order type DDL.
     * @param {Event} e 
     */
    const cbSectionSelected = (e) => {
        setSelectedOrderType(e.target.value);
    }

    if (isLoading) return ( <LoadingSpinner text="Loading orders. Please wait..." /> );

    return (
        <div className={styles["master-container"]}>
            <div className={styles["top-panel"]} >
                <Title text="Cashier Section" />
                <DropDownList
                    className={styles["ddl--order-type"]} 
                    label="Select order type" 
                    options={ORDERS.orderTypes} 
                    onChange={cbSectionSelected}
                    value={selectedOrderType}
                />
            </div>
            <ManageOrders orderType={selectedOrderType} orders={orders} />
        </div>
    );
}
