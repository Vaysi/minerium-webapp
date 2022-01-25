interface ThemeMode {
    mode: string;
    setMode: any;
}

interface User {
    displayName: string;
    email: string;
    expiresAt: number;
    firstName: string;
    lastName: string;
    role: string;
    security: {
        has2fa: boolean;
    }
    token: string;
    username: string;
    loggedIn: boolean;
}

interface UserState {
    user: User | null;
    setUser: any;
}

interface Tab {
    title: string;
    onClick?: any;
    link?: string;
    active: boolean;
}

interface EarningBalance {
    balance: {
        minimum: number;
        paid: number;
        price: number;
        wallet: string;
    },
    currency: string;
    total: number;
    yesterday: number;
}

interface EarningHistory {
    currency: string;
    paid: boolean;
    price: number;
    since: number;
    until: number;
}

export type {
    ThemeMode,
    Tab,
    User,
    UserState,
    EarningBalance,
    EarningHistory
}