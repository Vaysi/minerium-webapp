import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useMemo, useState} from "react";
import {createTheme, PaletteMode, ThemeProvider} from "@mui/material";
import {getDesignTokens} from "../utils/themes";

function MyApp({Component, pageProps}: AppProps) {
    const [mode, setMode] = useState<PaletteMode>('light');
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp
