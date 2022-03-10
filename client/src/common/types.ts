export type LGAEvent = {
    title: string | null;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    id: string;
    eventImageUrl: string | null;
    eventUrl: string | null;
}