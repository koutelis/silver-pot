import React, { useState, useEffect } from "react";
import { foodRequests } from "store/http-requests.js";
import { categories } from "store/defaults.js";
import { Button, Card, DropDownList } from "components/generic.js";
import ModalManageFood from "components/ManageMenu/ManageFoods/ModalManageFood/ModalManageFood.js";
import FoodList from "components/ManageMenu/ManageFoods/FoodList.js";
import styles from "styles/ManageMenuItems.module.css";

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
    const loadFoods = () => {
        foodRequests
            .getAll()
            .then(fetchedFoods => setFoods(fetchedFoods));
    }

    // runs only the first time and loads all food options
    useEffect(loadFoods, []);

    const cbModalOpen = (id) => {
        setSelectedFoodId(id);
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
        // filter optional data
        const addons = Object
            .values(data.addons)
            .filter((addon) => Boolean(addon) && Boolean(addon["title"]));
        const removables = Object
            .values(data.removables)
            .filter((rmv) => Boolean(rmv) && Boolean(rmv["title"]));
        
        // check modal mode (Add/Edit)
        const id = data.id;
        const food = { ...data.main, addons, removables };
        const callback = id ? foodRequests.put(id, food) : foodRequests.post(food);
        callback.then(loadFoods);
        setModalIsVisible(false);
    };
    
    /**
     * CLICK handler for each food's delete button.
     * Delete food after confirmation, then refresh list if deleted successfully (status 204)
     * @param {String} id 
     */
    const cbDeleteFood = async (id) => {
        setModalIsVisible(false);
        const selectedFood = await foodRequests.get(id);
        const proceed = window.confirm(`Are you sure you want to delete "${selectedFood.title}"?`);
        if (proceed) {
            const response = await foodRequests.delete(id);
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

    return <div className={styles["items-container"]}>
        <Card>
            <Button className={styles["btn-menu"]} text="add food" onClick={() => cbModalOpen(null)} />
            <DropDownList hasEmpty={true} label="Filter by Category" options={categories.foods} onChange={cbCategoryFilter} />
        </Card>
        <FoodList 
            foodsData={filteredFoods} 
            onFoodClick={cbModalOpen} 
            onFoodDelete={cbDeleteFood}
        />
        <ModalManageFood 
            visible={modalIsVisible} 
            closeButtonHandler={cbModalClose} 
            submitButtonHandler={cbModalSubmit} 
            selectedFoodId={selectedFoodId}
            selectedCategory={selectedCategory}
        />
    </div>
}

export default ManageFoods;
