import { ScheduleItem } from "./schedule-item";

export interface Schedule {
    explanations: string[];
    tasks: ScheduleItem[];
}