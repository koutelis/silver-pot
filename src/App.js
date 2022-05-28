import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GlobalModalProvider, GlobalModal } from "store/hooks.js";
import Header from "sections/Header.js";
import Main from "sections/Main.js";
import Footer from "sections/Footer.js"

/**
 * MASTER container of all
 * @returns {JSX}
 */
const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <GlobalModalProvider>
                <Main />
                <GlobalModal />
            </GlobalModalProvider>
            <Footer />
        </BrowserRouter>
    );
}

export default App;