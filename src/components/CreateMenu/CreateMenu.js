import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { foodsRequests, drinksRequests, restaurantmenusRequests } from "store/connections.js";
import { cloneObject, tomorrowAsString } from "store/utils.js";
import { Button, Card, Input, LoadingSpinner, Title } from "components/generic.js";
import { MENUS as defaults } from "store/config.js";
import { useModal } from "store/hooks.js";
import DailyMenu_DnD from "components/CreateMenu/DailyMenu_DnD.js"
import MenuItemAdd_Modal from "components/CreateMenu/MenuItemAdd_Modal.js";
import styles from "styles/CreateMenu.module.css";

/**
 * FR2: The system must enable the owner to compose the daily menu. 
 * The selected options will automatically fill a print-ready template menu, 
 * as it is meant for handing out to customers.
 * @returns {JSX}
 */
 export default () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ foods, setFoods ] = useState({});
    const [ drinks, setDrinks ] = useState({});
    const [ date, setDate ] = useState(tomorrowAsString());
    const [ modalIsVisible, setModalIsVisible ] = useState(false);
    const [ isPrintView, setIsPrintView ] = useState(false);
    const [ fontSize, setFontSize ] = useState(14);
    const { displayAlert } = useModal();
    
    // runs only first time
    useEffect(async () => {
        let isMounted = true;
        const fetchedTemplateMenu = await restaurantmenusRequests.getTemplate();
        if (isMounted) {
            setFontSize(fetchedTemplateMenu.fontSize ?? defaults.template.fontSize);
            setFoods(fetchedTemplateMenu.foods ?? cloneObject(defaults.template.foods));
            setDrinks(fetchedTemplateMenu.drinks ?? cloneObject(defaults.template.drinks));
            setIsPrintView(window.innerWidth > 768);  // find out window width to display the appropriate view
            setIsLoading(false);
        }
        
        return () => { isMounted = false };
    }, []);

    
    /**
     * CHANGE handler for the selected date.
     * @param {Event} e 
     */
    const cbDateChange = (e) => setDate(e.target.value);

    /**
     * DRAG & DROP event handler for the MenuList
     * Item is removed if moved outside droppable container
     * @param {Object} movedItem
     */
    const cbHandleDragDrop = (movedItem) => {
        setFoods(snapshot => {
            const currentCategory = movedItem.source.droppableId;
            const [reorderedItem] = snapshot[currentCategory].splice(movedItem.source.index, 1);  // remove dragged food item
            if (movedItem.destination) {
                snapshot[currentCategory].splice(movedItem.destination.index, 0, reorderedItem);  // add dropped food item
            }
            return { ...snapshot };
        });
    };

    /**
     * CHANGE event handler for the DropDownList of available food items.
     * @param {Event} e 
     */
    const cbSelectFoodAdd = async (foodId, availability) => {
        if (!foodId) return;

        const foodItem = await foodsRequests.get(foodId);
        const exists = foods[foodItem.category].some(food => food._id === foodItem._id);
        if (exists) {
            displayAlert(`Food '${foodItem.name}' has already been selected`);
            return;
        }

        setFoods(snapshot => {
            foodItem.availability = availability;
            const currentCategory = foodItem.category;
            const changedCategory = snapshot[currentCategory].concat(foodItem);
            return  {
                ...snapshot,
                [currentCategory]: changedCategory
            }
        });
        
        setModalIsVisible(false);
    }

    /**
     * CLICK event handler for the 'Save Menu' button.
     */
    const cbSaveMenu = async () => {
        const _id = date;
        const data = { date, fontSize, foods, drinks };

        const res = await restaurantmenusRequests.put(_id, data);
        if (res) displayAlert("Daily menu saved!");
        restaurantmenusRequests.deletePast();
    }

    /**
     * CLICK event handler for the 'Save Template' button.
     */
    const cbSaveTemplate = async () => {
        const _id = "template";

        // update drinks
        const fetchedDrinks = await drinksRequests.getAllCategorized();
        const drinksCategorized = {};
        fetchedDrinks.forEach((elem) => (drinksCategorized[elem._id] = elem.items));

        const foodsCopy = {};
        Object.entries(foods).forEach(([cat, foodArr]) => {
            foodsCopy[cat] = foodArr.map(food => ({ ...food, availability: 10}));
        });

        // proceed
        const data = { 
            date: null, 
            fontSize, 
            foods: foodsCopy, 
            drinks: drinksCategorized 
        };
        await restaurantmenusRequests.put(_id, data);
        displayAlert("Menu saved as template!");
    }

    const cbAvailabilityChange = (e, foodItemData) => {
        const newAvailability = +e.target.value;
        const { category, _id } = foodItemData;
        setFoods(snapshot => {
            const index = snapshot[category].findIndex(food => food._id === _id);
            const tmp = { ...snapshot };
            tmp[category][index].availability = newAvailability;
            return tmp;
        })
    }

    // reference to printable component and its print handler
    const printableMenuRef = useRef(null);
    const handlePrint = useReactToPrint({ content: () => printableMenuRef.current });

    // adjust dynamic buttons
    const printMask = isPrintView ? "" : "hidden";
    const btnSwitchText = `Switch to ${isPrintView ? "Block" : "Print"} view`;

    
    if (isLoading) return ( <LoadingSpinner /> );
    
    return (
        <div className={styles["master-container"]}>
            <div className={styles["top-panel"]} >
                <Title className={styles["title"]} text="Set Menu of the Day" />
                <Input 
                    className={styles["date"]} label="Select date" htmlFor="font-size" name="font-size" type="date" 
                    onChange={cbDateChange} value={date} 
                />
                <div className={styles["top-panel-btns"]}>
                    <Button className={styles["btn--toggle-view"]} text={btnSwitchText} onClick={() => setIsPrintView(!isPrintView)} />
                    <Button className={styles["btn--open-modal"]} text="Add Item" onClick={() => setModalIsVisible(true)} />
                    <Button className={styles["btn--save-menu"]} text="Save Menu" onClick={cbSaveMenu} />
                    <Button className={[styles["btn--print-menu"], printMask].join(" ")} text="Print Menu" onClick={handlePrint} />
                </div>
            </div>
            <Card className={styles["card"]}>
                <div className={[styles["printable-ctrls"], printMask].join(" ")}>
                    <Input className={styles["input--font-size"]}
                        label="Font size" htmlFor="font-size" name="font-size" type="number" min="8" max="20" step="1"
                        onChange={(e) => setFontSize(e.target.value)} value={fontSize}
                    />
                    <Button className={styles["btn--save-template"]} text="Save Template" onClick={cbSaveTemplate} />
                </div>
                <DailyMenu_DnD 
                    isPrintView={isPrintView}
                    menuDate={date}
                    itemList={foods} 
                    onDragDrop={cbHandleDragDrop} 
                    onAvailabilityChange={cbAvailabilityChange}
                    fontSize={fontSize} 
                    ref={printableMenuRef} 
                />
            </Card>
            <MenuItemAdd_Modal 
                onClose={() => setModalIsVisible(false)} 
                onSelection={cbSelectFoodAdd} 
                selectedItems={foods} 
                visible={modalIsVisible} 
            />
        </div>
    );
}
