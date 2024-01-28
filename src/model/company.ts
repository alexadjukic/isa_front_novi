import { Address } from "./address"

export type Company = {
    id: number,
    companyName: string,
    addressId: number,
    description: string,
    rating: number,
    address: Address
}