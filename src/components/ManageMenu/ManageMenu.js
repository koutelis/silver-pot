import React, { useState } from "react";
import { DropDownList, Title } from "components/generic.js";
import { MENUS } from "store/config.js";
import ManageMenuItems from "components/ManageMenu/ManageMenuItems.js";
import styles from "styles/ManageMenu.module.css";

/**
 * FR1: The system must include a section where administrators can store the menu options. 
 * The menu is changing on a daily basis and there are currently more than 160 dishes 
 * to choose from and form a set of about 20 of them for a single day. 
 * Admins must be able to create, read, update and delete the choices, 
 * what is referred to as CRUD operations.
 * @returns {JSX}
 */
 export default () => {
    const [ selectedMenuItemType, setSelectedMenuItemType ] = useState("foods");

    /**
     * CHANGE event handler for the menu-item type DDL.
     * @param {Event} e 
     */
    const cbSectionSelected = (e) => {
        setSelectedMenuItemType(e.target.value);
    }

    return (
        <div className={styles["master-container"]}>
            <div className={styles["top-panel"]} >
                <Title text="Manage Menu" />
                <DropDownList
                    className={styles["ddl--menu-item-type"]} 
                    label="Select menu-item type" 
                    options={MENUS.itemTypes} 
                    onChange={cbSectionSelected}
                    value={selectedMenuItemType}
                />
            </div>
            <ManageMenuItems menuItemType={selectedMenuItemType} />
        </div>
    );
}

