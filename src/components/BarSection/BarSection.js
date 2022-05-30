import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, LoadingSpinner, Title } from "components/generic.js";
import { ordersRequests, subscriptions } from "store/connections.js";
import OrdersList from "components/BarSection/OrdersList.js";
import styles from "styles/BarSection.module.css";

/**
 * FR4 - Bar Section
 * Similar to kitchen section, but for drinks and desserts.
 * @returns {JSX}
 */
export default () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ orders, setOrders ] = useState([]);
    const { user } = useAuth0();

    // runs only first time, load pending orders and set websocket connection
    useEffect(() => {
        let isMounted = true;
        loadOrders(true, isMounted);

        // set websocket connection
        const socketCleanup = subscriptions.subscribeToOrderUpdates(loadOrders);

        return () => {
            socketCleanup();
            isMounted = false;
        }
    }, []);

    /**
     * Load current and unprocessed orders from DB
     */
    const loadOrders = async (firstTime = false, isMounted = true) => {
        const fetchedOrders = await ordersRequests.getAll();
        if (firstTime) cleanupLocalStorage( fetchedOrders.map(order => order._id) );
        if (isMounted) {
            setOrders(fetchedOrders);
            setIsLoading(false);
        }
    }

    /**
     * Helper of loadOrders.
     * Runs the first render time and clears old entries from local storage.
     * @param {Array} ordersIds 
     */
    const cleanupLocalStorage = (ordersIds) => {
        ["orderDrinks-", "orderBarFoods-"].forEach(prefix => {
            Object.keys(localStorage)
                .filter(k => k.startsWith(prefix))
                .map(k => k.split("-")[1])
                .forEach(k => {
                    if (!ordersIds.includes(k)) localStorage.removeItem(`${prefix}${k}`);
                });
        });
    }

    const cbOrderComplete = (completedOrder) => {
        completedOrder.foods.forEach(food => {
            if (food.category === "dessert") food.complete = true;
        });
        completedOrder.drinks.forEach(drink => drink.complete = true);
        completedOrder.barComplete = true;
        ordersRequests.put(completedOrder._id, completedOrder);
    }

    if (isLoading) return ( <LoadingSpinner /> );

    return (
        <div className={styles["master-container"]}>
            <div className={styles["top-panel"]} >
                <Title className={styles["title"]} text="BAR SECTION" />
            </div>
            <Card className={styles["card"]}>
                <OrdersList orders={orders} onOrderComplete={cbOrderComplete} />
            </Card>
        </div>
    );
}
