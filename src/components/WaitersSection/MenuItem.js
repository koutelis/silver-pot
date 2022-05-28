import React from "react";
import { toCurrency } from "store/utils.js";
import styles from "styles/WaitersSection.module.css";

const optionVars = {
    addons: { prefix: "extra:", className: "addons" },
    removables: { prefix: "excluding:", className: "removables" },
    sizes: { prefix: "size:", className: "size" }
}

const OptionList = (props) => {
    let { options, optionType } = props;
    if (!options?.length) return null;

    if (optionType === "sizes") options = options.filter(opt => opt.checked);
    
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
    return ( <div className={styles["comments"]}>comment: "{content}"</div>  );
}

/**
 * SUBCOMPONENT of MenuItemsList.js
 * @param {Object} props - {itemData: Object, onClick: function}
 * @returns {JSX}
 */
 export const MenuItem = (props) => {
    const { itemData, onClick } = props;
    const { basePrice, name, totalPrice } = itemData;

    return (
        <div className={styles["menu-item"]} onClick={onClick}>
            <div>
                <h3>{name} - <span> {toCurrency(totalPrice ?? basePrice)}</span></h3>
            </div>
            <div className={styles["customizations"]}>
                <OptionList options={itemData.sizes} optionType="sizes" />
                <OptionList options={itemData.addons} optionType="addons" />
                <OptionList options={itemData.removables} optionType="removables" />
                <Comment content={itemData.comments} />
            </div>
        </div>
     );
}

/**
 * SUBCOMPONENT of MenuItemsList.js
 * @param {Object} props - {itemData: Object, onClick: function}
 * @returns {JSX}
 */
export const AvailableMenuItem = (props) => {
    const { itemData, itemType, onClick } = props;
    const { basePrice, description, name, totalPrice } = itemData;
    const isAvailable = itemType === "drinks" || (itemData.availability > 0);

    const cbClick = () => {
        if (isAvailable) onClick();
    }

    const strikeOut = !isAvailable ? styles["unavailable"] : "";
    const classList = [styles["menu-item"], styles["selectable"], strikeOut].join(" ");

    return (
        <div className={classList} onClick={cbClick}>
            <div>
                <h3>{name} - <span> {toCurrency(totalPrice ?? basePrice)}</span></h3>
            </div>
            <div>
                {description}
            </div>
        </div>
     );
}
