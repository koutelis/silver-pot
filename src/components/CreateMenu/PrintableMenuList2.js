import React from "react";
import { FOODS as defaults } from "store/defaults.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PrintableMenuItem from "components/CreateMenu/PrintableMenuItem.js"
import styles from "styles/CreateMenu.module.css";


/**
 * SUBCOMPONENT of PrintableMenu.js
 * @param {Object} props - {fontSize: Number, itemList: Array}
 * @returns {JSX} PrintableMenuItem[]
 */
const PrintableMenuList2 = (props) => {
    const { fontSize, itemList, onDragDrop, visible } = props;

    const categories = Object.keys(defaults.categories);
    let result = [];

    categories.forEach(category => {
        const currentList = itemList[category];
        if (currentList && currentList.length) {
            result.push(<>
                <div className={styles["menu-category-heading"]}>~ {defaults.categories[category]} ~</div>
                <DragDropContext onDragEnd={onDragDrop}>
                    <Droppable droppableId={category}>
                        {provided => setDroppables(provided, currentList)}
                    </Droppable>
                </DragDropContext>
            </>);
        }
    });

    const setDroppables = (provided, currentList) => {
        return <div {...provided.droppableProps} ref={provided.innerRef}>
            {currentList.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                    {provided => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <PrintableMenuItem itemData={item} />
                        </div>
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    }

    const mask = visible ? "" : "hidden";

    if (itemList.length === 0) return <h2>No menu options have been selected...</h2>

    return <div >
        {result}
    </div>
}

export default PrintableMenuList2;
