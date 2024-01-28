import { AxiosResponse } from "axios";
import { Address } from "../model/address";
import api from "../lib/axios";

export function getAddressById(addressId: number): Promise<AxiosResponse<Address>> {
    return api.get<Address>(`address/${addressId}`);
}