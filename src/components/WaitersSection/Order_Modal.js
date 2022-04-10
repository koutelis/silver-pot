import React, { useState } from "react";
import { Button, ModalWindow } from "components/generic.js";
import OrderedFoodItem_Modal from "components/WaitersSection/OrderedFoodItem_Modal.js";
import SelectedFoodList from "components/WaitersSection/SelectedFoodList.js";
import styles from "styles/CreateMenu.module.css";

const Order_Modal = (props) => {
    const [ selectedFood, setSelectedFood ] = useState(null);
    const { onClose, onSubmit, selectedItems, visible } = props;

    // implement operations for pending items - VIEW/REMOVE/EDIT

    const mask = Boolean(selectedItems.foods.length + selectedItems.drinks.length) ? "" : "hidden";
    const btnClassList = [styles["btn--send-order"], mask].join(" ");

    return <>
        <OrderedFoodItem_Modal 
            foodData={selectedFood}
            onClose={() => setSelectedFood(null)} 
            onAddToMenu={onSubmit} 
        />
        <ModalWindow onClose={onClose} visible={visible}>
            <SelectedFoodList foods={selectedItems.foods} onSelect={(item) => setSelectedFood(item)} />
            <Button
                className={btnClassList} 
                text="Send Order" 
                onClick={onSubmit} 
            />
        </ModalWindow>
    </>
}

export default Order_Modal;
