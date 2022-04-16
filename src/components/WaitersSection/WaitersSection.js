import React, { useState, useEffect } from "react";
import { useAsync } from "store/hooks.js";
import { restaurantmenusRequests } from "store/http-requests.js";
import { cloneObject, todayAsString } from "store/utils.js";
import { Button, Card, DropDownList, Title, Unimplemented } from "components/generic.js";
import { MENUS, ORDERS } from "store/config.js";
import AvailableMenuItemsList from "components/WaitersSection/AvailableMenuItemsList.js";
import MenuItem_Modal from "components/WaitersSection/MenuItem_Modal.js";
import Order_Modal from "components/WaitersSection/Order_Modal.js";
import styles from "styles/WaitersSection.module.css";

/**
 * FR3
 * @returns {JSX}
 */
const WaitersSection = () => {
    const [availableItems, setAvailableItems] = useState( cloneObject(ORDERS.items) );
    const [currentOrder, setCurrentOrder] = useState( cloneObject(ORDERS.order) );
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedMenuItemType, setSelectedMenuItemType] = useState("foods");
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMode, setCurrentMode] = useState("add");
    const [orderModalIsVisible, setOrderModalIsVisible] = useState(false);

    // runs only first time, checks for an unprocessed pending order
    useEffect(() => {
        // check for an unprocessed pending order
        const pendingOrder = JSON.parse(localStorage.getItem("currentOrder"));
        if (pendingOrder) {
            setCurrentOrder(pendingOrder);
            setSelectedTable(pendingOrder.table);
        }
    }, []);

    // runs only first time, loads today's menu
    useAsync(
        () => restaurantmenusRequests.get( todayAsString() ),
        (currentMenu) => { if (currentMenu) setAvailableItems(currentMenu); }
    )
    
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
        setSelectedMenuItemType(foodsOrDrinks);
    }

    const cbMenuItemSelected = (mode, menuItemType, itemData) => {
        setCurrentMode(mode);
        setSelectedMenuItemType(menuItemType);
        setSelectedItem(itemData);
    }

    const cbMenuItemAdded = (menuItemType, itemOrder) => {
        setSelectedItem(null);
        setCurrentOrder(snapshot => {
            const result = {
                ...snapshot,
                [menuItemType]: snapshot[menuItemType].concat([itemOrder])
            };
            result.totalCost = calculateTotalCost(result);
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    const calculateTotalCost = (order) => {
        const foodsTotalPrice = order.foods.reduce((total, current) => total + current.totalPrice, 0);
        const drinksTotalPrice = order.drinks.reduce((total, current) => total + current.totalPrice, 0);
        return foodsTotalPrice + drinksTotalPrice;
    }

    const cbMenuItemEdited = (menuItemType, itemOrder) => {
        setSelectedItem(null);
        setCurrentOrder(snapshot => {
            const itemList = snapshot[menuItemType];
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i]._id === itemOrder._id) {
                    itemList[i] = itemOrder;
                    break;
                }
            }
            
            const result = {
                ...snapshot,
                [menuItemType]: itemList
            };
            result.totalCost = calculateTotalCost(result);
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    const cbMenuItemRemoved = (menuItemType, itemId) => {
        setSelectedItem(null);
        setCurrentOrder(snapshot => {
            const itemList = snapshot[menuItemType];
            const result = {
                ...snapshot,
                [menuItemType]: itemList.filter(item => item._id !== itemId),
            };
            result.totalCost = calculateTotalCost(result);
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    const cbOpenOrderModal = () => {
        setCurrentMode("edit");
        setOrderModalIsVisible(true);
    }

    const hasSelectedItems = () => {
        return Boolean(currentOrder.foods.length + currentOrder.drinks.length);
    }

    const cbSubmitOrder = () => {
        if (!hasSelectedItems()) {
            alert("No menu items have been selected");
        } else if (!currentOrder.table) {
            alert("A table must be selected");
        } else {
            const finalizedOrder = cloneObject(currentOrder);
            finalizedOrder.timestamp = Date.now();

            // filter-out unchecked options
            finalizedOrder.foods.forEach(food => {
                food.addons = food.addons.filter(adn => adn.checked);
                food.removables = food.removables.filter(rmv => rmv.checked);
            })

            finalizedOrder.drinks.forEach(drink => {
                drink.sizes = drink.sizes.filter(size => size.checked);
            })

            // update foods' availabilities (drinks are always available)
            const updAvailableFoods = cloneObject(availableItems.foods);

            finalizedOrder.foods.forEach(selFood => {
                const currentCategory = selFood.category;
                const index = updAvailableFoods[currentCategory].findIndex(food => food._id === selFood._id);
                updAvailableFoods[currentCategory][index].availability--;
            });

            setAvailableItems(snapshot => {
                const updAvailableItems = {
                    ...snapshot,
                    foods: updAvailableFoods
                };
                // update DB
                restaurantmenusRequests.put(updAvailableItems.date, updAvailableItems);
                return updAvailableItems;
            })

            localStorage.removeItem("currentOrder");
            setCurrentOrder( cloneObject(ORDERS.order) )
            setSelectedTable(null);
            setOrderModalIsVisible(false);

            // STEF:TODO
            // SEND finalizedOrder TO DB, to be broadcasted to other sections
        }
    }

    const btnViewOrder_mask = hasSelectedItems() ? "" : "hidden";
    const btnViewOrder_ClassList = [styles["btn--open-order-modal"], btnViewOrder_mask].join(" ");

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="WAITERS SECTION" />
            <div className={styles["top-panel-ctrls"]}>
                <div className={styles["top-panel-ctrls__ddls"]}>
                    <DropDownList 
                        hasEmpty={true} 
                        className={styles["ddl--restaurant-table"]} 
                        label="Select table" 
                        onChange={cbTableSelected} 
                        options={ORDERS.tables} 
                        value={selectedTable}
                    />
                    <DropDownList 
                        className={styles["ddl--menu-item-type"]} 
                        label="Select menu-item type" 
                        options={MENUS.itemTypes} 
                        onChange={cbSectionSelected} 
                        value={selectedMenuItemType}
                    />
                </div>
                <div>
                    <Button 
                        className={btnViewOrder_ClassList} 
                        text="View Order" 
                        onClick={cbOpenOrderModal} 
                    />
                </div>
            </div>
        </div>
        <Card className={styles["card"]}>
            <AvailableMenuItemsList 
                itemsType={selectedMenuItemType} 
                menuItems={availableItems} 
                onSelect={cbMenuItemSelected} 
            />
        </Card>
        <MenuItem_Modal 
            menuItem={selectedItem}
            menuItemType={selectedMenuItemType}
            mode={currentMode}
            onClose={() => setSelectedItem(null)} 
            onMenuItemAdd={cbMenuItemAdded}
            onMenuItemEdit={cbMenuItemEdited}
            onMenuItemRemove={cbMenuItemRemoved}
        />
        <Order_Modal 
            onClose={() => setOrderModalIsVisible(false)} 
            onSelect={cbMenuItemSelected}
            onSubmit={cbSubmitOrder}
            onTableChange={cbTableSelected}
            currentOrder={currentOrder}
            visible={orderModalIsVisible} 
        />
    </div>

    // return <Unimplemented title="Waiters section" />
}

export default WaitersSection;