import React, { useState, useEffect } from "react";
import { restaurantmenusRequests } from "store/http-requests.js";
import { cloneObject, todayAsString } from "store/utils.js";
import { Button, Card, DropDownList, Title, Unimplemented } from "components/generic.js";
import { MENUS, ORDERS } from "store/config.js";
import AvailableMenuItemsList from "components/WaitersSection/AvailableMenuItemsList.js";
import MenuItemOrder_Modal from "components/WaitersSection/MenuItemOrder_Modal.js";
import Order_Modal from "components/WaitersSection/Order_Modal.js";
import styles from "styles/WaitersSection.module.css";

const WaitersSection = () => {
    const [availableItems, setAvailableItems] = useState( cloneObject(ORDERS.items) );
    const [currentOrder, setCurrentOrder] = useState( cloneObject(ORDERS.order) );
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedMenuItemType, setSelectedMenuItemType] = useState("foods");
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMode, setCurrentMode] = useState("add");
    const [orderModalIsVisible, setOrderModalIsVisible] = useState(false);

    // runs only first time
    useEffect(async () => {
        // check for an unprocessed pending order
        const pendingOrder = JSON.parse(localStorage.getItem("currentOrder"));
        if (pendingOrder) {
            setCurrentOrder(pendingOrder);
            setSelectedTable(pendingOrder.table);
        }

        // load today's menu
        const currentMenu = await restaurantmenusRequests.get( todayAsString() );
        if (currentMenu) setAvailableItems(currentMenu);
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
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
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
                [menuItemType]: itemList.filter(item => item._id !== itemId)
            };
            localStorage.setItem("currentOrder", JSON.stringify(result));
            return result;
        });
    }

    const cbOpenOrderModal = () => {
        setCurrentMode("edit");
        setOrderModalIsVisible(true);
    }

    const cbSubmitOrder = () => {
        setOrderModalIsVisible(false);

        const hasItems = Boolean(currentOrder.foods.length + currentOrder.drinks.length);
        if (!hasItems) {
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
                    value={selectedMenuItemType}
                />
                <Button 
                    className={styles["btn--open-modal"]} 
                    text="View Order" 
                    onClick={cbOpenOrderModal} 
                />
            </div>
        </div>
        <Card>
            <AvailableMenuItemsList 
                itemsType={selectedMenuItemType} 
                menuItems={availableItems} 
                onSelect={cbMenuItemSelected} 
            />
        </Card>
        <MenuItemOrder_Modal 
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
            selectedItems={currentOrder}
            visible={orderModalIsVisible} 
        />
    </div>

    // return <Unimplemented title="Waiters section" />
}

export default WaitersSection;