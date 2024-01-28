export type Equipment = {
    id: number,
    name: string,
    type: EquipmentType,
    description: string,
    rating: number,
    price: number,
    companyId: number,
    appointmentId: number,
};

export enum EquipmentType {
    CLOTHES,
    BANDAGES,
    MEDS,
    CRUTCHES,
    SYRINGE
}