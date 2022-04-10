import React, { useState, useEffect, useRef } from "react";
import { foodsRequests, restaurantmenusRequests } from "store/http-requests.js";
import { Button, Card, Input, Title } from "components/generic.js";
import { cloneObject, tomorrowAsString } from "store/utils.js";
import { useReactToPrint } from "react-to-print";
import { MENUS as defaults } from "store/config.js";
import MenuItemAdd_Modal from "components/CreateMenu/MenuItemAdd_Modal.js";
import PrintableMenu_DnD from "components/CreateMenu/PrintableMenu_DnD.js"
import Menu_DnD from "components/CreateMenu/Menu_DnD.js";
import styles from "styles/CreateMenu.module.css";

/**
 * FR2: The system must enable the owner to compose the daily menu. 
 * The selected options will automatically fill a print-ready template menu, as it is meant for hand out.
 * @returns {JSX}
 */
const CreateMenu = () => {
    const [items, setItems] = useState({});
    const [selectedDate, setSelectedDate] = useState(tomorrowAsString());
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [isPrintView, setIsPrintView] = useState(false);
    const [fontSize, setFontSize] = useState(14);

    // runs only first time
    useEffect(async () => {
        // load the template menu
        const response = await restaurantmenusRequests.get("template");
        const { fontSize: fetchedFontSize, items: fetchedItems } = response;
        setFontSize(fetchedFontSize ?? 14);
        setItems(fetchedItems ?? cloneObject(defaults.template));
        
        // find out window width to display the appropriate view
        setIsPrintView(window.innerWidth > 768);
    }, []);

    /**
     * CHANGE handler for the selected date.
     * @param {Event} e 
     */
    const cbDateChange = (e) => setSelectedDate(e.target.value);

    /**
     * DRAG & DROP event handler for the MenuList
     * Item is removed if moved outside droppable container
     * @param {Object} movedItem
     */
    const cbHandleDragDrop = (movedItem) => {
        setItems(snapshot => {
            const currentCategory = movedItem.source.droppableId;
            const [reorderedItem] = snapshot[currentCategory].splice(movedItem.source.index, 1);  // remove dragged item
            if (movedItem.destination) {
                snapshot[currentCategory].splice(movedItem.destination.index, 0, reorderedItem);  // add dropped item
            }
            return { ...snapshot };
        });
    };

    /**
     * CHANGE event handler for the DropDownList of available menu items.
     * @param {Event} e 
     */
    const cbSelectItemAdd = async (itemId) => {
        if (!itemId) return;

        const foodItem = await foodsRequests.get(itemId);
        const exists = items[foodItem.category].some(item => item._id === foodItem._id);
        if (exists) {
            alert("item already exists");
            return;
        }

        setItems(snapshot => {
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
     * CLICK event handler for the 'Save Template' button.
     */
    const cbSaveMenu = async () => {
        const _id = selectedDate;
        const data = { date: selectedDate, fontSize, items };
        await restaurantmenusRequests.put(_id, data);
        alert("daily menu saved");
    }

    const cbSaveTemplate = async () => {
        const _id = "template";
        const data = { date: null, fontSize, items };
        await restaurantmenusRequests.put(_id, data);
        alert("menu saved as template");
    }

    // reference to printable component and its print handler
    const printableMenuRef = useRef(null);
    const handlePrint = useReactToPrint({ content: () => printableMenuRef.current });

    // adjust dynamic buttons
    const printMask = isPrintView ? "" : "hidden";
    const btnSwitchText = `Switch to ${isPrintView ? "Block" : "Print"} view`;
    const btnPrint_ClassList = [styles["btn--print-menu"], printMask].join(" ");
    const printableCtrls_ClassList = [styles["printable-ctrls"], printMask].join(" ");

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="Set Menu of the Day" />
            <Input 
                className={styles["date"]} label="Select date" htmlFor="font-size" name="font-size" type="date" 
                onChange={cbDateChange} value={selectedDate} 
            />
            <div className={styles["top-panel-btns"]}>
                <Button className={styles["btn--toggle-view"]} text={btnSwitchText} type="button" onClick={() => setIsPrintView(!isPrintView)} />
                <Button className={styles["btn--open-modal"]} text="Add Item" onClick={() => setModalIsVisible(true)} />
                <Button className={styles["btn--save-menu"]} text="Save Menu" onClick={cbSaveMenu} />
                <Button className={btnPrint_ClassList} text="Print Menu" onClick={handlePrint} />
            </div>
        </div>
        <Card className={styles["card"]}>
            <div className={printableCtrls_ClassList}>
                <Input
                    label="Font size" htmlFor="font-size" name="font-size" type="number" min="8" max="20" step="1"
                    onChange={(e) => setFontSize(e.target.value)} value={fontSize}
                />
                <Button className={styles["btn--save-template"]} text="Save Template" onClick={cbSaveTemplate} />
            </div>
            <PrintableMenu_DnD 
                visible={isPrintView}
                menuDate={selectedDate}
                itemList={items} 
                onDragDrop={cbHandleDragDrop} 
                fontSize={fontSize} 
                ref={printableMenuRef} />
            <Menu_DnD visible={!isPrintView} itemList={items} onDragDrop={cbHandleDragDrop} />
        </Card>
        <MenuItemAdd_Modal 
            onClose={() => setModalIsVisible(false)} 
            onSelection={cbSelectItemAdd} 
            selectedItems={items} 
            visible={modalIsVisible} 
        />
    </div>
}

export default CreateMenu;