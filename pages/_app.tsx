import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useContext, useEffect, useMemo, useState} from "react";
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import {getDesignTokens} from "../utils/themes";
import {themeModeContext, userContext} from "../utils/context";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {readCookie, setCookie} from "../utils/functions";
import {DefaultSeo} from "next-seo";
import {useRouter} from "next/router";
import TawkTo from 'tawkto-react';



function MyApp({Component, pageProps}: AppProps) {
    const [mode, setMode] = useState<PaletteMode>('light');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const theme = createTheme(getDesignTokens());

    // if user exists in local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            let userData = localStorage.getItem('userData');
            if(userData){
                setUser(JSON.parse(userData));
            }
        }
        let tawk = new TawkTo('6050bc60067c2605c0b8fc56', '1f0tn94e6')
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


    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').then(
                    function (registration) {
                        console.log(
                            'Service Worker registration successful with scope: ',
                            registration.scope
                        )
                    },
                    function (err) {
                        console.log('Service Worker registration failed: ', err)
                    }
                )
            })
        }
    }, [])



    return (
        <>
            <DefaultSeo
                title="Minerium"
                description="A professional business registered under USA law. With Minerium Pool, take full control over your miners, coins you mine, with who &amp; when without ever touching your miner. Pooled, Solo, Party, and multiport. All easily accessible from within the user interface."
                canonical="https://pool.minerium.com/"
                openGraph={{
                    type: 'website',
                    locale: 'en_US',
                    url: 'https://pool.minerium.com/',
                    site_name: 'Minerium',
                }}
                twitter={{
                    handle: '@mineriumUs',
                    site: '@mineriumUs',
                    cardType: 'summary_large_image',
                }}
            />
            <ThemeProvider theme={theme}>
                <themeModeContext.Provider value={{mode, setMode}}>
                    <userContext.Provider value={{user, setUser}}>
                        <Component {...pageProps} />
                        <ToastContainer/>
                    </userContext.Provider>
                </themeModeContext.Provider>
            </ThemeProvider>
        </>
    );
}

export default MyApp
