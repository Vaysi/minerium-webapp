interface ThemeMode {
    mode: string;
    setMode: any;
}

interface Tab {
    title: string;
    onClick?: any;
    link?: string;
    active: boolean;
}

export type {
    ThemeMode,
    Tab
}