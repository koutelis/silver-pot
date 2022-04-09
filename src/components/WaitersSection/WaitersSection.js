import React, { useState, useEffect } from "react";
import { restaurantmenusRequests } from "store/http-requests.js";
import { todayAsString } from "store/utils.js";
import { Unimplemented } from "components/generic.js";
import MenuList from "components/WaitersSection/MenuList.js";


const WaitersSection = () => {
    const [foods, setFoods] = useState({});

    // runs only first time, loads today's menu
    useEffect(async () => {
        const currentMenu = await restaurantmenusRequests.get( todayAsString() );
        const { items: fetchedItems } = currentMenu;
        if (fetchedItems) setFoods(fetchedItems);
    }, []);

    return <>
        <MenuList items={foods} visible={true} />
    </>

    // return <Unimplemented title="Waiters section" />
}

export default WaitersSection;