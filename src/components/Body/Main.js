import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ROLES } from "store/config.js";
import { hasPermission } from "store/auth.js";
import { subscriptions, usersRequests } from "store/connections";
import Home from "components/Home.js";
import ManageUsers from "components/ManageUsers/ManageUsers.js";
import ManageMenu from "components/ManageMenu/ManageMenu.js";
import CreateMenu from "components/CreateMenu/CreateMenu.js";
import WaitersSection from "components/WaitersSection/WaitersSection.js";
import KitchenSection from "components/KitchenSection/KitchenSection.js";
import BarSection from "components/BarSection/BarSection.js";
import CashierSection from "components/CashierSection/CashierSection.js";
import { NotFound } from "components/generic.js";


export const NAV_ROUTES = {
    root: {path: "/", component: ManageMenu, label: "HOME", permissions: [ROLES.GUEST]},
    manageUsers: {path: "/manageUsers", component: ManageUsers, label: "Users", hamLabel: "Manage Users", permissions: [ROLES.ADMIN, ROLES.MANAGER]},
    manageMenu: {path: "/manageMenu", component: ManageMenu, label: "Restaurant Menu-Items", hamLabel: "Manage Menu", permissions: [ROLES.ADMIN, ROLES.MANAGER]},
    createMenu: {path: "/createMenu", component: CreateMenu, label: "Restaurant Menu", hamLabel: "Create Menu", permissions: [ROLES.ADMIN, ROLES.MANAGER]},
    waitersSection: {path: "/waiters", component: WaitersSection, label: "Waiters", permissions: [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER]},
    kitchenSection: {path: "/kitchen", component: KitchenSection, label: "Kitchen", permissions: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CHEF]},
    barSection: {path: "/bar", component: BarSection, label: "Bar", permissions: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BARISTA]},
    cashSection: {path: "/cashier", component: CashierSection, label: "Cashdesk", permissions: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER]},
    notFound: {path: "*", component: NotFound, label: "404 - Not Found", permissions: [ROLES.GUEST]},
}

const authenticatedRoute = (user, route) => {
    const { isAuthenticated } = useAuth0();
    if (!isAuthenticated) return <Home />;

    const Component = route.component;  // capitalize per JSX rule
    return hasPermission(user, route) ? <Component /> : <Home />;
}


export default () => {
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

    if (!currentUser) return null;

    return (
        <main>
            <Routes>
                <Route path={NAV_ROUTES.root.path} element={<Home />} />
                <Route path={NAV_ROUTES.manageMenu.path} element={authenticatedRoute(currentUser, NAV_ROUTES.manageMenu)} />
                <Route path={NAV_ROUTES.createMenu.path} element={authenticatedRoute(currentUser, NAV_ROUTES.createMenu)} />
                <Route path={NAV_ROUTES.waitersSection.path} element={authenticatedRoute(currentUser, NAV_ROUTES.waitersSection)} />
                <Route path={NAV_ROUTES.kitchenSection.path} element={authenticatedRoute(currentUser, NAV_ROUTES.kitchenSection)} />
                <Route path={NAV_ROUTES.barSection.path} element={authenticatedRoute(currentUser, NAV_ROUTES.barSection)} />
                <Route path={NAV_ROUTES.cashSection.path} element={authenticatedRoute(currentUser, NAV_ROUTES.cashSection)} />
                <Route path={NAV_ROUTES.manageUsers.path} element={authenticatedRoute(currentUser, NAV_ROUTES.manageUsers)} />
                <Route path={NAV_ROUTES.notFound.path} element={<NotFound />} />
            </Routes>
        </main>
     );
}
