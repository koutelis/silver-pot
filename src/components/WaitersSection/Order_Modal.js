import React from "react";
import { Button, DropDownList, ModalWindow } from "components/generic.js";
import { CURRENCY } from "store/config";
import { ORDERS } from "store/config.js";
import SelectedMenuItemsList from "components/WaitersSection/SelectedMenuItemsList.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props 
 * @returns {JSX}
 */
const Order_Modal = (props) => {
    const { currentOrder, onClose, onSelect, onSubmit, onTableChange, visible } = props;
    const btnMask = Boolean(currentOrder.foods.length + currentOrder.drinks.length) ? "" : "hidden";
    const btnClassList = [styles["btn--send-order"], btnMask].join(" ");
    const totalCost = `${CURRENCY.sign}${currentOrder.totalCost.toFixed(2)}`;

    return <>
        <ModalWindow onClose={onClose} visible={visible}>
            <DropDownList 
                hasEmpty={true} 
                className={styles["ddl--restaurant-table__modal"]} 
                label="Selected table" 
                onChange={onTableChange} 
                options={ORDERS.tables} 
                value={currentOrder.table}
            />
            <div className={styles["order-list"]}>
                <SelectedMenuItemsList 
                    itemsType={"foods"} 
                    items={currentOrder.foods} 
                    onSelect={onSelect} 
                />
                <SelectedMenuItemsList 
                    itemsType={"drinks"} 
                    items={currentOrder.drinks} 
                    onSelect={onSelect} 
                />
                <Button 
                    className={btnClassList} 
                    text={`Send Order (${totalCost})`}
                    onClick={onSubmit} 
                />
            </div>
        </ModalWindow>
    </>
}

export default Order_Modal;