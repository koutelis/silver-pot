import React, { useState, useEffect } from "react";
import { drinkRequests } from "store/http-requests.js";
import { DRINKS as defaults } from "store/defaults.js";
import { Button, Card, DropDownList } from "components/generic.js";
import ManageDrink_Modal from "components/ManageMenu/ManageDrink_Modal.js";
import MenuItemsList from "components/ManageMenu/MenuItemsList.js";
import styles from "styles/ManageMenu.module.css";

/**
 * SUBCONTAINER of ManageMenu.js
 * @returns {JSX}
 */
const ManageDrinks = () => {
    // state
    const [drinks, setDrinks] = useState([]);
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [selectedDrinkId, setSelectedDrinkId] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("");

    /**
     * Fetch available 'drink' options from DB.
     */
    const loadDrinks = () => {
        drinkRequests
            .getAll()
            .then(fetchedDrinks => setDrinks( fetchedDrinks ?? [] ));
    }

    // runs only the first time and loads all 'drink' options
    useEffect(loadDrinks, []);

    const cbModalOpen = (id) => {
        setSelectedDrinkId(id);
        setModalIsVisible(true);
    }

    const cbModalClose = () => {
        setSelectedDrinkId(null);
        setModalIsVisible(false);
    }

    /**
     * CLICK event handler for the modal's submit button.
     * Prepare data and filter of unnessessary values, then send to DB.
     */
    const cbModalSubmit = (drinkId, drinkData) => {
        // check modal mode (Add/Edit)
        const callback = drinkId ? drinkRequests.put(drinkId, drinkData) : drinkRequests.post(drinkData);
        callback.then(loadDrinks);
        cbModalClose();
    };
    
    /**
     * CLICK handler for each drink's delete button.
     * Delete drink after confirmation, then refresh list if deleted successfully (status 204)
     * @param {String} id 
     */
    const cbDeleteDrink = async (id) => {
        setModalIsVisible(false);
        const selectedDrink = await drinkRequests.get(id);
        const proceed = window.confirm(`Are you sure you want to delete "${selectedDrink.title}"?`);
        if (proceed) {
            const response = await drinkRequests.delete(id);
            if (response.status === 204) loadDrinks();
        }
    }

    // runs every time the drinks or filter change
    useEffect(() => {
        const result = drinks.filter(drink => categoryFilter === "" || drink.category === categoryFilter);
        setFilteredDrinks(result);
    }, [drinks, categoryFilter]);

    /**
     * CHANGE event handler for the category filter.
     * @param {Event} e 
     */
    const cbCategoryFilter = (e) => {
        const selectedCategory = e.target.value;
        setCategoryFilter(selectedCategory);
    }

    const selectedCategory = categoryFilter === "" ? "other" : categoryFilter;

    return <Card>
            <div className={styles["card-container"]}>
                <h2>MANAGE DRINK ITEMS</h2>
                <Button className={styles["btn--add-item"]} text="add drink" onClick={() => cbModalOpen(null)} />
                <DropDownList hasEmpty={true} label="Filter by Category" className={styles["ddl--category"]}
                    options={defaults.categories} onChange={cbCategoryFilter} 
                />
            </div>
        <MenuItemsList 
            itemsData={filteredDrinks} 
            onItemClick={cbModalOpen} 
            onDeleteItem={cbDeleteDrink}
        />
        <ManageDrink_Modal 
            visible={modalIsVisible} 
            closeButtonHandler={cbModalClose} 
            submitButtonHandler={cbModalSubmit} 
            selectedDrinkId={selectedDrinkId}
            selectedCategory={selectedCategory}
        />
    </Card>
}

export default ManageDrinks;
