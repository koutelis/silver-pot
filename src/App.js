import React from "react";
import { GlobalModalProvider, GlobalModal } from "store/hooks.js";
import Header from "components/Body/Header.js";
import Main from "components/Body/Main.js";
import Footer from "components/Body/Footer.js"

/**
 * MASTER container of all
 * @returns {JSX}
 */
const App = () => {
    return (
        <>
            <GlobalModalProvider>
                <Header />
                <Main />
                <Footer />
                <GlobalModal />
            </GlobalModalProvider>
        </>
    );
}

export default App;