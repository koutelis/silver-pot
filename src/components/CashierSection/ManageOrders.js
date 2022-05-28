import React, { useState, useEffect } from "react";
import { Card, DropDownList } from "components/generic.js";
import { ORDERS } from "store/config.js";
import { ordersRequests, restaurantmenusRequests } from "store/connections.js";
import { useModal } from "store/hooks.js";
import ManageOrder_Modal from "components/CashierSection/ManageOrder_Modal.js";
import OrdersList from "components/CashierSection/OrdersList.js";
import styles from "styles/CashierSection.module.css";

/**
 * SUBCOMPONENT of CashierSection.js
 * @returns {JSX}
 */
const ManageOrders = (props) => {
    const [ pendingOrders, setPendingOrders ] = useState({});
    const [ completedOrders, setCompletedOrders ] = useState({});
    const [ filteredOrders, setFilteredOrders ] = useState({});
    const [ selectedOrder, setSelectedOrder ] = useState(null);
    const [ tableFilter, setTableFilter ] = useState("");
    const { orderType, orders } = props;
    const { displayConfirm } = useModal();
    
    useEffect(() => {
        const result = { completed: {}, pending: {} };
        orders.forEach(order => {
            const attr = (order.paymentComplete) ? "completed" : "pending";
            result[attr][order._id] = order;
        });

        setPendingOrders(result.pending);
        setCompletedOrders(result.completed);
    }, [orders]);

    useEffect(() => applyOrdersFilter(), [orderType, tableFilter, pendingOrders, completedOrders]);

    const applyOrdersFilter = () => {
        const showingOrders = orderType === "pending" ? pendingOrders : completedOrders;
        const filteringOrders = {};
        Object
            .entries(showingOrders)
            .forEach(([id, order]) => {
                if (tableFilter === "" || order.table === tableFilter) {
                    filteringOrders[id] = order;
                }
            });

        setFilteredOrders(filteringOrders);
    }

    /**
     * Callback to open the modal based on orderId.
     * @param {String} orderId 
     */
    const cbModalOpen = (orderId) => {
        setSelectedOrder(filteredOrders[orderId]);
    }

    /**
     * Callback to close the menu item modal.
     */
    const cbModalClose = () => {
        setSelectedOrder(null);
    }

    /**
     * CHANGE event handler for the category filter.
     * @param {Event} e 
     */
    const cbTableFilter = (e) => {
        const selectedTable = e.target.value;
        setTableFilter(selectedTable);
    }

    const cbOrderCancel = async() => {
        const proceed = await displayConfirm("Are you sure you want to cancel this order?");
        if (!proceed) return;

        const { _id, foods } = selectedOrder;
        restoreAvailabilities(foods);
        setSelectedOrder(null);
        ordersRequests.delete(_id);
    }

    const restoreAvailabilities = async (canceledFoods) => {
        const todaysMenu = await restaurantmenusRequests.getCurrent();
        const canceledFoodIds = {}
        for (const food of canceledFoods) {
            if (!canceledFoodIds[food.category]) canceledFoodIds[food.category] = {};
            if (!canceledFoodIds[food.category][food.foodId]) canceledFoodIds[food.category][food.foodId] = 0;
            canceledFoodIds[food.category][food.foodId] += 1;
        }

        for (const category in canceledFoodIds) {
            for (const foodId in canceledFoodIds[category]) {
                const quantity = canceledFoodIds[category][foodId];
                todaysMenu.foods[category] = todaysMenu.foods[category].map(itm => {
                    if (itm._id !== foodId) return itm;
                    const availability = itm.availability + quantity;
                    return {
                        ...itm,
                        availability
                    }
                });
            }
        }
        
        restaurantmenusRequests.updateCurrent(todaysMenu);
    }

    const cbOrderComplete = async () => {
        // validate
        const isIncomplete = !selectedOrder.kitchenComplete || !selectedOrder.barComplete;
        let proceed = true;
        if (isIncomplete) {
            proceed = await displayConfirm("Are you sure? Not all items are marked as complete...");
        }
        if (!proceed) return;

        // proceed
        const order = { 
            ...selectedOrder,
            barComplete: true,
            kitchenComplete: true,
            paymentComplete: true
        };
        setSelectedOrder(null);
        await ordersRequests.put(order._id, order);
    }

    const hasFilteredEntries = Object.keys(filteredOrders).length > 0;
    const hasNoEntries = !hasFilteredEntries && tableFilter === "";
    let title = hasFilteredEntries ? `${orderType} orders` : `no ${orderType} orders found...`;
    if (tableFilter !== "") title += ` for table ${tableFilter}`
    const ddlClassList = [styles["ddl--category"], (hasNoEntries ? "hidden" : "")].join(" ");

    return (
        <Card>
            <div className={styles["upper-panel"]}>
                <h2>{title}</h2>
                <DropDownList hasEmpty={true} label="Filter by Table" className={ddlClassList}
                    options={ORDERS.tables} onChange={cbTableFilter} value={tableFilter}
                />
            </div>
            <OrdersList 
                orders={filteredOrders} 
                onOrderClick={cbModalOpen} 
            />
            <ManageOrder_Modal 
                onClose={cbModalClose}
                onCancelOrder={cbOrderCancel}
                onCompleteOrder={cbOrderComplete}
                orderData={selectedOrder}
            />
        </Card>
    );
}

export default ManageOrders;
