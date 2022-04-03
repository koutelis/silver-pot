import React, { useState, useEffect } from "react";
import { drinkRequests } from "store/http-requests.js";
import { categories } from "store/defaults.js";
import { Button, Card, DropDownList } from "components/generic.js";
import ModalManageDrink from "components/ManageMenu/ManageDrinks/ModalManageDrink/ModalManageDrink.js";
import DrinkList from "components/ManageMenu/ManageDrinks/DrinkList.js";
import styles from "styles/ManageMenuItems.module.css";

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
            .then(fetchedDrinks => setDrinks(fetchedDrinks));
    }

    // runs only the first time and loads all 'drink' options
    useEffect(loadDrinks, []);

    const cbModalOpen = (id) => {
        setSelectedDrinkId(id);
        setModalIsVisible(true);
    }

    const cbModalClose = () => {
        setModalIsVisible(false);
    }

    /**
     * CLICK event handler for the modal's submit button.
     * Prepare data and filter of unnessessary values, then send to DB.
     */
    const cbModalSubmit = (data) => {
        // handle sizes/prices
        const sizes = Object.fromEntries(
            Object.entries(data.sizes).filter(([k, v]) => Boolean(v) && v > 0)
        );

        if (sizes.regular) data.main.basePrice = sizes.regular;

        // check modal mode (Add/Edit)
        const id = data.id;
        const drink = { ...data.main, sizes };

        const callback = id ? drinkRequests.put(id, drink) : drinkRequests.post(drink);
        callback.then(loadDrinks);
        setModalIsVisible(false);
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

    return <div className={styles["items-container"]}>
        <Card>
            <Button className={styles["btn-menu"]} text="add drink" onClick={() => cbModalOpen(null)} />
            <DropDownList hasEmpty={true} label="Filter by Category" options={categories.drinks} onChange={cbCategoryFilter} />
        </Card>
        <DrinkList 
            drinksData={filteredDrinks} 
            onDrinkClick={cbModalOpen} 
            onDrinkDelete={cbDeleteDrink}
        />
        <ModalManageDrink 
            visible={modalIsVisible} 
            closeButtonHandler={cbModalClose} 
            submitButtonHandler={cbModalSubmit} 
            selectedDrinkId={selectedDrinkId}
            selectedCategory={selectedCategory}
        />
    </div>
}

export default ManageDrinks;
