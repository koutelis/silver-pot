import React, { useState } from "react";
import { DropDownList, Title } from "components/generic.js";
import { MENUS } from "store/config.js";
import ManageFoods from "components/ManageMenu/ManageFoods.js";
import ManageDrinks from "components/ManageMenu/ManageDrinks.js";
import styles from "styles/ManageMenu.module.css";

/**
 * FR1: The system must include a section where administrators can store the menu options. 
 * The menu is changing on a daily basis and there are currently more than 160 dishes 
 * to choose from and form a set of about 20 of them for a single day. 
 * Admins must be able to create, read, update and delete the choices, 
 * what is referred to as CRUD operations.
 * @returns {JSX}
 */
const ManageMenu = () => {
    const [selectedSection, setSelectedSection] = useState("foods");

    const cbSectionSelected = (e) => {
        setSelectedSection(e.target.value);
    }

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title text="Manage Menu" />
            <DropDownList
                className={styles["ddl--menu-item-type"]} 
                label="Select menu-item type" 
                options={MENUS.itemTypes} 
                onChange={cbSectionSelected} 
            />
        </div>
        {selectedSection === "foods" ? <ManageFoods /> : <ManageDrinks /> }
    </div>
}

export default ManageMenu;
