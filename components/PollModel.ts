export interface PollModel {
    pollId: number;
    eventId: number;
    options: string[];
    status: PollStatus;
}

export enum PollStatus {
    Pending = 0,
    Open = 1,
    Closed = 2
}