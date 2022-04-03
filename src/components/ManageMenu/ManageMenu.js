import React, { useState } from "react";
import { DropDownList } from "components/generic.js";
import ManageFoods from "components/ManageMenu/ManageFoods/ManageFoods.js";
import ManageDrinks from "components/ManageMenu/ManageDrinks/ManageDrinks.js";

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

    const options = {
        foods: "foods",
        drinks: "drinks"
    }

    const cbSectionSelected = (e) => {
        setSelectedSection(e.target.value);
    }

    return <>
        <DropDownList label="Select item type " options={options} onChange={cbSectionSelected} />
        {selectedSection === "foods" ? <ManageFoods /> : <ManageDrinks /> }
    </>
}

export default ManageMenu;
