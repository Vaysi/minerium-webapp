import {PaletteMode} from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        primary: {
        ...(mode === 'light'
            ? {
                main: "#043180"
            } : {
                main: "#043180"
            })
        },
    },
});