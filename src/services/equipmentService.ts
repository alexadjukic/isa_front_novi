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

export function addEquipmentToAppointment(eq: Equipment): Promise<AxiosResponse<Equipment>> {
    return api.put<Equipment>(`equipment/addToAppointment`, eq);
}

export async function deleteEquipmentById(id: number): Promise<void>{
    await api.delete('equipment/' + id);
}

export function getEquipmentById(id: number): Promise<AxiosResponse<Equipment>>{
    return api.get<Equipment>(`equipment/` + id);
}

export function updateEquipment(
    equipment: Equipment,
): Promise<AxiosResponse<Equipment>> {
    return api.put<Equipment>('equipment', equipment);
}