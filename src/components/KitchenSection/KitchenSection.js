import React, { useState, useEffect, useRef } from "react";
import { Button, Card, LoadingSpinner, Title } from "components/generic.js";
import { ordersRequests, subscriptions } from "store/connections.js";
import { useModal } from "store/hooks.js";
import OrdersList from "components/KitchenSection/OrdersList.js";
import ManageAvailabilities from "components/KitchenSection/ManageAvailabilities.js";
import styles from "styles/KitchenSection.module.css";

/**
 * FR4 - Kitchen Section
 * This section should display orders grouped by table in FIFO queue 
 * and using colored divisions for each group of dishes to make for easy distinction. 
 * For instance, all orders of table 3 will use a green-coloured background 
 * and starters/appetizers should be displayed first. 
 * @returns {JSX}
 */
 export default () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ orders, setOrders ] = useState([]);
    const [ viewMode, setViewMode ] = useState("orders");
    const availabilitiesManager = useRef(null);
    const { displayAlert } = useModal();

    // runs only first time, load pending orders and set websocket connection
    useEffect(() => {
        loadOrders(true);

        // set websocket connection
        const socketCleanup = subscriptions.subscribeToOrderUpdates(loadOrders);
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

    const toggleViewMode = () => {
        setViewMode(snapshot => snapshot === "orders" ? "availabilities" : "orders");
    }

    const cbAvailabilitiesUpdate = async () => {
        await availabilitiesManager.current.submit();
        displayAlert("Food availabilities have been updated");
        setViewMode("orders");
    }

    const btnModeText = viewMode === "orders" ? "Set Availabilities" : "View Orders";
    const btnSubmitAvail_classList = [
        styles["btn--submit-availabilities"],
        viewMode === "orders" ? "hidden" : ""
    ].join(" ");
    const cardTitle = orders?.length
        ? <h2>{viewMode === "orders" ? "PENDING ORDERS" : "MANAGE AVAILABILITIES"}</h2>
        : null;

    if (isLoading) return ( <LoadingSpinner text="Loading orders. Please wait..." /> );

    return (
        <div className={styles["master-container"]}>
            <div className={styles["top-panel"]} >
                <Title className={styles["title"]} text="KITCHEN SECTION" />
                <div className={styles["top-panel__controls"]}>
                    <Button className={styles["btn--kitchen-mode"]} text={btnModeText} onClick={toggleViewMode} />
                    <Button
                        className={btnSubmitAvail_classList} 
                        text="submit changes" 
                        onClick={cbAvailabilitiesUpdate}
                    />
                </div>
            </div>
            <Card className={styles["card"]}>
                {cardTitle}
                <OrdersList 
                    orders={orders} 
                    onOrderComplete={cbOrderComplete} 
                    visible={viewMode === "orders"} 
                />
                <ManageAvailabilities 
                    ref={availabilitiesManager}
                    visible={viewMode === "availabilities"} 
                />
            </Card>
        </div>
    );
}
