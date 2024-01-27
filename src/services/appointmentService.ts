import { AxiosResponse } from "axios";
import { Appointment } from "../model/appointment";
import api from "../lib/axios";

export function getAppointmentsByUserId(userId: number): Promise<AxiosResponse<Appointment[]>> {
    return api.get<Appointment[]>(`appointments/byUserId/` + userId);
}