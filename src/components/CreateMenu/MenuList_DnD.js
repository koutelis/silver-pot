import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MenuItem from "components/CreateMenu/MenuItem.js";

/**
 * Component of CreateMenu.js
 * DropDownList containing all available menu options as stored in the DB.
 * @param {Object} props - { itemList: Array, onDragDrop: function }
 * @returns {JSX}
 */
const MenuList_DnD = (props) => {
    const { itemList, onDragDrop } = props;
    
    const setDroppables = provided => {
        return <div {...provided.droppableProps} ref={provided.innerRef}>
            {itemList.map((item, index) => (
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

    if (itemList.length === 0) return <h2>No menu options have been selected...</h2>

    return <DragDropContext onDragEnd={onDragDrop}>
        <Droppable droppableId="droppable">
            {setDroppables}
        </Droppable>
    </DragDropContext>
}

export default MenuList_DnD
