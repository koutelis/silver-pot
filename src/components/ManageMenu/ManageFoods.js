import React, { useState, useEffect } from "react";
import { foodRequests } from "store/http-requests.js";
import FoodItem from "components/ManageMenu/FoodItem.js";
import AddFoodLinkbutton from "components/ManageMenu/AddFoodLinkbutton.js";
import ModalManageFood from "components/ManageMenu/ModalManageFood/ModalManageFood";
import styles from "styles/ManageFoods.module.css";

/**
 * FR1: The system must include a section where administrators can store the menu options. 
 * The menu is changing on a daily basis and there are currently more than 160 dishes 
 * to choose from and form a set of about 20 of them for a single day. 
 * Admins must be able to create, read, update and delete the choices, 
 * what is referred to as CRUD operations.
 * @returns {JSX}
 */
const ManageFoods = () => {
    // state
    const [foods, setFoods] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);

    /**
     * Fetch available food options from DB.
     */
    const loadFoods = () => {
        foodRequests.getAll()
            .then(fetchedFoods => setFoods(fetchedFoods));
    }

    useEffect(loadFoods, []);

    const cbEditModalOpen = (id) => {
        setEditModalVisible(true);
        setSelectedFoodId(id);
    }

    const cbEditModalClose = () => {
        setEditModalVisible(false);
    }

    /**
     * CLICK event handler for the edit modal's submit button.
     * Prepare data and filter of unnessessary values, then send to DB.
     */
    const cbEditModalSubmit = (data) => {
        const id = data.id;
        const addons = Object
            .values(data.addons)
            .filter((addon) => Boolean(addon) && Boolean(addon["title"]));
        const removables = Object
            .values(data.removables)
            .filter((rmv) => Boolean(rmv) && Boolean(rmv["title"]));

        const food = { ...data.main, addons, removables }
        setEditModalVisible(false);
        foodRequests.put(id, food);
        loadFoods();
    };
    
    /**
     * CLICK handler for each food's delete button.
     * Delete food after confirmation, then refresh list if deleted successfully (status 204)
     * @param {*} id 
     */
    const dbDeleteFood = async (id) => {
        setEditModalVisible(false);
        const selectedFood = await foodRequests.get(id);
        const proceed = window.confirm(`Are you sure you want to delete "${selectedFood.title}"?`);
        if (proceed) {
            const response = await foodRequests.delete(id);
            if (response.status === 204) loadFoods();
        }
    }

    /**
     * Prepare UL list of FoodItems.
     * @returns {JSX}
     */
    const listFoodItems = () => {
        const foodList = foods.map(food => <FoodItem key={food._id} foodData={food} onClick={cbEditModalOpen} onDelete={dbDeleteFood} />)
        return <ul> {foodList} </ul>
    }

    return <div className={styles["foods-container"]}>
        <AddFoodLinkbutton onSubmit={() => loadFoods()} />
        <h2>Available Options:</h2>
        {listFoodItems()}
        <ModalManageFood 
            visible={editModalVisible} 
            closeButtonHandler={cbEditModalClose} 
            submitButtonHandler={cbEditModalSubmit} 
            selectedFoodId={selectedFoodId}
        />
    </div>
}

export default ManageFoods;
