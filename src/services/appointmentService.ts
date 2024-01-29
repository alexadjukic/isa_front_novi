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

export function updateAppointment(appointment: Appointment): Promise<AxiosResponse<Appointment>> {
    return api.put<Appointment>(`appointments`, appointment);
}

export function cancelAppointment({ appointmentId, userId }: { appointmentId: number, userId: number }): Promise<AxiosResponse<string>> {
    return api.delete(`appointments/${appointmentId}/${userId}`);
}

export function getDataFromQRCode(qrCode: File): Promise<AxiosResponse<string>> {
    const formData = new FormData();
    formData.append("file", qrCode);
    console.log(formData);
    console.log(qrCode);
    return api.post<string>(`appointments/decodeQR`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export function createAppointment(appointment: Appointment): Promise<AxiosResponse<Appointment>> {
    return api.post<Appointment>(`appointments/createWithoutMail`, appointment)
}