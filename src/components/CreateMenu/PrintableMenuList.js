import React from "react";
import { FOODS as defaults } from "store/config.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PrintableMenuItem from "components/CreateMenu/PrintableMenuItem.js"
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of PrintableMenu.js
 * @param {Object} props - {fontSize: Number, itemList: Object, onDragDrop: function}
 * @returns {JSX} PrintableMenuItem[]
 */
const PrintableMenuList = (props) => {
    const { fontSize, itemList, onDragDrop } = props;

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
                            <PrintableMenuItem 
                                itemData={item} 
                                style={{fontSize: `${fontSize}px`}} 
                            />
                        </div>
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    }

    return <div>
        {result}
    </div>
}

export default PrintableMenuList;
