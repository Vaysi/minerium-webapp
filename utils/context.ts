import {createContext} from "react";
import {ThemeMode, UserState} from "./interfaces";

export const themeModeContext = createContext<ThemeMode>({
    mode: 'light', setMode: () => {}
});

export const userContext = createContext<UserState>({
    user: null, setUser: () => {}
});