import React from "react";
import OptionsGroup from "components/WaitersSection/OptionsGroup.js";

/**
 * SUBCOMPONENT of MenuItemOrder_Modal.js
 * @param {Object} props 
 * @returns {JSX}
 */
const FoodOptions = (props) => {
    const { onCheckboxChange, options } = props;

    return <>
        <OptionsGroup 
            type="checkbox" 
            groupName="Addons" 
            propertyName="addons" 
            selections={options.addons} 
            onClick={onCheckboxChange} 
        />
        <OptionsGroup 
            type="checkbox" 
            groupName="Removables" 
            propertyName="removables" 
            selections={options.removables} 
            onClick={onCheckboxChange} 
        />
    </>
}

/**
 * SUBCOMPONENT of MenuItemOrder_Modal.js
 * @param {Object} props 
 * @returns {JSX}
 */
 const DrinkOptions = (props) => {
    const { onRadioChange, options } = props;

    return (
        <OptionsGroup 
            type="radio" 
            groupName="Sizes" 
            propertyName="sizes" 
            selections={options.sizes} 
            onClick={onRadioChange} 
        />
    )
}

export { FoodOptions, DrinkOptions };