import {createContext} from "react";
import {ThemeMode} from "./interfaces";

export const themeModeContext = createContext<ThemeMode>({
    mode: 'light', setMode: () => {}
});