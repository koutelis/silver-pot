import React, { useState } from "react";
import InputFoodDataBox_Generic from "components/ManageMenu/ManageFoods/ModalManageFood/InputFoodDataBox_Generic.js";
import InputFoodDataBox_Categories from "components/ManageMenu/ManageFoods/ModalManageFood/InputFoodDataBox_Categories.js";
import InputFoodDataBox_Description from "components/ManageMenu/ManageFoods/ModalManageFood/InputFoodDataBox_Description.js";
import styles from "styles/ModalManageMenuItem.module.css"

/**
 * SUBCONTAINER component for ModalManageMenuItem CONTAINER form
 * @param {Object} props - {foodData: Object, onChange: function}
 * @returns {JSX}
 */
const InputFoodData = (props) => {
    const { foodData, onChange: liftStateUp } = props;
    const [displayData, setDisplayData] = useState(true);
    
    /**
     * CHANGE event handler for Food DATA input (lift state up)
     * @param {Object} data - {name: String, title: String, price: Number}
     */
    const cbInputChanged = (inp) => {
        let {attribute, value} = inp;
        const newData = {
            ...foodData,
            [attribute]: value
        }

        liftStateUp({
            attribute: "main",
            value: newData});
    }

    const mask = displayData ? "" : " hidden";

    return (
        <div className={styles["inputs__column"]}>
            <h3 className={styles["inputs__heading"]} onClick={(e) => setDisplayData(!displayData)}>Food data</h3>
            <div className={`${styles["inputs__grid-container"]} ${mask}`}>

                <InputFoodDataBox_Categories label="Category" name="category" value={foodData.category} 
                    className="box-a" onChange={cbInputChanged} />

                <InputFoodDataBox_Generic label="Title" name="title" value={foodData.title} 
                    type="text" placeholder="a title" 
                    className="box-b" onChange={cbInputChanged} />

                <InputFoodDataBox_Description label="Description" name="description" value={foodData.description}
                    type="text" minLength="5" placeholder="a description" 
                    className="box-c" onChange={cbInputChanged} />

                <InputFoodDataBox_Generic label="Price" name="basePrice" value={foodData.basePrice} 
                    type="number" min="1" max="20" 
                    className="box-d" onChange={cbInputChanged} />

            </div>
        </div>
    )
}

export default InputFoodData;
