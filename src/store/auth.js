import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useModal } from "store/hooks.js";

const LogButton = (props) => {
    const { className } = props;
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const { displayConfirm } = useModal();

    const onClick = async () => {
        if (isAuthenticated) {
            const proceed = await displayConfirm("Are you sure you want to log-out?");
            if (proceed) logout();
        } else {
            loginWithRedirect();
        }
    }

    const text = isAuthenticated ? "Log Out" : "Log In";

    return ( 
        <div className={className} onClick={onClick}>
            <span>{text}</span>
        </div>
    );
}

const hasPermission = (user, route) => {
    const permittedRoles = route.permissions;
    if (!permittedRoles.length) return false;
    if (permittedRoles.includes("guest")) return true;
    if (!user) return false;

    for (let role of user.roles) {
        if (permittedRoles.includes(role)) return true;
    }
    
    return false;
}

export { LogButton, useAuth0, hasPermission };
