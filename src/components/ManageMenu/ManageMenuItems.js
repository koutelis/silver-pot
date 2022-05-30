import React, { useState, useEffect } from "react";
import { foodsRequests, drinksRequests } from "store/connections.js";
import { FOODS as foodsDefaults, DRINKS as drinkDefaults } from "store/config.js";
import { Button, Card, DropDownList, LoadingSpinner, Title } from "components/generic.js";
import { useModal } from "store/hooks.js";
import ManageMenuItem_Modal from "components/ManageMenu/ManageMenuItem_Modal.js";
import MenuItemsList from "components/ManageMenu/MenuItemsList.js";
import styles from "styles/ManageMenu.module.css";

/**
 * SUBCOMPONENT of ManageMenu.js
 * @returns {JSX}
 */
const ManageMenuItems = (props) => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ items, setItems ] = useState([]);
    const [ filteredItems, setFilteredItems ] = useState([]);
    const [ modalIsVisible, setModalIsVisible ] = useState(false);
    const [ selectedItemId, setSelectedItemId ] = useState(null);
    const [ categoryFilter, setCategoryFilter ] = useState("");
    const { displayConfirm } = useModal();

    const { menuItemType } = props;
    const defaults = (menuItemType === "foods") ? foodsDefaults : drinkDefaults;
    const requestsHandler = (menuItemType === "foods") ? foodsRequests : drinksRequests;

    // runs only the first time and loads all available items of the specified type
    useEffect(() => loadItems(), [menuItemType]);

    // runs every time the items or filter change, to filter the items to be displayed
    useEffect(() => {
        const categoryExistsForType = Object.keys(defaults.categories).includes(categoryFilter);
        if (!categoryExistsForType) setCategoryFilter("");
        const result = items.filter(item => categoryFilter === "" || item.category === categoryFilter);
        setFilteredItems(result);
    }, [items, categoryFilter]);

    /**
     * Load all available menu items from the DB,
     * according to type (foods or drinks).
     */
    const loadItems = async () => {
        const fetchedItems = await requestsHandler.getAll();
        setItems( fetchedItems ?? [] );
        setIsLoading(false);
    }

    /**
     * Callback to open the modal.
     * If given itemId is null then the modal opens in ADD mode (empty form)
     * else opens in EDIT mode for the selected menu item (prefilled).
     * @param {String} itemId 
     */
    const cbModalOpen = (itemId) => {
        setSelectedItemId(itemId);
        setModalIsVisible(true);
    }

    /**
     * Callback to close the menu item modal.
     */
    const cbModalClose = () => {
        setSelectedItemId(null);
        setModalIsVisible(false);
    }

    /**
     * CLICK event handler for the modal's submit button.
     * Prepare data and filter of unnessessary values, then send to DB.
     */
    const cbModalSubmit = async (itemId, itemData) => {
        // check modal mode (Add/Edit)
        if (itemId) await requestsHandler.put(itemId, itemData);
        else await requestsHandler.post(itemData);
        
        loadItems();
        cbModalClose();
    };
    
    /**
     * CLICK handler for each item's delete button.
     * Delete item after confirmation, then refresh list if deleted successfully (status 204)
     * @param {String} id 
     */
    const cbDeleteItem = async (id) => {
        setSelectedItemId(null);
        setModalIsVisible(false);
        const selectedItem = await requestsHandler.get(id);
        const proceed = await displayConfirm(`Are you sure you want to delete "${selectedItem.name}"?`);
        if (proceed) {
            const response = await requestsHandler.delete(id);
            if (response.status === 204) loadItems();
        }
    }

    /**
     * CHANGE event handler for the category filter.
     * @param {Event} e 
     */
    const cbCategoryFilter = (e) => {
        const selectedCategory = e.target.value;
        setCategoryFilter(selectedCategory);
    }

    if (isLoading) return ( <LoadingSpinner /> );

    return (
        <Card>
            <div className={styles["upper-panel"]}>
                <h2>MANAGE {menuItemType.toUpperCase()}</h2>
                <DropDownList hasEmpty={true} label="Filter by Category" className={styles["ddl--category"]}
                    options={defaults.categories} onChange={cbCategoryFilter} value={categoryFilter}
                />
                <Button 
                    className={styles["btn--add-item"]} 
                    text={menuItemType === "foods" ? "add food" : "add drink"} 
                    onClick={() => cbModalOpen(null)} 
                />
            </div>
            <MenuItemsList 
                items={filteredItems} 
                onItemClick={cbModalOpen} 
                onDeleteItem={cbDeleteItem}
            />
            <ManageMenuItem_Modal 
                cbModalClose={cbModalClose}
                menuItemType={menuItemType}
                selectedCategory={categoryFilter === "" ? "other" : categoryFilter}
                selectedItemId={selectedItemId}
                cbModalSubmit={cbModalSubmit} 
                visible={modalIsVisible} 
            />
        </Card>
    );
}

export default ManageMenuItems;
