import React, { useState, useRef } from "react";
import { useAsync } from "store/hooks.js";
import { foodsRequests, restaurantmenusRequests } from "store/http-requests.js";
import { Button, Card, Input, Title } from "components/generic.js";
import { cloneObject, tomorrowAsString } from "store/utils.js";
import { useReactToPrint } from "react-to-print";
import { MENUS as defaults } from "store/config.js";
import DailyMenu_DnD from "components/CreateMenu/DailyMenu_DnD.js"
import MenuItemAdd_Modal from "components/CreateMenu/MenuItemAdd_Modal.js";
import styles from "styles/CreateMenu.module.css";

/**
 * FR2: The system must enable the owner to compose the daily menu. 
 * The selected options will automatically fill a print-ready template menu, 
 * as it is meant for handing out to customers.
 * @returns {JSX}
 */
const CreateMenu = () => {
    const [foods, setFoods] = useState({});
    const [drinks, setDrinks] = useState({});
    const [date, setDate] = useState(tomorrowAsString());
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [isPrintView, setIsPrintView] = useState(false);
    const [fontSize, setFontSize] = useState(14);

    // runs only first time
    useAsync(
        () => restaurantmenusRequests.get("template"), 
        (response) => {
            const { fontSize: fetchedFontSize, foods: fetchedFoods, drinks: fetchedDrinks } = response;
            setFontSize(fetchedFontSize ?? defaults.template.fontSize);
            setFoods(fetchedFoods ?? cloneObject(defaults.template.foods));
            setDrinks(fetchedDrinks ?? cloneObject(defaults.template.drinks));
            setIsPrintView(window.innerWidth > 768);  // find out window width to display the appropriate view
        }
    );

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
            alert("food already entered in the menu");
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
        await restaurantmenusRequests.put(_id, data);
        alert("daily menu saved");
    }

    /**
     * CLICK event handler for the 'Save Template' button.
     */
    const cbSaveTemplate = async () => {
        const _id = "template";
        const data = { date: null, fontSize, foods, drinks };
        await restaurantmenusRequests.put(_id, data);
        alert("menu saved as template");
    }

    // reference to printable component and its print handler
    const printableMenuRef = useRef(null);
    const handlePrint = useReactToPrint({ content: () => printableMenuRef.current });

    // adjust dynamic buttons
    const printMask = isPrintView ? "" : "hidden";
    const btnSwitchText = `Switch to ${isPrintView ? "Block" : "Print"} view`;

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="Set Menu of the Day" />
            <Input 
                className={styles["date"]} label="Select date" htmlFor="font-size" name="font-size" type="date" 
                onChange={cbDateChange} value={date} 
            />
            <div className={styles["top-panel-btns"]}>
                <Button className={styles["btn--toggle-view"]} text={btnSwitchText} type="button" onClick={() => setIsPrintView(!isPrintView)} />
                <Button className={styles["btn--open-modal"]} text="Add Item" onClick={() => setModalIsVisible(true)} />
                <Button className={styles["btn--save-menu"]} text="Save Menu" onClick={cbSaveMenu} />
                <Button className={[styles["btn--print-menu"], printMask].join(" ")} text="Print Menu" onClick={handlePrint} />
            </div>
        </div>
        <Card className={styles["card"]}>
            <div className={[styles["printable-ctrls"], printMask].join(" ")}>
                <Input
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
}

export default CreateMenu;