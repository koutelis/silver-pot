import React, { useState, useEffect, useRef } from "react";
import { foodRequests, menuRequests } from "store/http-requests.js";
import { Button, Card, Input, ModalWindow, Title } from "components/generic.js";
import { useReactToPrint } from "react-to-print";
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
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [isPrintView, setIsPrintView] = useState(false);
    const [fontSize, setFontSize] = useState(14);

    // runs only first time
    useEffect(() => {
        // load the template menu
        menuRequests
            .getTemplate()
            .then(response => {
                const { fontSize: fetchedFontSize, items: fetchedItems } = response;
                if (fetchedFontSize) setFontSize(fetchedFontSize);
                if (fetchedItems) setItems(fetchedItems);
            });
        
        // find out window width to display the appropriate view
        setIsPrintView(window.innerWidth > 768);
    }, []);

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
    const cbSelectItemAdd = (itemId) => {
        if (!itemId) return;

        foodRequests
            .get(itemId)
            .then(foodItem => {
                const exists = items[foodItem.category].some(item => item._id === foodItem._id);
                if (exists) alert("item already exists");
                else {
                    setItems(snapshot => {
                        const currentCategory = foodItem.category;
                        const changedCategory = snapshot[currentCategory].concat(foodItem);
                        return  {
                            ...snapshot,
                            [currentCategory]: changedCategory
                        }
                    });
                }
            });
        
        setModalIsVisible(false);
    }

    /**
     * CLICK event handler for the 'Save Template' button.
     */
    const cbSaveTemplate = () => {
        menuRequests.saveTemplate({ items, fontSize });
        alert("menu saved");
    }

    // reference to printable component and its print handler
    const printableMenuRef = useRef(null);
    const handlePrint = useReactToPrint({ content: () => printableMenuRef.current });


    // adjust dynamic buttons
    const printMask = isPrintView ? "" : "hidden";
    const btnSwitchText = `Switch to ${isPrintView ? "Block" : "Print"} view`;
    const btnPrintClassList = [styles["btn--print-menu"], printMask].join(" ");

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="Create Menu" />
            <div className={styles["top-panel-btns"]}>
                <Button className={styles["btn--toggle-view"]} text={btnSwitchText} type="button" onClick={() => setIsPrintView(!isPrintView)} />
                <Button className={styles["btn--open-modal"]} text="Add Item" onClick={() => setModalIsVisible(true)} />
                <Button className={styles["btn--save-template"]} text="Save Template" onClick={cbSaveTemplate} />
                <Button className={btnPrintClassList} text="Print Menu" onClick={handlePrint} />
            </div>
        </div>
        <Card className={styles["card"]}>
            <Input
                label="Font size" htmlFor="font-size" name="font-size" type="number" min="8" max="20" step="1"
                className={printMask} onChange={(e) => setFontSize(e.target.value)} value={fontSize}
            />
            <PrintableMenu_DnD visible={isPrintView} itemList={items} onDragDrop={cbHandleDragDrop} fontSize={fontSize} ref={printableMenuRef} />
            <Menu_DnD visible={!isPrintView} itemList={items} onDragDrop={cbHandleDragDrop} />
        </Card>
        <ModalWindow onClose={() => setModalIsVisible(false)} visible={modalIsVisible}>
            <MenuItemAdd_Modal onSelection={cbSelectItemAdd} selectedItems={items} />
        </ModalWindow>
    </div>
};

export default CreateMenu;