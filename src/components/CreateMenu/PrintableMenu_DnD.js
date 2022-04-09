import React from "react";
import PrintableMenuList from "components/CreateMenu/PrintableMenuList.js";
import { toPrintableDate } from "store/utils.js";
import styles from "styles/CreateMenu.module.css";

/**
 * COMPONENT of CreateMenu.js
 * Render an A4-sized preview printable restaurant menu.
 * Not stored in DB, all work happens in main memory.
 * @param {Object} props - { fontSize: Number, itemList: Object, visible: Boolean }
 * @returns {JSX}
 */
const PrintableMenu = React.forwardRef((props, ref) => {
    const { visible, itemList, fontSize, onDragDrop, menuDate } = props;

    const mask = visible ? "" : "hidden";
    const classList = [styles["printable"], mask].join(" ");

    return <div className={classList} ref={ref}>
        <div className={styles["printableInside"]} >
            <h2>Lunch menu, {toPrintableDate(menuDate)}</h2>
            <PrintableMenuList 
                fontSize={fontSize} 
                itemList={itemList} 
                onDragDrop={onDragDrop} 
            />
        </div>
    </div>
});

export default PrintableMenu;