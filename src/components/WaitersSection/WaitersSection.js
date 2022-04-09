import React, { useState, useEffect } from "react";
import { restaurantmenusRequests } from "store/http-requests.js";
import { todayAsString } from "store/utils.js";
import { Button, Card, DropDownList, Input, ModalWindow, Title, Unimplemented } from "components/generic.js";
import { TABLES } from "store/config.js";
import MenuList from "components/WaitersSection/MenuList.js";
import styles from "styles/WaitersSection.module.css";

const WaitersSection = () => {
    const [foods, setFoods] = useState({});
    const [drinks, setDrinks] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderModalIsVisible, setOrderModalIsVisible] = useState(false);
    const [itemModalIsVisible, setItemModalIsVisible] = useState(false);

    // runs only first time, loads today's menu
    useEffect(async () => {
        const currentMenu = await restaurantmenusRequests.get( todayAsString() );
        const { items: fetchedItems } = currentMenu;
        if (fetchedItems) setFoods(fetchedItems);
    }, []);

    return <div className={styles["master-container"]}>
        <div className={styles["top-panel"]} >
            <Title className={styles["title"]} text="WAITERS SECTION" />
            <DropDownList className={styles["tables"]} label="Select table" onChange={(e) => console.log(e.target.value)} options={TABLES} />

            <div className={styles["top-panel-btns"]}>
                <Button className={styles["btn--open-modal"]} text="View Order" onClick={() => setOrderModalIsVisible(true)} />
                {/* <Button className={styles["btn--save-menu"]} text="Send Order" onClick={cbSaveMenu} /> */}
            </div>
        </div>
        <Card className={styles["card"]}>
            <MenuList items={foods} visible={true} />
        </Card>
        <ModalWindow onClose={() => setOrderModalIsVisible(false)} visible={orderModalIsVisible}>
            <div></div>
        </ModalWindow>
        <ModalWindow onClose={() => setItemModalIsVisible(false)} visible={itemModalIsVisible}>
            <div></div>
        </ModalWindow>
    </div>

    // return <Unimplemented title="Waiters section" />
}

export default WaitersSection;