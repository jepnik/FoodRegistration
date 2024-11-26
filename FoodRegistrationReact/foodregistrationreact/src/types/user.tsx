export interface User {
    userId: number;
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface RegisterUser {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
