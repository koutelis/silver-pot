import io from "socket.io-client";
import { WEB_SOCKETS } from "store/config.js";

const socket = io(WEB_SOCKETS.orders);

/**
 * Get new WebSocket to subscript to the MongoDB orders collection.
 * @returns {function} - WebSocket listener removal function
 */
const ordersSubscribe = (onChangeHandler, event) => {
    socket.on(event, onChangeHandler);

    const cleanup = () => socket.off(event, onChangeHandler);
    return cleanup;
}

const ordersSubscriptions = {
    orderUpdates: (onChangeHandler) => ordersSubscribe(onChangeHandler, "ordersUpdated"),
    menuUpdates: (onChangeHandler) => ordersSubscribe(onChangeHandler, "menuUpdated")
}

export { ordersSubscriptions };