import React from "react";

/**
 * COMPONENT of PrintableMenu.js
 * Restaurant menu item for the printable menu.
 * @param {Object} props - { itemData: {_id: String, basePrice: Number, title: String, description: String} }
 * @returns {JSX}
 */
 const PrintableMenuItem = (props) => {
    const {basePrice, title, description} = props.itemData;

    return <div style={props.style}>
        <div>
            <h3>{title}<span> - €{basePrice.toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default PrintableMenuItem;