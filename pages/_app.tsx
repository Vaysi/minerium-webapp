import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useEffect, useMemo, useState} from "react";
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import {getDesignTokens} from "../utils/themes";
import {themeModeContext} from "../utils/context";

function MyApp({Component, pageProps}: AppProps) {
    const [mode, setMode] = useState<PaletteMode>('light');
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    useEffect(() => {
        // @ts-ignore
        document.querySelector("body").setAttribute('data-theme',mode)
    },[mode]);


    return (
        <ThemeProvider theme={theme}>
            <themeModeContext.Provider value={{mode, setMode}}>
                <Component {...pageProps} />
            </themeModeContext.Provider>
        </ThemeProvider>
    );
}

export default MyApp
