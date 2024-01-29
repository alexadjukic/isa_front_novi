import { Equipment } from "./equipment";

export type Appointment = {
    id: number;
    dateTime: Date;
    duration: number;
    status: AppointmentStatus;
    companyId: number;
    reserved: boolean;
    userId?: number;
    adminId: number;
    pickUpDateTime?: Date;
    equipmentList: Equipment[];
}

export enum AppointmentStatus {
    NEW,
    PROCESSED,
    DENIED,
    PICKEDUP,
    PENALISED
}