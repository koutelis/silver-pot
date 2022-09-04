import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { NAV_ROUTES } from "components/Body/Main.js";
import { usersRequests, subscriptions } from "store/connections.js";
import { LogButton, hasPermission, useAuth0 } from "store/auth.js";
import styles from "styles/Header.module.css";

const NavMenuHam = (props) => {
    const { currentUser } = props;
    const [ isExpanded, setIsExpanded ] = useState(false);

    const navLinks = Object
        .values(NAV_ROUTES)
        .filter(route => route.path !== "*")
        .map((route, index) => {
            if (!hasPermission(currentUser, route)) return null;
            return (
                <div key={index} className={styles["nav-link"]} onClick={() => setIsExpanded(!isExpanded)}>
                    <NavLink to={route.path}>{route.hamLabel ?? route.label}</NavLink>
                </div>
            );
        });
        
    const hamMenuClass = [
        styles["nav-menu__portrait"], 
        isExpanded ? "" : "hidden"
    ].join(" ");

    return (
        <div className={styles["hamburger"]}>
            <FaBars onClick={() => setIsExpanded(!isExpanded)} />
            <div className={hamMenuClass}>
                {navLinks}
                <div>
                    <LogButton className={styles["nav-link"]} />
                </div>
            </div>
        </div>
    );
}

const NavMenuFull = (props) => {
    const { currentUser } = props;
    const { root, manageMenu, createMenu, waitersSection, 
        kitchenSection, barSection, cashSection, manageUsers } = NAV_ROUTES;
    
    const [ expanded, setExpanded ] = useState(null);
    const [ active , setActive ] = useState(null);

    const cbHandleExpanded = (group) => {
        setExpanded(snapshot => (snapshot === group ? null : group));
    }

    const cbClickHandler = (group) => {
        setExpanded(snapshot => (snapshot === group ? null : group));
        setActive(group);
    }

    const permittedNavLink = (route, requireAuth = true) => {
        if (requireAuth && !hasPermission(currentUser, route)) return null;
        return (
            <div className={styles["nav-link"]} onClick={() => cbClickHandler(null)} >
                <NavLink to={route.path} >{route.label}</NavLink>
            </div>
        );
    }

    const GroupedNavLinks = (props) => {
        const { subgroup } = props;
        const permitted = subgroup.filter(route => hasPermission(currentUser, route));
        if (!permitted.length) return null;

        const classListMenu = [styles["nav-link"], active === "management" ? styles["active"] : ""].join(" ");
        const classListSubmenus = [styles["submenus"], expanded === "management" ? "" : "invisible"].join(" ");

        const group = permitted.map((route, index) => {
            return (
                <div key={index} className={styles["nav-link"]} onClick={() => cbClickHandler("management")} >
                    <NavLink to={route.path}>{route.label}</NavLink>
                </div>
            );
        });

        return (
            <div className={styles["nav-linkmenu"]}>
                <div className={classListMenu} onClick={() => cbHandleExpanded("management")}>
                    Management
                </div>
                <div className={classListSubmenus}>
                    {group}
                </div>
            </div>
        );
    }

    return (
        <div className={styles["nav-menu__landscape"]}>
            {permittedNavLink(root, false)}
            <GroupedNavLinks subgroup={[manageUsers, manageMenu, createMenu]} />
            {permittedNavLink(waitersSection)}
            {permittedNavLink(kitchenSection)}
            {permittedNavLink(barSection)}
            {permittedNavLink(cashSection)}
            <LogButton className={styles["nav-link"]} />
        </div>
    );
}

const Navbar = () => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const { user } = useAuth0();

    useEffect(() => {
        if (!user) return;

        let isMounted = true;
        loadUser(isMounted);

        // set websocket connection
        const socketCleanup = subscriptions.subscribeToUsersUpdates(loadUser);

        return () => {
            socketCleanup();
            isMounted = false;
        }
    }, [user]);

    const loadUser = async (isMounted = true) => {
        const fetchedUser = await usersRequests.get(user.email);
        if (fetchedUser && isMounted) {
            setCurrentUser(() => ({...user, roles: fetchedUser.roles}));
        }
    }

    return (
        <nav>
            <NavMenuHam currentUser={currentUser} />
            <NavMenuFull currentUser={currentUser} />
        </nav>
     );
};

export default () => {
    return ( 
        <header> 
            <Navbar /> 
        </header>
    );
}