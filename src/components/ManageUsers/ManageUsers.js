import React, { useState, useEffect } from "react";
import { Button, LoadingSpinner, Title } from "components/generic.js";
import { usersRequests } from "store/connections.js";
import { useModal } from "store/hooks.js";
import UsersList from "components/ManageUsers/UsersList.js";
import User_Modal from "components/ManageUsers/User_Modal.js";
import styles from "styles/ManageUsers.module.css";

 export default () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ users, setUsers ] = useState([]);
    const [ selectedUserId, setSelectedUserId ] = useState(null);
    const [ modalIsVisible, setModalIsVisible ] = useState(false);
    const { displayAlert, displayConfirm } = useModal();

    // runs only the first time and loads all available items of the specified type
    useEffect(() => loadUsers(), []);

    /**
     * Load all users from the DB
     */
     const loadUsers = async () => {
        const fetchedUsers = await usersRequests.getAll();
        setUsers( fetchedUsers ?? [] );
        setIsLoading(false);
    }

    const cbUserSelected = (email) => {
        cbModalOpen(email);
    }

    const cbUserDelete = async (email) => {
        const proceed = await displayConfirm(`Are you sure you want to delete this User?`);
        if (proceed) {
            const response = await usersRequests.delete(email);
            if (response.status === 204) {
                displayAlert(
                    <div>
                        <p>User has been removed from the system.</p>
                        <p>Proceed with necessary changes in auth0.com</p>
                    </div>
                );
                loadUsers();
            }
        }
    }

    const cbSubmitUser = async (mode, userData) => {
        const { _id, name, roles } = userData;
        const result = { _id, name };
        result.roles = Object
            .entries(roles)
            .filter(([role, roleData]) => roleData.checked)
            .map(([role, roleData]) => role);
        
        const response = (mode === "add")
            ? await usersRequests.post(result)
            : await usersRequests.put(_id, result);
        
        if (response.ok) {
            displayAlert("User data have been saved.");
            cbModalClose();
            loadUsers();
        }
    }

    /**
     * Callback to open the modal.
     * If given itemId is null then the modal opens in ADD mode (empty form)
     * else opens in EDIT mode for the selected menu item (prefilled).
     * @param {String} itemId 
     */
    const cbModalOpen = (email) => {
        setSelectedUserId(email);
        setModalIsVisible(true);
    }
    
    /**
     * Callback to close the menu item modal.
     */
    const cbModalClose = () => {
        setSelectedUserId(null);
        setModalIsVisible(false);
    }

    if (isLoading) return ( <LoadingSpinner /> );

    return (
        <div className={styles["master-container"]}>
            <div className={styles["top-panel"]} >
                <Title text="Manage Users" />
                <div>
                    <Button 
                        className={styles["btn--add-user"]} 
                        text="add user"
                        onClick={() => cbModalOpen(null)} 
                    />
                </div>
            </div>
            <UsersList 
                users={users} 
                onUserClick={cbUserSelected}
                onDeleteUser={cbUserDelete}
            />
            <User_Modal 
                userId={selectedUserId} 
                onClose={cbModalClose} 
                onSubmit={cbSubmitUser}
                visible={modalIsVisible}
            />
        </div>
    );
}
