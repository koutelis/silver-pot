import React, { useState, useEffect, useImperativeHandle } from "react";
import { LoadingSpinner } from "components/generic.js";
import { restaurantmenusRequests, subscriptions } from "store/connections.js";
import FoodsList_Availabilities from "components/KitchenSection/FoodsList_Availabilities.js";
import styles from "styles/KitchenSection.module.css";

/**
 * FR6. Concerning the selected daily menu, each dish will include its approximate available serving count. 
 * The system should be informing the kitchen and waiters 
 * when a dish has reached a certain low threshold of availability based on the predetermined count. 
 * For example, if 15 servings of fried eggs were set for the day and 12 customers already placed these orders, 
 * the system should broadcast a warning. Consequently, the staff should be able to mark a dish as unavailable for ordering.
 * @returns {JSX}
 */
const ManageAvailabilities = (props, ref) => {
    const { visible } = props;
    const [ isLoading, setIsLoading ] = useState(true);
    const [ foods, setFoods ] = useState([]);
    const [ currentMenu, setCurrentMenu ] = useState(null);

    useImperativeHandle(ref, () => {
        return { 
            submit: () => restaurantmenusRequests.updateCurrent({ ...currentMenu, foods })
        };
    });

    useEffect(() => {
        loadFoodMenu();

        // set websocket connection
        const socketCleanup = subscriptions.subscribeToMenuUpdates(loadFoodMenu);
        return socketCleanup;
    }, [])

    const loadFoodMenu = async () => {
        const todaysMenu = await restaurantmenusRequests.getCurrent();
        setCurrentMenu(todaysMenu);
        setFoods(todaysMenu.foods);
        setIsLoading(false);
    }

    const cbInputChange = (foodId, foodCategory, value) => {
        setFoods(snapshot => {
            const tmp = { ...snapshot };
            const index = tmp[foodCategory].findIndex(food => food._id == foodId);
            tmp[foodCategory][index].availability = value;
            return tmp;
        })
    }

    if (!visible) return null;
    
    if (isLoading) return ( <LoadingSpinner text="Loading current menu. Please wait..." /> );

    return ( <FoodsList_Availabilities foods={foods} onChange={cbInputChange} /> );
};

export default React.forwardRef(ManageAvailabilities);