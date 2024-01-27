import { AxiosResponse } from 'axios';
import api from '../lib/axios';
import {
    AuthenticationRequest,
    AuthenticationResponse,
    JwtPayloadDetails,
} from '../model/authentication';
import { User, UserRole } from '../model/user';
import { jwtDecode } from 'jwt-decode';


export function logIn(
    credentials: AuthenticationRequest,
): Promise<AxiosResponse<AuthenticationResponse>> {
    return api.post<AuthenticationResponse>('auth/authenticate', credentials);
}

export function getUser(token: string): User {
    try {
        const decodedToken: JwtPayloadDetails = jwtDecode<JwtPayloadDetails>(token);
    
        const username = decodedToken.sub!;
        const id = decodedToken.id;
        const role = decodedToken.role;
    
        const user = {
            username,
            id,
            role: UserRole[role as keyof typeof UserRole],
        };
    
        return user;
    } catch (error) {
        return { username: '', id: 0, role: UserRole.UNAUTHENTICATED };
    }
}

export function removeUser(): User {
    const user = { username: '', id: 0, role: UserRole.UNAUTHENTICATED };
    return user;
}