import React, { useState, useEffect } from "react";
import { drinksRequests, restaurantmenusRequests } from "store/http-requests.js";
import { cloneObject, todayAsString } from "store/utils.js";
import { Button, Card, DropDownList, Title, Unimplemented } from "components/generic.js";
import { MENUS, ORDERS } from "store/config.js";
import Order_Modal from "components/WaitersSection/Order_Modal.js";
import FoodList from "components/WaitersSection/FoodList.js";
import styles from "styles/WaitersSection.module.css";

const WaitersSection = () => {
    const [availableItems, setAvailableItems] = useState( cloneObject(ORDERS.items) );
    const [currentOrder, setCurrentOrder] = useState( cloneObject(ORDERS.order) );
    const [selectedSection, setSelectedSection] = useState("foods");
    const [orderModalIsVisible, setOrderModalIsVisible] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    // runs only first time
    useEffect(async () => {
        const pendingOrder = JSON.parse(localStorage.getItem("currentOrder"));
        if (pendingOrder) {
            setCurrentOrder(pendingOrder);
            setSelectedTable(pendingOrder.table);
        }

        // load today's menu
        const currentMenu = await restaurantmenusRequests.get( todayAsString() );
        if (currentMenu) {
            const fetchedDrinks = await drinksRequests.getAll();
            setAvailableItems({
                foods: currentMenu.items ?? [],
                drinks: fetchedDrinks ?? []
            })
        }
    }, []);

    const cbTableSelected = (e) => {
        const table = e.target.value;
        setSelectedTable(table);
        setCurrentOrder(snapshot => { 
            const result = { ...snapshot, table };
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result; 
        });
    }

    const cbSectionSelected = (e) => {
        const foodsOrDrinks = e.target.value;
        setSelectedSection(foodsOrDrinks);
    }

    const cbFoodSelected = (foodData) => {
        setCurrentOrder(snapshot => {
            const result = {
                ...snapshot,
                foods: snapshot.foods.concat([foodData])
            };
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    const cbSubmitOrder = () => {
        setOrderModalIsVisible(false);

        const hasItems = Boolean(currentOrder.foods.length + currentOrder.drinks.length);
        if (!hasItems) {
            alert("No menu items have been selected");
        } else if (!currentOrder.table) {
            alert("A table must be selected");
        } else {
            const finalizedOrder = {
                ...currentOrder,
                timestamp: Date.now()
            }
    
            console.log(finalizedOrder);
    
            // STEF:TODO send this to the DB
            
            // update items' availabilities

            localStorage.removeItem("currentOrder");
            setCurrentOrder( cloneObject(ORDERS.order) )
            setSelectedTable(null);
            return finalizedOrder;
        }
    }

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="WAITERS SECTION" />
            <DropDownList 
                hasEmpty={true} 
                className={styles["tables"]} 
                label="Select table" 
                onChange={cbTableSelected} 
                options={ORDERS.tables} 
                value={selectedTable}
            />
            <div className={styles["top-panel-btns"]}>
                <DropDownList 
                    className={styles["ddl--menu-item-type"]} 
                    label="Select menu-item type" 
                    options={MENUS.itemTypes} 
                    onChange={cbSectionSelected} 
                />
                <Button 
                    className={styles["btn--open-modal"]} 
                    text="View Order" 
                    onClick={() => setOrderModalIsVisible(true)} 
                />
            </div>
        </div>
        <Card className={styles["card"]}>
            {selectedSection === "foods" 
                ? <FoodList items={availableItems.foods} onSelect={cbFoodSelected} /> 
                : <div></div>}
        </Card>
        <Order_Modal 
            onClose={() => setOrderModalIsVisible(false)} 
            onSubmit={cbSubmitOrder}
            selectedItems={currentOrder}
            visible={orderModalIsVisible} 
        />
    </div>

    // // return <Unimplemented title="Waiters section" />
}

export default WaitersSection;