export interface User {
    userId: number;
    email: string;
    password: string;
}

export interface LoginType {
    email: string;
    password: string;
}

export interface RegisterUserType {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordType {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
