import React, { useEffect, useState } from "react";
import { LoadingSpinner, Title } from "components/generic.js";
import { LogButton, useAuth0 } from "store/auth.js";
import { getConnection, usersRequests } from "store/connections.js";
import styles from "styles/Home.module.css";

const GuestPage = (props) => {
    return (
        <>
            <Title className={styles["title"]} text="Welcome to Silver Pot staff!" />
            <p>You are currently viewed as guest.</p>
            <div>Please <span><LogButton className={styles["txt-login"]} /></span> in to continue...</div>
        </>
    );
}

const StaffPage = (props) => {
    const { user } = props;

    return (
        <>
            <Title className={styles["title"]} text="Welcome" />
            <Title className={styles["title-name"]} text={user.spName} />
            <Title className={styles["title"]} text="to Silver Pot staff!" />
        </>
    );
}

export default () => {
    const [ isConnected, setIsConnected ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ currentUser, setCurrentUser ] = useState(null);
    const { user } = useAuth0();

    useEffect(async () => {
        const interval = checkConnection();
        return () => clearInterval(interval);

    }, []);

    const checkConnection = () => {
        const interval = setInterval(async () => {
            const response = await getConnection();
            if (response) {
                clearInterval(interval);
                setIsConnected(true);
                setIsLoading(false);
            }
        }, 3000);

        return interval;
    }

    useEffect(async () => {
        let isMounted = true;
        if (isConnected && user) {
            const fetchedUser = await usersRequests.get(user.email);
            if (fetchedUser && isMounted) {
                setCurrentUser(() => ({...user, roles: fetchedUser.roles, spName: fetchedUser.name}));
            }
        }

        return () => { isMounted = false };
    }, [user, isConnected]);

    if (isLoading) return ( <LoadingSpinner text="Connecting. Please wait..." /> );

    return (
        <div className={styles["container"]}>
            {currentUser ? <StaffPage user={currentUser}/> : <GuestPage />}
        </div>
    );
}
