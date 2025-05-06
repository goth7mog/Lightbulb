export interface Account {
    id: string;
    name: string;
    starting_balance: string | number;
    round_up_enabled: boolean;
    postcode?: string;
    account_type: string;
    round_up_pot?: string | number;
}

export interface Transaction {
    transaction_type: string;
    amount: string | number;
    from_account: string;
    to_account?: string;
    timestamp: string;
}

export interface Business {
    id: string;
    name: string;
    category: string;
    sanctioned: boolean;
}

export interface CreateAccountData {
    name: string;
    starting_balance: string | number;
    round_up_enabled: boolean;
    postcode?: string;
    account_type: string;
}
