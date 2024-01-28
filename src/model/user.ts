export type User = {
    id: number
    username: string
    role: UserRole
}

export type UserDetails = User & {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    addressId: number,
    phoneNumber: string,
    profession: string,
    companyId: number,
};

export enum UserRole {
    USER,
    COMPANY_ADMIN,
    SYSTEM_ADMIN,
    UNAUTHENTICATED,
}