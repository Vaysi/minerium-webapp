import {PaletteMode} from "@mui/material";

export const getDesignTokens = (mode: any) => ({
    palette: {
        primary: {
            ...(mode === 'light'
                ? {
                    main: "#043180"

                } : {
                    main: "#043180"
                })
        },
        secondary: {
            main: "#CEA716"
        }
    },
});