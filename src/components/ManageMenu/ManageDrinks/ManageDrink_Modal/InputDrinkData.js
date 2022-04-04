import React, { useState } from "react";
import InputDrinkDataBox_Generic from "components/ManageMenu/ManageDrinks/ManageDrink_Modal/InputDrinkDataBox_Generic.js";
import InputDrinkDataBox_Categories from "components/ManageMenu/ManageDrinks/ManageDrink_Modal/InputDrinkDataBox_Categories.js";
import InputDrinkDataBox_Description from "components/ManageMenu/ManageDrinks/ManageDrink_Modal/InputDrinkDataBox_Description.js";
import styles from "styles/ManageMenu_Modal.module.css"

/**
 * SUBCONTAINER component for ManageDrink_Modal CONTAINER form
 * @param {Object} props - {drinkData: Object, onChange: function}
 * @returns {JSX}
 */
const InputDrinkData = (props) => {
    const { drinkData, onChange: liftStateUp } = props;
    const [displayData, setDisplayData] = useState(true);
    
    /**
     * CHANGE event handler for Food DATA input (lift state up)
     * @param {Object} data - {name: String, title: String, price: Number}
     */
    const cbInputChanged = (inp) => {
        let {attribute, value} = inp;
        const newData = {
            ...drinkData,
            [attribute]: value
        }
        liftStateUp({
            attribute: "main",
            value: newData
        });
    }

    const mask = displayData ? "" : " hidden";

    return (
        <div className={styles["inputs__column"]}>
            <h3 className={styles["inputs__heading"]} onClick={(e) => setDisplayData(!displayData)}>Drink data</h3>
            <div className={`${styles["inputs__grid-container"]} ${mask}`}>

                <InputDrinkDataBox_Categories label="Category" name="category" value={drinkData.category} 
                    className="box-a" onChange={cbInputChanged} />

                <InputDrinkDataBox_Generic label="Title" name="title" value={drinkData.title} 
                    type="text" placeholder="a title" 
                    className="box-b" onChange={cbInputChanged} />

                <InputDrinkDataBox_Description label="Description" name="description" value={drinkData.description}
                    type="text" minLength="5" placeholder="a description" 
                    className="box-c" onChange={cbInputChanged} />

                <InputDrinkDataBox_Generic label="Price" name="basePrice" value={drinkData.basePrice} 
                    type="number" min="1" max="20" 
                    className="box-d" onChange={cbInputChanged} />

            </div>
        </div>
    )
}

export default InputDrinkData;
