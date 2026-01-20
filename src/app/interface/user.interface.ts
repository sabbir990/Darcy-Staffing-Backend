interface user {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'client';
}

export type {user};