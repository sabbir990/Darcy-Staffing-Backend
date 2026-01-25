export interface ISlot {
    _id?: string;
    time: string; // e.g., "09:00 AM"
    status: 'Available' | 'Booked';
    clientName?: string;
    clientPhone?: string;
}

export interface IAvailability {
    _id?: string;
    userId: string;
    date: string; // Format: "YYYY-MM-DD"
    slots: ISlot[];
    createdAt?: Date;
    updatedAt?: Date;
}