import React, { useState, useEffect } from "react";
import { calculateTotalCost, prepFinalizedOrder, sendOrderToDB } from "components/WaitersSection/helpers.js";
import { restaurantmenusRequests, subscriptions } from "store/connections.js";
import { cloneObject, todayAsString } from "store/utils.js";
import { Button, Card, DropDownList, LoadingSpinner, Title } from "components/generic.js";
import { MENUS, ORDERS } from "store/config.js";
import { useModal } from "store/hooks.js";
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
export default () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ availableItems, setAvailableItems ] = useState( cloneObject(ORDERS.items) );
    const [ foodAvailabilities, setFoodAvailabilities ] = useState({});
    const [ currentOrder, setCurrentOrder ] = useState( cloneObject(ORDERS.order) );
    const [ selectedTable, setSelectedTable ] = useState(null);
    const [ selectedMenuItemType, setSelectedMenuItemType ] = useState("foods");
    const [ selectedItem, setSelectedItem ] = useState({ data: null, index: null });
    const [ currentMode, setCurrentMode ] = useState("add");
    const [ orderModalIsVisible, setOrderModalIsVisible ] = useState(false);
    const { displayAlert, displayConfirm } = useModal();

    // runs only first time, checks for an unprocessed pending order and loads today's menu
    useEffect(() => {
        loadAvailableItems();

        // set websocket connection
        const socketCleanup = subscriptions.subscribeToMenuUpdates(loadAvailableItems);
        return () => {
            socketCleanup();
        };
    }, []);

    useEffect(() => {
        // update available items with correct availabilities
        setAvailableItems(snapshot => {
            const result = { ...snapshot };
            Object.entries(foodAvailabilities).forEach(([_id, data]) => {
                const {category, availability, index} = data;
                result.foods[category][index].availability = availability;
            })
            return result;
        });
    }, [foodAvailabilities])

    useEffect(() => {
        // if the selected item is food, update its availability (or remove if unavailable)
        if (selectedMenuItemType === "foods" && selectedItem.data) {
            setSelectedItem(snapshot => {
                const result = cloneObject(snapshot);
                const { category, _id } = result.data;
                const targetFood = availableItems.foods[category].find(food => food._id === _id);
                const newAvailability = targetFood.availability;
                if (newAvailability < 1) {
                    displayAlert(`'${targetFood.name}' is no longer available...`);
                    return { data: null, index: null };
                }
                result.data.availability = newAvailability;
                return result;
            });
        }        
    }, [availableItems])

    /**
     * Load available items of today's menu from DB
     */
    const loadAvailableItems = async () => {
        const currentMenu = await restaurantmenusRequests.getCurrent();
        setAvailableItems(currentMenu ?? snapshot);
        
        setFoodAvailabilities(snapshot => {
            const result = {}  // {foodId: {category: String, availability: Number, index: Number, orderedCount: Number}}
            Object.values(currentMenu.foods).forEach(foodArr => {
                foodArr.forEach((food, index) => {
                    const { _id, category, availability } = food;
                    result[_id] = { 
                        category, 
                        availability, 
                        index, 
                        orderedCount: snapshot[_id]?.orderedCount ?? 0 
                    };
                });
            })
            return result;
        });

        checkCachedPendingOrder();
        setIsLoading(false);
    }

    /**
     * Helper of loadAvailableItems.
     * Runs on first render and either sets currentOrder from cache or clears old cache.
     */
    const checkCachedPendingOrder = () => {
        const cache = JSON.parse(localStorage.getItem("currentOrder"));
        if (cache) {
            if (cache.date < todayAsString()) {
                localStorage.removeItem("currentOrder");
            } else {
                setCurrentOrder(cache);
            }
        }
    }

    const updateLocalStorage = (order) => {
        const cache = localStorage.getItem("currentOrder");
        if (!cache) {
            order.date = todayAsString();
            localStorage.setItem("currentOrder", JSON.stringify(order));
        }
    }

    /**
     * CHANGE handler for SELECT TABLE input
     */
    const cbTableSelected = (e) => {
        const table = e.target.value;
        setSelectedTable(table);
        setCurrentOrder(snapshot => { 
            const result = { ...snapshot, table };
            updateLocalStorage(result);
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
     * CLICK button handler. Add menu item to current order
     * @param {String} menuItemType "foods" or "drinks"
     * @param {Object} chosenItem currently selected menu item
     */
     const cbMenuItemAdd = (menuItemType, chosenItem, quantity) => {
        setSelectedItem({ data: null, index: null });
        const { _id, category } = chosenItem;

        // update DB for availabilities
        if (menuItemType === "foods") {
            const dbUpdates = cloneObject(availableItems);
            const targetIndex = dbUpdates.foods[category].findIndex(food => food._id === _id);
            dbUpdates.foods[category][targetIndex].availability -= quantity;
            restaurantmenusRequests.updateCurrent(dbUpdates);

            setFoodAvailabilities(snapshot => {
                const result = cloneObject(snapshot);
                result[_id].availability -= quantity;
                result[_id].orderedCount += quantity;
                return result;
            });
        }

        const selection = [];
        for (let i = 0; i < quantity; i++) {
            selection.push(chosenItem);
        }

        // update order
        setCurrentOrder(snapshot => {
            const result = {
                ...snapshot,
                [menuItemType]: snapshot[menuItemType].concat(selection)
            };

            result.totalCost = calculateTotalCost(result);
            updateLocalStorage(result);
            return result;
        });
    }

    /**
     * CLICK button handler. Edit menu item in current order
     * @param {String} menuItemType "foods" or "drinks"
     * @param {Object} chosenItem currently selected menu item
     * @param {Number} orderIndex order's index for currently selected menu item
     */
    const cbMenuItemEdit = (menuItemType, chosenItem, orderIndex) => {
        setSelectedItem({ data: null, index: null });
        setCurrentOrder(snapshot => {
            const result = cloneObject(snapshot);
            result[menuItemType][orderIndex] = chosenItem;
            result.totalCost = calculateTotalCost(result);
            updateLocalStorage(result);
            return result;
        });
    }

    /**
     * CLICK button handler. Remove menu item from current order
     * @param {String} menuItemType "foods" or "drinks"
     * @param {Number} orderIndex order's index for currently selected menu item
     */
    const cbMenuItemRemove = (menuItemType, orderIndex) => {
        setSelectedItem({ data: null, index: null });
        const { _id, category } = currentOrder[menuItemType][orderIndex];

        // update DB for availabilities
        if (menuItemType === "foods") {
            const dbUpdates = cloneObject(availableItems);
            const targetIndex = dbUpdates.foods[category].findIndex(food => food._id === _id);
            dbUpdates.foods[category][targetIndex].availability += 1;
            restaurantmenusRequests.updateCurrent(dbUpdates);

            setFoodAvailabilities(snapshot => {
                const result = cloneObject(snapshot);
                result[_id].availability += 1;
                result[_id].orderedCount -= 1;
                return result;
            });
        }

        // update order
        setCurrentOrder(snapshot => {
            const itemList = cloneObject(snapshot[menuItemType]);
            itemList.splice(orderIndex, 1);
            const result = {
                ...snapshot,
                [menuItemType]: itemList
            };
            result.totalCost = calculateTotalCost(result);
            updateLocalStorage(result);
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
    const cbClearOrder = async () => {
        const proceed = await displayConfirm("Are you sure you want to clear this order?");
        if (!proceed) return;

        const dbUpdates = cloneObject(availableItems);

        // update DB availabilities
        Object.values(foodAvailabilities).forEach(data => {
            const { category, index, orderedCount } = data;
            dbUpdates.foods[category][index].availability += orderedCount;
        });

        // reset
        setCurrentOrder( cloneObject(ORDERS.order) )
        localStorage.removeItem("currentOrder");
        setSelectedTable(null);
        setOrderModalIsVisible(false);
        setFoodAvailabilities(snapshot => {
            const result = cloneObject(snapshot);
            Object.values(result).forEach(data => data.orderedCount = 0);
            return result;
        });

        restaurantmenusRequests.updateCurrent(dbUpdates);
    }

    /**
     * CLICK handler for the SEND ORDER button.
     * Posts order to DB, then resets this section.
     */
    const cbSubmitOrder = () => {
        if (!hasSelectedItems()) {
            displayAlert("No menu items have been selected");
        } else if (!currentOrder.table) {
            displayAlert("A table must be selected");
        } else {
            const finalizedOrder = prepFinalizedOrder(currentOrder);

            // reset and SEND finalizedOrder TO DB, to be broadcasted to other sections
            setCurrentOrder( cloneObject(ORDERS.order) )
            localStorage.removeItem("currentOrder");
            setSelectedTable(null);
            setOrderModalIsVisible(false);
            loadAvailableItems();
            sendOrderToDB(finalizedOrder, availableItems);
        }
    }

    const btnViewOrder_ClassList = [
        styles["btn--open-order-modal"], 
        (hasSelectedItems() ? "" : "hidden")
    ].join(" ");

    if (isLoading) return ( <LoadingSpinner text="Loading menu. Please wait..." /> );
    
    return (
        <div className={styles["master-container"]}>
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
     );
}
