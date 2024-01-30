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

export function getDataFromQRCodeSecond(qrData: String): Promise<AxiosResponse<String>> {
    return api.put(`appointments/checkIfAppointmentValid`, qrData);
}

export function finishPickUpAppointment(qrCode: File): Promise<AxiosResponse<String>> {
    const formData = new FormData();
    formData.append("file", qrCode);
    console.log(formData);
    console.log(qrCode);
    return api.post<string>(`appointments/doPickUpEquipment`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export function getAvailableAppointments({ date, companyId }: { date: string, companyId: number }): Promise<AxiosResponse<Appointment[]>> {
    return api.get<Appointment[]>(`appointments/getAvailable/` + companyId, { params: { date }}) ;
}

export function createEmergencyAppointment(newAppointment: Appointment): Promise<AxiosResponse<Appointment>> {
    return api.post<Appointment>(`appointments`, newAppointment)
}

export function getAppointmentsByAdminId(adminId: number): Promise<AxiosResponse<Appointment[]>> {
    return api.get<Appointment[]>(`appointments/byAdminId/` + adminId);
}

export function pickUpEquipment(appointmentId: number): Promise<AxiosResponse<Appointment>> {
    return api.put<Appointment>(`appointments/pickup/${appointmentId}`);
}

export function penaliseUser({userId, appointmentId} : {userId: number, appointmentId: number}): Promise<AxiosResponse<Appointment>> {
    return api.put<Appointment>(`appointments/penaliseAfterReservation/${userId}/${appointmentId}`);
}