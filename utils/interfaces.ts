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

interface WorkersGraph {
    timestamps: Array<number>;
    workers: Array<{
        name: string;
        rates: Array<number>;
    }>
}

interface WorkersList {
    bestshare: number;
    group_id: number;
    hash1d: number;
    hash1hr: number;
    hash1m: number;
    hash5m: number;
    hash7d: number;
    lastupdate: number;
    shares: number;
    uid: number;
    worker_id: number;
    worker_name: string;
}

interface WorkerGroups {
    coin: string | null;
    createdAt: string;
    id: number;
    name: string;
    updatedAt: string;
    userId: number;
}

interface AllPPS {
    pps: Array<Coins>;
    preference: string;
}

interface Coins {
    coin: string;
    yesterday: number;
    icon?: string;
}

interface Cap {
    coin: string;
    createdAt: string;
    id: number;
    priceCap: number;
    updatedAt: string;
    userId: number;
    wallet: string;
}

interface Notifications {
    activeWorkers: number;
    dailyReport: boolean;
    hashrate: number;
    totalHashrate: number;
}

export type {
    ThemeMode,
    Tab,
    User,
    UserState,
    EarningBalance,
    EarningHistory,
    WorkersGraph,
    WorkersList,
    WorkerGroups,
    AllPPS,
    Coins,
    Cap,
    Notifications
}