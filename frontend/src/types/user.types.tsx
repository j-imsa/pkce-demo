export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    keycloakUserId: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserRegistrationRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Creator' | 'Basic';
}

export interface UserFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Creator' | 'Basic';
}