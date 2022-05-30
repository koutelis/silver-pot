import React from "react";
import { Checkbox_Label } from "components/generic.js";
import styles from "styles/KitchenSection.module.css";

const optionVars = {
    addons: { prefix: "extra:", className: "addons" },
    removables: { prefix: "excluding:", className: "removables" }
}

const OptionList = (props) => {
    const { options, optionType } = props;
    if (!options?.length) return null;
    
    const prefix = optionVars[optionType].prefix;
    const className = styles[optionVars[optionType].className];

    return (
        <div className={className}>
            <span>{prefix}</span>{'\u00A0'}{options.map(opt => opt.name).join(", ")}
        </div>
    );
}

const Comment = (props) => {
    const { content } = props;

    if (!content || content === "") return null;
    return ( <div className={styles["comments"]}>customer comment: "{content}"</div> );
}

const FoodDetails = (props) => {
    const { data, onClick } = props;

    return (
        <div className={styles["food-container"]}>
            <Checkbox_Label 
                type="checkbox" 
                name={data.name} 
                checked={data.complete} 
                label={data.name} 
                onClick={onClick} 
            />
            <div className={styles["customizations"]}>
                <OptionList options={data.addons} optionType="addons" />
                <OptionList options={data.removables} optionType="removables" />
                <Comment content={data.comments} />
            </div>
        </div>
    );
}

export default FoodDetails;