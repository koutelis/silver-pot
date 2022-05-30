import React from "react";
import { toCurrency } from "store/utils.js";
import { Button, ModalWindow } from "components/generic.js";
import styles from "styles/CashierSection.module.css"

const RowAddon = (props) => {
    const { name, price } = props.data;

    return (
        <tr>
            <td>plus {name}</td><td>+ {toCurrency(price)}</td>
        </tr>
    );
}

const RowRemovable = (props) => {
    const { name, price } = props.data;

    return (
        <tr>
            <td>no {name}</td><td>- {toCurrency(price)}</td>
        </tr>
    );
}

const FoodTable = (props) => {
    const { name, basePrice, addons, removables, totalPrice } = props.foodData;

    const rowsAddons = addons.map((adn, index) => <RowAddon key={index} data={adn} />)
    const rowsRemovables = removables.map((rmv, index) => <RowRemovable key={index} data={rmv} />)

    return (
        <table className={styles["table"]}>
            <thead>
                <tr>
                    <th colSpan="2">{name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Base price</td><td>{toCurrency(basePrice)}</td>
                </tr>
                {rowsAddons}
                {rowsRemovables}
            </tbody>
            <tfoot>
                <tr>
                    <th>Total</th><td className={styles["total"]}>{toCurrency(totalPrice)}</td>
                </tr>
            </tfoot>
        </table>
    );
}

const DrinkTable = (props) => {
    const { name, size, totalPrice } = props.drinkData;

    return (
        <table className={styles["table"]}>
            <thead>
                <tr>
                    <th colSpan="2">{name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>selected size: '{size.name}'</td><td>{toCurrency(size.price)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Total</th><td className={styles["total"]}>{toCurrency(totalPrice)}</td>
                </tr>
            </tfoot>
        </table>
    );
}

const ModalControls = (props) => {
    const { onCancelOrder, onCompleteOrder, visible } = props;

    if (!visible) return null;
    return (
        <div className={styles["modal__controls"]}>
            <Button 
                text="Cancel Order"
                className={styles["btn--cancel-order"]} 
                onClick={onCancelOrder} 
            />
            <Button 
                text="Complete Order"
                className={styles["btn--complete-order"]} 
                onClick={onCompleteOrder} 
            />
        </div>
    );
}

/**
 * SUBCOMPONENT of ManageOrders
 * @param {Object} props
 * @returns {JSX}
 */
const ManageOrder_Modal = (props) => {
    const { onClose, onCancelOrder, onCompleteOrder, orderData } = props;
    
    if (!orderData) return null;

    const { foods, drinks, table, time, totalCost } = orderData;
    const foodTables = foods.map((food, index) => <FoodTable key={index} foodData={food} />);
    const drinkTables = drinks.map((drink, index) => <DrinkTable key={index} drinkData={drink} />)

    return (
        <ModalWindow onClose={onClose} visible={true} >
            <form className={styles["order-details__form"]} >
                <div className={styles["modal__heading"]}>
                    <h3>{time} {"\u2013"} Table {table} {"\u2013"} <span className={styles["total"]}>{toCurrency(totalCost)}</span></h3>
                </div>

                <div className={styles["tables-container"]}>
                    {foodTables}
                    {drinkTables}
                </div>

                <ModalControls 
                    onCancelOrder={onCancelOrder} 
                    onCompleteOrder={onCompleteOrder}
                    visible={!orderData.paymentComplete}
                />
            </form>
        </ModalWindow>
    );
}

export default ManageOrder_Modal