import React from "react";

/**
 * COMPONENT of PrintableMenu.js
 * Restaurant menu item for the printable menu.
 * @param {Object} props - { itemData: {_id: String, basePrice: Number, name: String, description: String} }
 * @returns {JSX}
 */
 const PrintableMenuItem = (props) => {
    const {basePrice, name, description} = props.itemData;

    return <div style={props.style}>
        <div>
            <h3>{name}<span> - €{basePrice.toFixed(2)}</span></h3>
        </div>
        <div>
            <span>{description}</span>
        </div>
    </div>
}

export default PrintableMenuItem;