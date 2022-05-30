import React from "react";
import { DelButton } from "components/generic.js";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "styles/ManageUsers.module.css";

const RolesDisplay = ({roles}) => {
    const label = roles.length === 1 ? "Role" : "Roles";
    const rolesText = roles.length ? roles.join(", ") : "None";

    return (
        <div>
            <span>{label} adopted: </span><span>{rolesText}</span>
        </div>
    );
}

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};

const User = (props) => {
    const { _id: email, name, roles } = props.userData;
    const { onClick, onDelete } = props;

    return (
        <div className={styles["user"]} onClick={() => onClick(email)} >
            <DelButton className={styles["btn--del-user"]} 
                tooltip={`delete ${name}`} onClick={() => onDelete(email)} 
            />
            <fieldset>
                <legend>{name}</legend>
                <div><h3>{email}</h3></div>
                <RolesDisplay roles={roles} />
            </fieldset>
        </div>
    );
}

export default User;