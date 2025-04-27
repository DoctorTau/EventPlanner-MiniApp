export interface TaskModel {
    id: number;
    title: string;
    eventId: number;
    assignedTo?: number;
    status: number;
}
