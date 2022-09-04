import React, { useReducer, useContext, } from "react";
import { createPortal } from "react-dom";
import { ModalAlert, ModalConfirm } from "components/generic.js";

const SHOW_ALERT = "SHOW_ALERT";
const SHOW_CONFIRM = "SHOW_CONFIRM";
const HIDE_MODAL = "HIDE_MODAL";

const initialState = { show: null, text: "" };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ALERT:
            return {
                show: SHOW_ALERT,
                text: action.payload.text
            };
        case SHOW_CONFIRM:
            return {
                show: SHOW_CONFIRM,
                text: action.payload.text
            };
        case HIDE_MODAL:
        default:
            return {
                show: null,
                text: ""
            }
    }
};

const ModalContext = React.createContext();

const GlobalModalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ModalContext.Provider value={[state, dispatch]}>
            {children}
        </ModalContext.Provider>
    );
};

let resolveCallback = () => console.info("no function selected...");

const useModal = () => {
    const [modalState, dispatch] = useContext(ModalContext);

    const onOK = () => {
        closeModal();
        resolveCallback(true);
    };

    const onCancel = () => {
        closeModal();
        resolveCallback(false);
    };

    const displayAlert = (text) => {
        dispatch({
            type: SHOW_ALERT,
            payload: { text },
        });
    };

    const displayConfirm = (text) => {
        dispatch({
            type: SHOW_CONFIRM,
            payload: { text },
        });
        return new Promise((res, rej) => {
            resolveCallback = res;
        });
    };

    const closeModal = () => {
        dispatch({
            type: HIDE_MODAL,
        });
    };

    return { displayAlert, displayConfirm, onOK, onCancel, modalState };
}

const GlobalModal = () => {
    const { onOK, onCancel, modalState } = useModal();

    const getComponent = () => {
        switch (modalState.show) {
            case SHOW_ALERT:
                return ( <ModalAlert onOK={onOK} message={modalState?.text ?? ""} />  );
            case SHOW_CONFIRM:
                return ( <ModalConfirm onOK={onOK} onCancel={onCancel} message={modalState?.text ?? ""} />  );
            default:
                return null;
        }
    }

    return createPortal(getComponent(), document.getElementById("root-modal"));
};

export { GlobalModalProvider, GlobalModal, useModal };
