import {createContext} from "react";

export const themeModeContext = createContext<ThemeMode>({
    mode: 'light', setMode: () => {}
});