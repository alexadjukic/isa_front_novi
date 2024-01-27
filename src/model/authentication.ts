import { JwtPayload } from "jwt-decode";

export type AuthenticationResponse = {
    token: string;
}

export type AuthenticationRequest = {
    username: string;
    password: string;
}

export type JwtPayloadDetails = JwtPayload & {
    id: number,
    role: string
}