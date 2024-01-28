import { AxiosResponse } from "axios";
import api from "../lib/axios";
import { Equipment } from "../model/equipment";


export function getAllEquipmentByCompanyId(companyId: number){
    try{
        return api.get<Equipment[]>('equipment/byCompanyId/' + companyId);
    } catch (error){
        console.error('Greška prilikom dobijanja opreme:', error);
        throw error;
    }
}

export function deleteEquipmentById(id: number){
    try{
        api.delete('equipment/' + id);
    } catch(error){
        console.error('Greška prilikom brisanja opreme:', error);
        throw error;
    }
}

export function addEquipmentToAppointment(eq: Equipment): Promise<AxiosResponse<Equipment>> {
    return api.put<Equipment>(`equipment/addToAppointment`, eq);
}