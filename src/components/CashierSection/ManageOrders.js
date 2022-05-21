import React, { useState, useEffect } from "react";
import { Card, DropDownList } from "components/generic.js";
import { ORDERS } from "store/config.js";
import { ordersRequests } from "store/connections.js";
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

    const cbOrderCancel = async () => {
        setSelectedOrder(null);
        await ordersRequests.delete(selectedOrder._id);
    }

    const cbOrderComplete = async () => {
        setSelectedOrder(null);
        await ordersRequests.put(
            selectedOrder._id, 
            {
                ...selectedOrder, 
                barComplete: true,
                kitchenComplete: true,
                paymentComplete: true
            }
        );
    }

    let title = Object.keys(filteredOrders).length > 0 ? `${orderType} orders` : `no ${orderType} orders found`;
    if (tableFilter !== "") title += ` for table ${tableFilter}`
    const ddlClassList = [styles["ddl--category"], (orders.length ? "" : "hidden")].join(" ");

    return <Card>
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
}

export default ManageOrders;
