import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useEffect, useMemo, useState} from "react";
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import {getDesignTokens} from "../utils/themes";
import {themeModeContext, userContext} from "../utils/context";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {readCookie, setCookie} from "../utils/functions";


function MyApp({Component, pageProps}: AppProps) {
    const [mode, setMode] = useState<PaletteMode>('light');
    const [user, setUser] = useState<any>(null);
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    // if user exists in local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            let userData = localStorage.getItem('userData');
            if(userData){
                setUser(JSON.parse(userData));
            }
        }
    },[]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if(user && 'loggedIn' in user && user.loggedIn == false){
                localStorage.removeItem('userData');
            }else {
                localStorage.setItem('userData',JSON.stringify(user));
            }
        }
    },[user]);

    useEffect(() => {
        let themeMode = readCookie('theme');
        //@ts-ignore
        setMode(themeMode);
        //@ts-ignore
        setCookie('theme',themeMode,999999);
    },[]);

    // set body attribute for light/dark theme
    useEffect(() => {
        // @ts-ignore
        document.getElementsByTagName('html')[0].setAttribute('data-theme', mode);
    }, [mode]);



    return (
        <ThemeProvider theme={theme}>
            <themeModeContext.Provider value={{mode, setMode}}>
                <userContext.Provider value={{user, setUser}}>
                    <Component {...pageProps} />
                    <ToastContainer/>
                </userContext.Provider>
            </themeModeContext.Provider>
        </ThemeProvider>
    );
}

export default MyApp
