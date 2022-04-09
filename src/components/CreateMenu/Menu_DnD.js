import React from "react";
import { FOODS as defaults } from "store/config.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MenuItem from "components/CreateMenu/MenuItem.js";
import styles from "styles/CreateMenu.module.css";

/**
 * COMPONENT of CreateMenu.js
 * DropDownList containing all available menu options as stored in the DB.
 * @param {Object} props - { itemList: Object, onDragDrop: function }
 * @returns {JSX}
 */
 const MenuList_DnD = (props) => {
    const { itemList, onDragDrop, visible } = props;

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
                            <MenuItem itemData={item} />
                        </div>
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    }

    if (result.length === 0) result = <h2>No menu options have been selected...</h2>;
    
    const mask = visible ? "" : "hidden";

    return <div className={mask}>
        {result}
    </div>
 }

export default MenuList_DnD
