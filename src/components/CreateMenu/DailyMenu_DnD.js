import React from "react";
import { FOODS as defaults } from "store/config.js";
import { toPrintableDate } from "store/utils.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MenuItem from "components/CreateMenu/MenuItem.js";
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of CreateMenu.js
 * Dragable List containing all available menu options as stored in the DB.
 * @param {Object} props - {fontSize: Number, isPrintView: Boolean, itemList: Object, menuDate: String, onDragDrop: function}
 * @returns {JSX}
 */
const DailyMenu_DnD = React.forwardRef((props, ref) => {
    const { fontSize, isPrintView, itemList, menuDate, onDragDrop, onAvailabilityChange } = props;

    const categories = Object.keys(defaults.categories);
    let dndList = [];

    categories.forEach(category => {
        const currentList = itemList[category];
        if (currentList && currentList.length) {
            dndList.push(
                <div key={category}>
                    <div className={styles["menu-category-heading"]}>~ {defaults.categories[category].label} ~</div>
                    <DragDropContext onDragEnd={onDragDrop}>
                        <Droppable droppableId={category}>
                            {provided => setDroppables(provided, currentList)}
                        </Droppable>
                    </DragDropContext>
                </div>
            );
        }
    });

    const setDroppables = (provided, currentList) => {
        return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                {currentList.map((item, index) => (
                    <Draggable key={item._id + index} draggableId={item._id} index={index}>
                        {provided => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <MenuItem 
                                    itemData={item} 
                                    fontSize={fontSize} 
                                    isPrintView={isPrintView} 
                                    onAvailabilityChange={onAvailabilityChange}
                                />
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        );
    }

    if (dndList.length === 0) dndList = <h2>No menu options have been selected...</h2>;

    const outerDivClassName = isPrintView ? styles["printable"] : "";
    const innerDivClassName = isPrintView ? styles["printableInside"] : "";
    
    return (
        <div className={outerDivClassName} ref={ref}>
            <div className={innerDivClassName} >
                <h2>Lunch menu, {toPrintableDate(menuDate)}</h2>
                {dndList}
            </div>
        </div>
    );
})

export default DailyMenu_DnD;