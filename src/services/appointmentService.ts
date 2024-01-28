import { AxiosResponse } from "axios";
import api from "../lib/axios";
import { Appointment } from "../model/appointment";


export function getAppointmentsByCompanyId(companyId: number){
    try{
        return api.get<Appointment[]>('appointments/byCompanyId/' + companyId);
    } catch(error){
        console.error('Greška prilikom dobijanja appointmenta:', error);
        throw error;
    }
}


export function getAppointmentsByUserId(userId: number): Promise<AxiosResponse<Appointment[]>> {
    return api.get<Appointment[]>(`appointments/byUserId/` + userId);
}

export function cancelAppointment({ appointmentId, userId }: { appointmentId: number, userId: number }): Promise<AxiosResponse<string>> {
    return api.delete(`appointments/${appointmentId}/${userId}`);
}