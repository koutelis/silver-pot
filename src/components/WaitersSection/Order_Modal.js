import React from "react";
import { Button, ModalWindow } from "components/generic.js";
import SelectedMenuItemsList from "components/WaitersSection/SelectedMenuItemsList.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of WaitersSection.js
 * @param {Object} props 
 * @returns {JSX}
 */
const Order_Modal = (props) => {
    const { onClose, onSelect, onSubmit, selectedItems, visible } = props;

    const btnMask = Boolean(selectedItems.foods.length + selectedItems.drinks.length) ? "" : "hidden";
    const btnClassList = [styles["btn--send-order"], btnMask].join(" ");

    return <>
        <ModalWindow onClose={onClose} visible={visible}>
            <SelectedMenuItemsList itemsType={"foods"} items={selectedItems.foods} onSelect={onSelect} />
            <SelectedMenuItemsList itemsType={"drinks"} items={selectedItems.drinks} onSelect={onSelect} />
            <Button className={btnClassList} text="Send Order" onClick={onSubmit} />
        </ModalWindow>
    </>
}

export default Order_Modal;