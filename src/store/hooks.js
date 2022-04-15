import { useEffect } from "react";

/**
 * Custom hook.
 * Run a first-time only useEffect where its callback is asyncronous and thenable.
 * Acts as failsafe if the component dismounts during a pending callback.
 * @param {function} cbAsync 
 * @param {function} onSuccess 
 */
const useAsync = (cbAsync, onSuccess) => {
    useEffect(() => {
        let isActive = true;
        cbAsync().then(response => {
            if (isActive) onSuccess(response);
        });
        return () => { isActive = false };
    }, [])
}

export { useAsync };