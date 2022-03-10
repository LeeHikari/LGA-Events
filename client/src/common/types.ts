export type LGAEvent = {
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    id: string;
    eventImageUrl: string;
    eventUrl: string;
}