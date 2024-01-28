import { AxiosResponse } from 'axios';
import api from '../lib/axios';
import { UserDetails } from '../model/user';

export function updateUserDetails(
    user: UserDetails,
): Promise<AxiosResponse<UserDetails>> {
    return api.put<UserDetails>('users/user', user);
}


export function getUserDetailsById(userId: number): Promise<AxiosResponse<UserDetails>> {
    return api.get(`users/${userId}`);
}