export interface Participant {
    telegramId: number;
    username: string;
    firstName: string;
    lastName: string;
}

export interface EventItem {
    id: number;
    title: string;
    telegramChatId: number;
    description: string;
    eventDate: string | null;
    location: string | null;
    participants: Participant[];
}
