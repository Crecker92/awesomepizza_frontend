export type UserRole = 'customer' | 'admin';

export interface User {
    id: string;
    name: string;
    role: UserRole;
}