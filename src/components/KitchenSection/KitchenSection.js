import React, { useState, useEffect } from "react";
import { Card, LoadingSpinner, Title } from "components/generic.js";
import { ordersRequests, ordersSubscriptions } from "store/connections.js";
import OrdersList from "components/KitchenSection/OrdersList.js";
import styles from "styles/KitchenSection.module.css";

/**
 * FR4 - Kitchen Section
 * This section should display orders grouped by table in FIFO queue 
 * and using colored divisions for each group of dishes to make for easy distinction. 
 * For instance, all orders of table 3 will use a green-coloured background 
 * and starters/appetizers should be displayed first. 
 * @returns {JSX}
 */
const KitchenSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    // runs only first time, load pending orders and set websocket connection
    useEffect(() => {
        loadOrders(true);

        // set websocket connection
        const socketCleanup = ordersSubscriptions.orderUpdates(loadOrders);
        return socketCleanup;
    }, []);

    /**
     * Load current and unprocessed orders from DB
     */
    const loadOrders = async (firstTime = false) => {
        const fetchedOrders = await ordersRequests.getAll();
        if (firstTime) cleanupLocalStorage( fetchedOrders.map(order => order._id) );
        setOrders(fetchedOrders);
        setIsLoading(false);
    }

    /**
     * Helper of loadOrders.
     * Runs the first render time and clears old entries from local storage.
     * @param {Array} ordersIds 
     */
    const cleanupLocalStorage = (ordersIds) => {
        Object.keys(localStorage)
            .filter(k => k.startsWith("orderFoods-"))
            .map(k => k.split("-")[1])
            .forEach(k => {
                if (!ordersIds.includes(k)) localStorage.removeItem(`orderFoods-${k}`);
            });
    }

    const cbOrderComplete = (completedOrder) => {
        completedOrder.foods.forEach(food => {
            if (food.category !== "dessert") food.complete = true;
        });
        completedOrder.kitchenComplete = true;
        ordersRequests.put(completedOrder._id, completedOrder);
    }

    if (isLoading) return <LoadingSpinner />
    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="KITCHEN SECTION" />
        </div>
        <Card className={styles["card"]}>
            <OrdersList orders={orders} onOrderComplete={cbOrderComplete} />
        </Card>
    </div>
}

export default KitchenSection;