export enum Role {
    user = 'user',
    admin = 'admin'
}

export enum Status {
    active = 'active',
    inactive = 'inactive'
}

export interface IUser {
    id ?: string;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    password ?: string;
    role: Role | 'user';
    status: Status | 'active';
    image: string;
}
