import React from "react";
import { FOODS as defaults } from "store/defaults.js";
import PrintableMenuItem from "components/CreateMenu/PrintableMenuItem.js"
import styles from "styles/CreateMenu.module.css";

/**
 * SUBCOMPONENT of PrintableMenu.js
 * @param {Object} props - {fontSize: Number, itemList: Array}
 * @returns {JSX} PrintableMenuItem[]
 */
const PrintableMenuList = (props) => {
    const { fontSize, itemList } = props;

    let currentCategory;

    return itemList.map(item => {
        let heading = <></>; 

        if (currentCategory !== item.category) {
            currentCategory = item.category;
            heading = <div className={styles["menu-category-heading"]}>~ {defaults.categories[currentCategory]} ~</div>;
        }
        return <>
            {heading}
            <PrintableMenuItem 
                key={item._id} 
                itemData={item} 
                style={{fontSize: `${fontSize}px`}} 
            />
        </>
    });
}

export default PrintableMenuList;