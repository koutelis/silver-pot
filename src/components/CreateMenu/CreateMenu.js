import React, { useState, useEffect, useRef } from "react";
import { foodRequests, menuRequests } from "store/http-requests.js";
import { Button, Card, Input, ModalWindow, Title } from "components/generic.js";
import { useReactToPrint } from "react-to-print";
import MenuItemAdd_Modal from "components/CreateMenu/MenuItemAdd_Modal.js";
import PrintableMenu from "components/CreateMenu/PrintableMenu.js"
import MenuList_DnD from "components/CreateMenu/MenuList_DnD.js";
import styles from "styles/CreateMenu.module.css";

/**
 * FR2: The system must enable the owner to compose the daily menu. 
 * The selected options will automatically fill a print-ready template menu, as it is meant for hand out.
 * @returns {JSX}
 */
const CreateMenu = () => {
    const [items, setItems] = useState([]);
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [fontSize, setFontSize] = useState(14);

    // first time: load the template menu
    useEffect(() => {
        menuRequests
            .getTemplate()
            .then(response => {
                const { items: fetchedItems, fontSize: fetchedFontSize } = response;
                if (fetchedItems) setItems(fetchedItems);
                if (fetchedFontSize) setFontSize(fetchedFontSize);
            });
    }, []);

    const cbModalClose = () => setModalIsVisible(false);
    const cbModalOpen = () => setModalIsVisible(true);

    /**
     * DRAG & DROP event handler for the MenuList
     * @param {Object} movedItem
     */
    const cbHandleDragDrop = (movedItem) => {
        // remove item if moved outside droppable container
        if (!movedItem.destination) {
            setItems(snapshot => snapshot.filter(item => item._id !== movedItem.draggableId));
        } else {
            setItems(snapshot => {
                const [reorderedItem] = snapshot.splice(movedItem.source.index, 1); // remove dragged item
                snapshot.splice(movedItem.destination.index, 0, reorderedItem); // add dropped item
                return snapshot;
            });
        }
    };

    /**
     * CLICK event handler for the PrintableMenu's mode button.
     */
    const toggleMode = () => setPreviewMode(!previewMode);

    /**
     * CHANGE event handler for the DropDownList of available menu items.
     * @param {Event} e 
     */
    const cbSelectItemAdd = (itemId) => {
        if (!itemId) return;

        foodRequests
            .get(itemId)
            .then(foodItem => {
                const exists = items.some(item => item._id === foodItem._id);
                if (exists) alert("item already exists");
                else setItems(snapshot => snapshot.concat([foodItem]));
            });
        
        setModalIsVisible(false);
    }

    // reference to printable component and its print handler
    const printableMenuRef = useRef(null);
    const handlePrint = useReactToPrint({ content: () => printableMenuRef.current });

    /**
     * CLICK event handler for the 'Save Template' button.
     */
    const cbSaveTemplate = () => {
        menuRequests.saveTemplate({ items, fontSize });
        alert("menu saved");
    }

    // adjust dynamic buttons
    const printMask = previewMode ? "" : "hidden";
    const btnSwitchText = `Switch to ${previewMode ? "Drag & Drop" : "Print"} mode`;
    const btnPrintClassList = [styles["btn--print-menu"], printMask].join(" ");

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="Create Menu" />
            <div className={styles["top-panel-btns"]}>
                <Button className={styles["btn--toggle-mode"]} text={btnSwitchText} type="button" onClick={toggleMode} />
                <Button className={styles["btn--open-modal"]} text="Modal" onClick={cbModalOpen} />
                <Button className={styles["btn--save-template"]} text="Save Template" onClick={cbSaveTemplate} />
                <Button className={btnPrintClassList} text="Print Menu" onClick={handlePrint} />
            </div>
        </div>
        <Card className={styles["card"]}>
            <Input
                label="Font size" htmlFor="font-size" name="font-size" type="number" min="8" max="20" step="1"
                className={printMask} onChange={(e) => setFontSize(e.target.value)} value={fontSize}
            />
            <PrintableMenu visible={previewMode} itemList={items} fontSize={fontSize} ref={printableMenuRef} />
            <MenuList_DnD visible={!previewMode} itemList={items} onDragDrop={cbHandleDragDrop} />
        </Card>
        <ModalWindow onClose={cbModalClose} visible={modalIsVisible}>
            <MenuItemAdd_Modal onSelection={cbSelectItemAdd} selectedItems={items} />
        </ModalWindow>
    </div>
};

export default CreateMenu;