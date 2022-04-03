import React, { useState, useEffect } from "react";
import { foodRequests } from "store/http-requests.js";
import { DropDownList } from "components/generic.js";
import { categories } from "store/defaults";

const MenuList_Selection = (props) => {
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState({});
    const [filter, setFilter] = useState("");
    const { onChange } = props;

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

    const cbFilterSelected = e => setFilter(e.target.value);

    return <div>
        <DropDownList hasEmpty={true} label="Select item to add" onChange={onChange} options={filteredOptions} />
        <DropDownList hasEmpty={true} label="Filter by Category" onChange={cbFilterSelected} options={categories.foods} />
    </div>
}

export default MenuList_Selection;
