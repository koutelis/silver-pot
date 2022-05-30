import React from "react";
import { Card } from "components/generic.js";
import User from "components/ManageUsers/User.js";
import styles from "styles/ManageUsers.module.css";

const UsersList = (props) => {
    const { users, onUserClick, onDeleteUser } = props;

    if (users.length === 0) return (
        <div className={`${styles["user-list-container"]} ${styles["user-list-container__empty"]}`} >
            <h3>No users found...</h3>
        </div>
    )

    return (
        <Card>
            <div className={styles["user-list-container"]} >
            <h3>App Users:</h3>
            <div className={styles["user-list"]} >
                {users.map(user => 
                    <User 
                        key={user._id} 
                        userData={user} 
                        onClick={onUserClick} 
                        onDelete={onDeleteUser} 
                    />)
                }
            </div>
        </div>
        </Card>
    );
}

export default UsersList;