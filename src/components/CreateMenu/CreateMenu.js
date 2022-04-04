import React, { useState, useEffect } from "react";
import { foodRequests, menuRequests } from "store/http-requests.js";
import { Button, Card, Title } from "components/generic.js";
import MenuList_Selection from "components/CreateMenu/MenuList_Selection.js";
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
    const [previewMode, setPreviewMode] = useState(false);

    // first time: load the template menu
    useEffect(() => {
        menuRequests
            .getTemplate()
            .then(fetchedItems => setItems(fetchedItems));
    }, []);

    /**
     * DRAG & DROP event handler for the MenuList
     * @param {Object} movedItem
     */
    const cbHandleDragDrop = (movedItem) => {
        // remove item if moved outside droppable container
        if (!movedItem.destination) {
            setItems(snapshot => snapshot.filter(item => item._id !== movedItem.draggableId));
        } else {
            setItems((snapshot) => {
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
    const cbSelectItemAdd = (e) => {
        const itemId = e.target.value;
        if (itemId === "") return;

        foodRequests
            .get(itemId)
            .then(foodItem => {
                const exists = items.some(item => item._id === foodItem._id);
                if (exists) alert("item already exists");
                else setItems(snapshot => snapshot.concat([foodItem]));
            });
    }

    const cbSaveTemplate = () => menuRequests.saveTemplate(items);
    const btnText = `Switch to ${previewMode ? "Drag & Drop" : "Print"} mode`;

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="Create Menu" />
            <MenuList_Selection onSelection={cbSelectItemAdd} />
            <Button className={styles["btn--save-template"]} text="Save As Template" onClick={cbSaveTemplate} />
        </div>
        <Card className={styles["card"]}>
            <Button className={styles["btn--toggle-mode"]} text={btnText} type="button" onClick={toggleMode} />
            <PrintableMenu visible={previewMode} itemList={items} />
            <MenuList_DnD visible={!previewMode} itemList={items} onDragDrop={cbHandleDragDrop} />
        </Card>
    </div>
};

export default CreateMenu;
