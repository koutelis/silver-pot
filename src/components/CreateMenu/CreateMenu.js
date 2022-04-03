import React, { useState, useEffect } from "react";
import { foodRequests, menuRequests } from "store/http-requests.js";
import { Button } from "components/generic.js";
import MenuList_Selection from "components/CreateMenu/MenuList_Selection.js";
import PrintableMenu from "components/CreateMenu/PrintableMenu.js"
import MenuList_DnD from "components/CreateMenu/MenuList_DnD.js";

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

    const mask = previewMode ? "hidden" : "";

    return (
        <div className="App">
            <Button text="Save As Template" onClick={cbSaveTemplate} />
            <MenuList_Selection onChange={cbSelectItemAdd} />
            <PrintableMenu itemList={items} onModeButtonClick={toggleMode} visible={previewMode} />
            <br/>
            <br/>
            <div className={mask}>
                <MenuList_DnD itemList={items} onDragDrop={cbHandleDragDrop} />
            </div>
        </div>
    );
};

export default CreateMenu;
