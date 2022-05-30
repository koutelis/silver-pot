import React from "react";
import { Checkbox_Label } from "components/generic.js";
import FoodDetails from "components/KitchenSection/FoodDetails.js";
import styles from "styles/BarSection.module.css";

const Size = (props) => {
    const { name } = props;

    if (!name || name === "") return null;
    return (
        <div className={styles["size"]}>
            <span>size:</span>{'\u00A0'}{name}
        </div>
    );
}

const Comment = (props) => {
    const { content } = props;

    if (!content || content === "") return null;
    return (
        <div className={styles["comments"]}>
            customer comment: "{content}"
        </div>
    );
}

export const DrinkDetails = (props) => {
    const { data, onClick } = props;

    return (
        <div className={styles["drink-container"]}>
            <Checkbox_Label 
                type="checkbox" 
                name={data.name} 
                checked={data.complete} 
                label={data.name} 
                onClick={onClick} 
            />
            <div className={styles["customizations"]}>
                <Size name={data.size.name} />
                <Comment content={data.comments} />
            </div>
        </div>
    );
}

export const DessertDetails = (props) => {
    return ( <FoodDetails {...props} /> );
}
