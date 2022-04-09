import React, { useState, useEffect } from "react";
import { foodsRequests } from "store/http-requests.js";
import { FOODS as defaults } from "store/config.js";
import { Button, Card, DropDownList } from "components/generic.js";
import ManageFood_Modal from "components/ManageMenu/ManageFood_Modal.js";
import MenuItemsList from "components/ManageMenu/MenuItemsList.js";
import styles from "styles/ManageMenu.module.css";

/**
 * SUBCONTAINER of ManageMenu.js
 * @returns {JSX}
 */
const ManageFoods = () => {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("");

    /**
     * Fetch available food options from DB.
     */
    const loadFoods = async () => {
        const fetchedFoods = await foodsRequests.getAll();
        setFoods( fetchedFoods ?? [] );
    }

    // runs only the first time and loads all food options
    useEffect(loadFoods, []);

    const cbModalOpen = (id) => {
        setSelectedFoodId(id);
        setModalIsVisible(true);
    }

    const cbModalClose = () => {
        setSelectedFoodId(null);
        setModalIsVisible(false);
    }

    /**
     * CLICK event handler for the modal's submit button.
     * Prepare data and filter of unnessessary values, then send to DB.
     */
    const cbModalSubmit = (foodId, foodData) => {
        // check modal mode (Add/Edit) and dispatch accordingly
        const callback = foodId ? foodsRequests.put(foodId, foodData) : foodsRequests.post(foodData);
        callback.then(loadFoods);
        cbModalClose();
    };
    
    /**
     * CLICK handler for each food's delete button.
     * Delete food after confirmation, then refresh list if deleted successfully (status 204)
     * @param {String} id 
     */
    const cbDeleteFood = async (id) => {
        setModalIsVisible(false);
        const selectedFood = await foodsRequests.get(id);
        const proceed = window.confirm(`Are you sure you want to delete "${selectedFood.title}"?`);
        if (proceed) {
            const response = await foodsRequests.delete(id);
            if (response.status === 204) loadFoods();
        }
    }

    // runs every time the foods or filter change
    useEffect(() => {
        const result = foods.filter(food => categoryFilter === "" || food.category === categoryFilter);
        setFilteredFoods(result);
    }, [foods, categoryFilter]);

    /**
     * CHANGE event handler for the category filter.
     * @param {Event} e 
     */
    const cbCategoryFilter = (e) => {
        const selectedCategory = e.target.value;
        setCategoryFilter(selectedCategory);
    }

    const selectedCategory = categoryFilter === "" ? "other" : categoryFilter;

    return <Card >
            <div className={styles["card-container"]}>
                <h2>MANAGE FOOD ITEMS</h2>
                <DropDownList hasEmpty={true} label="Filter by Category" className={styles["ddl--category"]}
                    options={defaults.categories} onChange={cbCategoryFilter} 
                />
                <Button className={styles["btn--add-item"]} text="add food" onClick={() => cbModalOpen(null)} />
            </div>
        <MenuItemsList 
            itemsData={filteredFoods} 
            onItemClick={cbModalOpen} 
            onDeleteItem={cbDeleteFood}
        />
        <ManageFood_Modal 
            visible={modalIsVisible} 
            closeButtonHandler={cbModalClose}
            submitButtonHandler={cbModalSubmit} 
            selectedFoodId={selectedFoodId}
            selectedCategory={selectedCategory}
        />
    </Card>
}

export default ManageFoods;
