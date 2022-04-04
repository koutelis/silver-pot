import React, { useRef } from "react";
import { Button } from "components/generic.js";
import ReactToPrint from "react-to-print";
import styles from "styles/CreateMenu.module.css";

/**
 * Component of CreateMenu.js
 * Render an A4-printable page containing the daily menu as set by CreateMenu.js.
 * Not stored in DB, all work happens in main memory.
 * @param {Object} props - { itemList: Array, onDragDrop: function }
 * @returns {JSX}
 */
 const PrintableMenu = (props) => {
    const { visible } = props;

    const mask = visible ? "" : "hidden";
    const classList = [styles["printable-container"], mask].join(" ");

    return <div className={classList}>
        <ComponentToPrintContainer {...props} />
    </div>
};

/**
 * Container for:
 * - a preview for the A4-sized printable restaurant menu (with adjustable visibility)
 * - a button to print the restaurant menu.
 * @param {Object} props
 * @returns {JSX}
 */
 const ComponentToPrintContainer = (props) => {
    const printableComponentRef = useRef();

    return <>
        <ReactToPrint
            trigger={() => <Button className={styles["btn--print-menu"]} text="Print Menu" />}
            content={() => printableComponentRef.current}
        />
        <ComponentToPrint ref={printableComponentRef} {...props}/>
    </>
}

/**
 * The actual A4-sized printable restaurant menu.
 * @param {Object} props - { itemList: Array }
 * @returns {JSX}
 */
const ComponentToPrint = React.forwardRef((props, ref) => {
    const dt = new Date();
    let [month, day] = dt.toLocaleString('default', { month: 'long', day: 'numeric' }).split(" ");
    day = toOrdinal(+day);

    return <div className={styles["printable"]} ref={ref}>
        <div className={styles["printableInside"]}>
            <h2>Lunch menu, {month} {day}</h2>
            {props.itemList.map(item => <PrintableMenuItem key={item._id} itemData={item} />)}
        </div>
    </div>
});

/**
 * Restaurant menu item for the printable menu.
 * @param {Object} props - {_id: String, basePrice: Number, title: String, description: String}
 * @returns {JSX}
 */
 const PrintableMenuItem = (props) => {
    const {basePrice, title, description} = props.itemData;

    return <div>
        <div>
            <h3>{title}<span> - €{basePrice.toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

/**
 * Helper.
 * Convert number to ordinal where number is a day of the month,
 * thus 1 <= n <= 31
 * @param {Number} n - Day of month
 * @returns {String}
 */
function toOrdinal(n) {
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    let suffix = "th";
    if (n <= 3 || n >=21)  suffix = suffixes[n % 10] ?? "th";
    return `${n}${suffix}`;
}

export default PrintableMenu;
