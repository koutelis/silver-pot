import React, { useState, useEffect } from "react";
import { Button, Checkbox_Label, Input, ModalWindow } from "components/generic.js";
import { USERS } from "store/config.js";
import { cloneObject } from "store/utils";
import { usersRequests }from "store/connections.js";
import styles from "styles/ManageUsers.module.css"

const User_Modal = (props) => {
    const { onClose, onSubmit, userId, visible } = props;
    const [ user, setUser ] = useState( cloneObject(USERS.user) );
    const [ mode, setMode ] = useState("add");

    // reset form inputs and preselect user data according to user's email (from ManageUsers.js)
    useEffect(async () => {
        let isMounted = true;
        setMode(Boolean(userId) ? "edit" : "add");
        if (userId) {
            const fetchedUser = await usersRequests.get(userId);
            if (isMounted) {
                setUser(snapshot => {
                    const result = { ...snapshot, name: fetchedUser.name, _id: fetchedUser._id };
                    fetchedUser.roles.forEach(role => {
                        result.roles[role].checked = true;
                    });
                    return result;
                });
            }
        } else resetFormData();
        return () => { isMounted = false };
    }, [userId])

    /**
     * Reset all inputs.
     */
    const resetFormData = () => {
        setUser( cloneObject(USERS.user) );
    }

    const cbInputChange = (e) => {
        const { name: property, value } = e.target;
        setUser(snapshot => ({ ...snapshot, [property]: value}));
    }

    const cbRoleCheck = (prevChecked, role) => {
        setUser(snapshot => {
            const result = { ...snapshot };
            result.roles[role].checked = !prevChecked;
            return result;
        });
    }

    const prepRoles = () => {
        return Object.entries(user.roles).map(([role, roleData]) => (
            <Checkbox_Label
                key={role}
                type="checkbox"
                name={role}
                value={role}
                checked={roleData.checked}
                label={roleData.label}
                onClick={() => cbRoleCheck(roleData.checked, role)}
            />
        ));
    }

    return (
        <ModalWindow onClose={onClose} visible={visible}>
            <form className={styles["modal-form"]} >
                <Input 
                    label="Name:" name="name" type="text" 
                    value={user.name} onChange={cbInputChange} 
                />
                <Input 
                    label="eMail:" name="_id" type="text" 
                    value={user._id} onChange={cbInputChange} 
                />
                <div className={styles["cbx-roles"]}>
                    <div><label>Assign role(s) to user:</label></div>
                    <div>{prepRoles()}</div>
                </div>
                <Button 
                    className={styles["btn-save"]}
                    onClick={() => onSubmit(mode, user)} 
                    text="SAVE"
                />
            </form>
        </ModalWindow>
    );
}

export default User_Modal;