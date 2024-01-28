import api from "../lib/axios";
import { Address } from "../model/address";

export function getAddressById(id: number){
    try{
        return api.get<Address>('address/' + id)
    } catch(error){
        console.error('Greška prilikom dobijanja adrese:', error);
        throw error;
    }
}