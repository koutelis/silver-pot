import React, { useState, useEffect } from "react";
import { foodRequests } from "store/http-requests.js";
import { DropDownList } from "components/generic.js";
import { ManageFood_Defaults as defaults } from "store/defaults";
import styles from "styles/CreateMenu.module.css";

const MenuList_Selection = (props) => {
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState({});
    const [filter, setFilter] = useState("");
    const { onSelection } = props;

    // runs only the first time to populate the items DDL options
    useEffect(() => {
        // fetch items from DB
        foodRequests
            .getAll()
            .then(fetchedItems => setOptions(fetchedItems));
    }, []);

    // runs whenever the category filter is changed
    useEffect(() => {
        let result = {};
        options
            .filter(option => filter === "" || option.category === filter)
            .forEach(option => result[option._id] = option.title);
        setFilteredOptions(result);
    }, [options, filter]);

    const cbFilterSelected = e => {
        setFilter(e.target.value);

    }

    let labelText = "Add an item";
    if (filter === "main") {
        labelText = `Add a main dish`
    } else if (filter.length) {
        const article = "aeiou".includes(filter[0]) ? "an" : "a";
        labelText = `Add ${article} ${filter}`;
    }

    return <>
        <DropDownList className={styles["ddl--menu-item-add"]} hasEmpty={true} label={labelText} onChange={onSelection} options={filteredOptions} />
        <DropDownList className={styles["ddl--category"]} hasEmpty={true} label="Filter by Category" onChange={cbFilterSelected} options={defaults.categories} />
    </>
}

export default MenuList_Selection;
