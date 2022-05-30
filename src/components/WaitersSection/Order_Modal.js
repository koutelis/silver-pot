import React from "react";
import { Button, DropDownList, ModalWindow } from "components/generic.js";
import { toCurrency } from "store/utils.js";
import { ORDERS } from "store/config.js";
import SelectedMenuItemsList from "components/WaitersSection/SelectedMenuItemsList.js";
import styles from "styles/WaitersSection.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props { currentOrder: Object, onClose: function, onSelect: function, onSubmit: function, onTableChange: function, visible: Boolean }
 * @returns {JSX}
 */
const Order_Modal = (props) => {
    const { currentOrder, onClear, onClose, onSelect, onSubmit, onTableChange, visible } = props;
    const btnMask = Boolean(currentOrder.foods.length + currentOrder.drinks.length) ? "" : "hidden";
    const btnClassList = [styles["btn--order-control"], btnMask].join(" ");
    const totalCost = `${toCurrency(currentOrder.totalCost)}`;

    return (
        <>
            <ModalWindow onClose={onClose} visible={visible}>
                <DropDownList 
                    hasEmpty={true} 
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
                </div>
                <div className={styles["order-controls"]}>
                    <Button 
                        className={btnClassList} 
                        text={`Clear Order`}
                        onClick={onClear} 
                    />
                    <Button 
                        className={btnClassList} 
                        text={`Send Order (${totalCost})`}
                        onClick={onSubmit} 
                    />
                </div>
            </ModalWindow>
        </>
     );
}

export default Order_Modal;