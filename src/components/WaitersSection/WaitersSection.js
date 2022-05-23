import React, { useState, useEffect } from "react";
import { restaurantmenusRequests, ordersRequests, ordersSubscriptions } from "store/connections.js";
import { cloneObject, currentTimeString, todayAsString } from "store/utils.js";
import { Button, Card, DropDownList, LoadingSpinner, Title } from "components/generic.js";
import { MENUS, ORDERS } from "store/config.js";
import AvailableMenuItemsList from "components/WaitersSection/AvailableMenuItemsList.js";
import MenuItem_Modal from "components/WaitersSection/MenuItem_Modal.js";
import Order_Modal from "components/WaitersSection/Order_Modal.js";
import styles from "styles/WaitersSection.module.css";

/**
 * FR3 - Waiters Section
 * The system must include only what is selected for the given day (by using the CreateMenu section), 
 * plus the static options such as breakfast dishes and beverages. 
 * To aid the waiters, the UI must be designed in a way to avoid typing text as much as possible 
 * and opt for prefilled drop-down lists, checkboxes, radio buttons, etc...
 * @returns {JSX}
 */
const WaitersSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [availableItems, setAvailableItems] = useState( cloneObject(ORDERS.items) );
    const [currentOrder, setCurrentOrder] = useState( cloneObject(ORDERS.order) );
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedMenuItemType, setSelectedMenuItemType] = useState("foods");
    const [selectedItem, setSelectedItem] = useState({ data: null, index: null });
    const [currentMode, setCurrentMode] = useState("add");
    const [orderModalIsVisible, setOrderModalIsVisible] = useState(false);

    // runs only first time, checks for an unprocessed pending order and loads today's menu
    useEffect(() => {
        // check for an unprocessed pending order
        const pendingOrder = JSON.parse(localStorage.getItem("currentOrder"));
        if (pendingOrder) {
            setCurrentOrder(pendingOrder);
            setSelectedTable(pendingOrder.table);
        }

        loadAvailableItems();

        // set websocket connection
        const socketCleanup = ordersSubscriptions.menuUpdates(loadAvailableItems);
        return socketCleanup;
    }, []);

    useEffect(() => {
        const tmp = cloneObject(currentOrder.foods);
        if (tmp.length) {
            tmp.forEach(food => {
                food.availability = availableItems
                    .foods[food.category]
                    .find(itm => itm._id === food._id)
                    .availability;
            });

            setCurrentOrder(snapshot => {
                return {
                    ...snapshot,
                    foods: tmp
                }
            })
        }

        if (selectedItem.data) {
            setSelectedItem(snapshot => {
                const { _id, category } = snapshot.data;
                const newData = {
                    ...snapshot.data,
                    availability: availableItems.foods[category].find(itm => itm._id === _id).availability
                }

                return newData.availability > 0
                    ? { ...snapshot, data: newData }
                    : { data: null, index: null }
            })
            // loop more and remove unavailables
        }
    }, [availableItems]);

    /**
     * Load available items of today's menu from DB
     */
    const loadAvailableItems = async () => {
        const currentMenu = await restaurantmenusRequests.getCurrent();
        setAvailableItems(snapshot => currentMenu ?? snapshot);
        setIsLoading(false);
    }

    const reset = () => {
        localStorage.removeItem("currentOrder");
        setCurrentOrder( cloneObject(ORDERS.order) )
        setSelectedTable(null);
        setOrderModalIsVisible(false);
    }

    /**
     * CHANGE handler for SELECT TABLE input
     */
    const cbTableSelected = (e) => {
        const table = e.target.value;
        setSelectedTable(table);
        setCurrentOrder(snapshot => { 
            const result = { ...snapshot, table };
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result; 
        });
    }

    /**
     * CHANGE handler for SELECT MENU-ITEM TYPE ddl
     * @param {Event} e 
     */
    const cbSectionSelected = (e) => {
        const foodsOrDrinks = e.target.value;
        setSelectedMenuItemType(foodsOrDrinks);
    }

    /**
     * SELECT handler for menu item. 
     * Opens relevant modal depending on selection origin
     * @param {String} mode "add" or "edit"
     * @param {String} menuItemType "foods" or "drinks"
     * @param {Object} itemData see 'Orders' MongoDB schema
     */
    const cbMenuItemSelected = (mode, menuItemType, itemData, index) => {
        setCurrentMode(mode);
        setSelectedMenuItemType(menuItemType);
        setSelectedItem({ data: itemData, index });
    }

    /**
     * Calculate the cost of all selected menu items and their relevant selected options
     * @param {Object} order current order
     * @returns {Number}
     */
     const calculateTotalCost = (order) => {
        const foodsTotalPrice = order.foods.reduce((total, current) => total + current.totalPrice, 0);
        const drinksTotalPrice = order.drinks.reduce((total, current) => total + current.totalPrice, 0);
        return foodsTotalPrice + drinksTotalPrice;
    }

    /**
     * CLICK button handler. Add menu item to current order
     * @param {String} menuItemType "foods" or "drinks"
     * @param {Object} chosenItem currently selected menu item
     */
    const cbMenuItemAdd = (menuItemType, chosenItem, quantity) => {
        setSelectedItem({ data: null, index: null });

        const selection = [];
        for (let i = 0; i < quantity; i++) {
            selection.push(chosenItem);
        }

        setCurrentOrder(snapshot => {
            const result = {
                ...snapshot,
                [menuItemType]: snapshot[menuItemType].concat(selection)
            };

            result.totalCost = calculateTotalCost(result);
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    /**
     * CLICK button handler. Edit menu item in current order
     * @param {String} menuItemType "foods" or "drinks"
     * @param {Object} chosenItem currently selected menu item
     */
    const cbMenuItemEdit = (menuItemType, chosenItem, index) => {
        setSelectedItem({ data: null, index: null });
        setCurrentOrder(snapshot => {
            const itemList = [...snapshot[menuItemType]];
            itemList[index] = chosenItem;
            
            const result = {
                ...snapshot,
                [menuItemType]: itemList
            };

            result.totalCost = calculateTotalCost(result);
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    /**
     * CLICK button handler. Remove menu item from current order
     * @param {String} menuItemType "foods" or "drinks"
     * @param {String} chosenItemId currently selected menu item
     */
    const cbMenuItemRemove = (menuItemType, chosenItemId) => {
        setSelectedItem({ data: null, index: null });
        setCurrentOrder(snapshot => {
            const itemList = snapshot[menuItemType];
            const result = {
                ...snapshot,
                [menuItemType]: itemList.filter(item => item._id !== chosenItemId),
            };
            result.totalCost = calculateTotalCost(result);
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    /**
     * CLICK handler for the VIEW ORDER button. Opens modal.
     */
    const cbOpenOrderModal = () => {
        setCurrentMode("edit");
        setOrderModalIsVisible(true);
    }

    /**
     * Check if current order contains any menu items
     * @returns {Boolean}
     */
    const hasSelectedItems = () => {
        return Boolean(currentOrder.foods.length + currentOrder.drinks.length);
    }

    /**
     * CLICK handler for the CLEAR ORDER button. Resets this section.
     */
    const cbClearOrder = () => {
        if ( !window.confirm("Are you sure you want to clear this order?") ) return;
        reset();
    }

    /**
     * CLICK handler for the SEND ORDER button.
     * Posts order to DB, then resets this section.
     */
    const cbSubmitOrder = () => {
        if (!hasSelectedItems()) {
            alert("No menu items have been selected");
        } else if (!currentOrder.table) {
            alert("A table must be selected");
        } else {
            const finalizedOrder = prepFinalizedOrder();

            // update foods' availabilities (drinks are always available)
            const updAvailableFoods = cloneObject(availableItems.foods);
            finalizedOrder.foods.forEach(selFood => {
                const currentCategory = selFood.category;
                const index = updAvailableFoods[currentCategory].findIndex(food => food._id === selFood._id);
                updAvailableFoods[currentCategory][index].availability--;
            });

            // update today's menu in DB
            const updAvailableItems = {
                ...availableItems,
                foods: updAvailableFoods
            };

            restaurantmenusRequests.updateCurrent(updAvailableItems);

            // SEND finalizedOrder TO DB, to be broadcasted to other sections
            sendToDB(finalizedOrder);
        }
    }

    const sendToDB = async (finalizedOrder) => {
        reset();
        // rename id property to let mongoose create new distinct ones, 
        /// but keep original as reference
        finalizedOrder.foods = finalizedOrder.foods.map(food => {
            const { _id, ...rest } = food;
            return { ...rest, foodId: _id};
        });
        finalizedOrder.drinks = finalizedOrder.drinks.map(drink => {
            const { _id, ...rest } = drink;
            return { ...rest, drinkId: _id};
        });

        // check for existing ongoing order
        const tableExistingOrder = await ordersRequests.getByTable(finalizedOrder.table);
        if (tableExistingOrder) {
            let updatedFoods = finalizedOrder.foods.concat(tableExistingOrder.foods);

            finalizedOrder = {
                ...finalizedOrder,
                foods: updatedFoods,
                drinks: finalizedOrder.drinks.concat(tableExistingOrder.drinks),
                totalCost: finalizedOrder.totalCost + tableExistingOrder.totalCost
            };
        }

        // set flags
        const hasPendingFoods = finalizedOrder.foods.some(food => food.category !== "dessert" && !food.complete);
        const hasPendingDesserts = finalizedOrder.foods.some(food => food.category === "dessert" && !food.complete);
        const hasPendingDrinks = finalizedOrder.drinks.some(drink => !drink.complete);
        finalizedOrder.kitchenComplete = !hasPendingFoods;
        finalizedOrder.barComplete = !(hasPendingDrinks || hasPendingDesserts);
        finalizedOrder.paymentComplete = false;
        finalizedOrder.date = availableItems?.date ?? todayAsString();

        // send to DB
        if (tableExistingOrder) ordersRequests.put(tableExistingOrder._id, finalizedOrder);
        else ordersRequests.post(finalizedOrder);
    }

    /**
     * Helper of cbSubmitOrder().
     * Prepare current order by filtering menu item options, to be sent to DB.
     * @returns {Object}
     */
    const prepFinalizedOrder = () => {
        const finalizedOrder = cloneObject(currentOrder);
        finalizedOrder.time = currentTimeString();

        // filter-out unchecked options
        finalizedOrder.foods.forEach(food => {
            food.addons = food.addons.filter(adn => adn.checked);
            food.removables = food.removables.filter(rmv => rmv.checked);
            food.complete = false;
        });

        finalizedOrder.drinks.forEach(drink => {
            // also rename property 'sizes' to 'size'
            drink.size = drink.sizes.filter(size => size.checked)[0];
            drink.complete = false;
        });

        return finalizedOrder;
    }

    const btnViewOrder_ClassList = [
        styles["btn--open-order-modal"], 
        (hasSelectedItems() ? "" : "hidden")
    ].join(" ");

    if (isLoading) return <LoadingSpinner />
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
            menuItemData={selectedItem}
            menuItemType={selectedMenuItemType}
            mode={currentMode}
            onClose={() => setSelectedItem({ data: null, index: null })} 
            onMenuItemAdd={cbMenuItemAdd}
            onMenuItemEdit={cbMenuItemEdit}
            onMenuItemRemove={cbMenuItemRemove}
        />
        <Order_Modal 
            onClose={() => setOrderModalIsVisible(false)} 
            onSelect={cbMenuItemSelected}
            onSubmit={cbSubmitOrder}
            onClear={cbClearOrder}
            onTableChange={cbTableSelected}
            currentOrder={currentOrder}
            visible={orderModalIsVisible} 
        />
    </div>
}

export default WaitersSection;