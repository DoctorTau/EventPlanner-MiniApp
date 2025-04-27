export interface Participant {
    id: number;
    telegramId: number;
    username: string;
    firstName: string;
    lastName: string;
}

export interface EventItem {
    value: EventItem | undefined;
    id: number;
    title: string;
    telegramChatId: number;
    description: string;
    eventType: number;
    eventDate: string | null;
    location: string | null;
    participants: Participant[];
}
