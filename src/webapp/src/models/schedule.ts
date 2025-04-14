import { ScheduleItem } from "./schedule-item";

export interface Schedule {
    explanation: string;
    tasks: ScheduleItem[];
}