import React, { useState } from "react";
import { foodRequests } from "store/http-requests.js"
import Card from "components/UI/Card.js";
import Button from "components/UI/Button.js";
import ModalManageFood from "components/ManageMenu/ModalManageFood/ModalManageFood.js";
import styles from "styles/ManageFoods.module.css";

/**
 * Related to ManageMenu folder.
 * @param {Object} props
 * @returns {JSX}
 */
const CreateFood = (props) => {

    // state
    const [formVisible, setFormVisible] = useState(false);

    /**
     * CLICK event handler for the 'toggle' and 'x' buttons.
     */
    const cbToggleModal = () => {
        setFormVisible(!formVisible);
    };

    /**
     * CLICK event handler for the form submit button.
     * Prepare data and filter of unnessessary values, then send to DB.
     */
    const cbSubmitForm = (data) => {
        const addons = Object
            .values(data.addons)
            .filter((addon) => Boolean(addon) && Boolean(addon["title"]));
        const removables = Object
            .values(data.removables)
            .filter((rmv) => Boolean(rmv) && Boolean(rmv["title"]));

        const food = { ...data.main, addons, removables }
        foodRequests.post(food);
        setFormVisible(false);
        props.onSubmit();
    };

    return <Card>
        <ModalManageFood
            visible={formVisible}
            closeButtonHandler={cbToggleModal}
            submitButtonHandler={cbSubmitForm}
            selectedFoodId={null}
        />
        <Button className={styles["btn-menu"]} text="add new" onClick={cbToggleModal} />
    </Card>
}

export default CreateFood;
