export interface EventItem {
    id: number;
    title: string;
    telegramChatId: number;
    description: string;
    eventDate: string | null;
    location: string | null;
}

